from flask import Flask, request, jsonify
import os
import sys
from io import BytesIO
from pathlib import Path
from PIL import Image
import requests
import torch

app = Flask(__name__)

# Ensure local yolov5 repo is importable for torch.hub local loading
YV5_DIR = Path(__file__).resolve().parent / "yolov5"
if str(YV5_DIR) not in sys.path:
    sys.path.append(str(YV5_DIR))

# Load YOLOv5 model (custom weights)
# Using torch.hub with source='local' avoids PyTorch 2.6 safe-unpickling issues
model = torch.hub.load(str(YV5_DIR), "custom", path=str(Path(__file__).parent / "best_windows.pt"), source="local")
model.eval()

def run_inference_pil(image: Image.Image):
    """Run YOLOv5 inference on a PIL image and return structured detections."""
    results = model(image)  # inference
    df = results.pandas().xyxy[0]
    detections = []
    for _, row in df.iterrows():
        detections.append({
            "xmin": float(row["xmin"]),
            "ymin": float(row["ymin"]),
            "xmax": float(row["xmax"]),
            "ymax": float(row["ymax"]),
            "confidence": float(row["confidence"]),
            "class": int(row["class"]),
            "name": str(row["name"]),
        })
    return detections

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

    # Case 2: application/json with list of URLs
    try:
        data = request.get_json(silent=True) or {}
        image_urls = data.get("images", [])
    except Exception:
        image_urls = []

    if not image_urls:
        return jsonify({"error": "No images provided. Send files or JSON {images: [...]}"}), 400

    for url in image_urls:
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert("RGB")
            dets = run_inference_pil(image)
            detections.append({"source": url, "detections": dets})
        except Exception as e:
            detections.append({"source": url, "error": str(e)})

    return jsonify({"results": detections})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)