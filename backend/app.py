import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from io import BytesIO
from pathlib import Path
from PIL import Image
import requests
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure local yolov5 repo is importable for torch.hub local loading
YV5_DIR = Path(__file__).resolve().parent / "yolov5"
if str(YV5_DIR) not in sys.path:
    sys.path.append(str(YV5_DIR))

# Load YOLOv5 model (custom weights)
# Using torch.hub with source='local' avoids PyTorch 2.6 safe-unpickling issues
model = torch.hub.load(str(YV5_DIR), "custom", path=str(Path(__file__).parent / "best_windows.pt"), source="local")
model.conf = 0.1   # Lower confidence threshold to catch more detections
model.iou = 0.45   # NMS IoU threshold
model.eval()

# Print model classes for debugging
print("✅ Model loaded successfully!")
print("Loaded model classes:", model.names)
print("Model confidence threshold:", model.conf)
print("Model IoU threshold:", model.iou)

def run_inference_pil(image: Image.Image):
    """Run YOLOv5 inference on a PIL image and return only the top 1 detection."""
    print(f"Running inference on image of size: {image.size}")
    print(f"Model classes available: {model.names}")
    
    results = model(image)  # inference
    df = results.pandas().xyxy[0]
    
    # Debug: Print what we detected
    print(f"Detected {len(df)} objects")
    if len(df) > 0:
        print("Raw detections:")
        for _, row in df.iterrows():
            print(f"  - {row['name']} (confidence: {row['confidence']:.3f})")
    else:
        print("No detections found!")
    
    # Return only the top 1 detection (highest confidence)
    if len(df) > 0:
        # Sort by confidence in descending order and take the first one
        top_detection = df.sort_values('confidence', ascending=False).iloc[0]
        
        detection = {
            "xmin": float(top_detection["xmin"]),
            "ymin": float(top_detection["ymin"]),
            "xmax": float(top_detection["xmax"]),
            "ymax": float(top_detection["ymax"]),
            "confidence": float(top_detection["confidence"]),
            "class": int(top_detection["class"]),
            "name": str(top_detection["name"]),
        }
        
        print(f"Top prediction: {detection['name']} (confidence: {detection['confidence']:.3f})")
        return [detection]  # Return as list for consistency
    else:
        return []  # Return empty list if no detections

@app.route("/detect", methods=["POST"])
def detect():
    """Accepts JSON with image URLs or multipart file upload; returns YOLOv5 detections."""
    detections = []

    # Case 1: multipart/form-data with files
    if request.files:
        for file_key in request.files:
            file = request.files[file_key]
            try:
                image = Image.open(file.stream).convert("RGB")
                dets = run_inference_pil(image)
                detections.append({"source": file.filename, "detections": dets})
            except Exception as e:
                detections.append({"source": file.filename, "error": str(e)})
        return jsonify({"results": detections})

    # Case 2: application/json with base64 images or URLs
    try:
        data = request.get_json(silent=True) or {}
        images = data.get("images", [])
    except Exception:
        images = []

    if not images:
        return jsonify({"error": "No images provided. Send files or JSON {images: [...]}"}), 400

    for i, image_data in enumerate(images):
        try:
            # Check if it's a base64 image
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                # Extract base64 data from data URL
                header, encoded = image_data.split(',', 1)
                image_bytes = base64.b64decode(encoded)
                image = Image.open(BytesIO(image_bytes)).convert("RGB")
                source = f"image_{i}"
            else:
                # Assume it's a URL
                response = requests.get(image_data, timeout=15)
                response.raise_for_status()
                image = Image.open(BytesIO(response.content)).convert("RGB")
                source = image_data
            
            dets = run_inference_pil(image)
            detections.append({"source": source, "detections": dets})
        except Exception as e:
            detections.append({"source": f"image_{i}", "error": str(e)})

    return jsonify({"results": detections})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)