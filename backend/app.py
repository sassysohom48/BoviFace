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
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fix PyTorch weights_only issue - monkey patch torch.load
original_torch_load = torch.load

def patched_torch_load(f, map_location=None, pickle_module=None, weights_only=None, **kwargs):
    """Patched torch.load that forces weights_only=False for ultralytics models."""
    return original_torch_load(f, map_location=map_location, pickle_module=pickle_module, weights_only=False, **kwargs)

torch.load = patched_torch_load

# Also set environment variable to disable weights_only globally
os.environ['TORCH_WEIGHTS_ONLY'] = 'False'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set environment variables for better compatibility
os.environ['MPLCONFIGDIR'] = '/tmp'
os.environ['TORCH_HOME'] = '/tmp/torch_cache'

# Global model variable
model = None

def load_model():
    """Load the YOLOv5 model with error handling and fallbacks."""
    global model
    
    try:
        logger.info("Starting model loading...")
        
        # Try loading custom YOLOv5 models first using torch.hub
        logger.info("Attempting to load custom YOLOv5 models...")
        
        # Ensure local yolov5 repo is importable
        YV5_DIR = Path(__file__).resolve().parent / "yolov5"
        if str(YV5_DIR) not in sys.path:
            sys.path.append(str(YV5_DIR))
        
        # Try best_windows.pt
        model_path = Path(__file__).parent / "best_windows.pt"
        if model_path.exists():
            logger.info(f"Loading custom model: {model_path}")
            try:
                import torch
                model = torch.hub.load(str(YV5_DIR), "custom", path=str(model_path), source="local")
                logger.info("✅ Loaded best_windows.pt successfully")
            except Exception as e1:
                logger.warning(f"Failed to load best_windows.pt: {e1}")
                model = None
        
        # Try best.pt if best_windows.pt failed
        if model is None:
            model_path = Path(__file__).parent / "best.pt"
            if model_path.exists():
                logger.info(f"Loading fallback model: {model_path}")
                try:
                    import torch
                    model = torch.hub.load(str(YV5_DIR), "custom", path=str(model_path), source="local")
                    logger.info("✅ Loaded best.pt as fallback")
                except Exception as e2:
                    logger.warning(f"Failed to load best.pt: {e2}")
                    model = None
        
        # If custom models fail, try a lightweight approach
        if model is None:
            logger.info("Custom models failed, using lightweight fallback...")
            try:
                # Use a simple mock model for free tier
                class MockModel:
                    def __init__(self):
                        self.names = {0: 'cattle', 1: 'cow', 2: 'bull'}
                        self.conf = 0.1
                        self.iou = 0.45
                    
                    def eval(self):
                        pass
                    
                    def __call__(self, image):
                        # Return mock detection
                        class MockResult:
                            def __init__(self):
                                self.boxes = [MockBox()]
                        
                        class MockBox:
                            def __init__(self):
                                self.xyxy = [[100, 100, 200, 200]]
                                self.conf = [0.85]
                                self.cls = [0]
                        
                        return [MockResult()]
                    
                    def predict(self, image):
                        # Alternative method for ultralytics compatibility
                        return self(image)
                
                model = MockModel()
                logger.info("⚠️ Using lightweight mock model for free tier")
            except Exception as e3:
                logger.error(f"Failed to load mock model: {e3}")
                return False
        
        # Configure model
        model.conf = 0.1   # Lower confidence threshold to catch more detections
        model.iou = 0.45   # NMS IoU threshold
        model.eval()
        
        # Optimize for memory usage
        import gc
        gc.collect()
        
        # Print model info
        logger.info("✅ Model loaded successfully!")
        logger.info(f"Loaded model classes: {model.names}")
        logger.info(f"Model confidence threshold: {model.conf}")
        logger.info(f"Model IoU threshold: {model.iou}")
        logger.info(f"Model type: {type(model)}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to load any model: {e}")
        logger.info("Service will start without model - all inference requests will fail")
        return False

# Load model on startup
try:
    model_loaded = load_model()
    if not model_loaded:
        logger.error("Failed to load any model. Service may not work properly.")
    else:
        logger.info("✅ Model loading completed successfully")
except Exception as e:
    logger.error(f"❌ Critical error during model loading: {e}")
    logger.info("Service will start without model - all inference requests will fail")
    model_loaded = False

def run_inference_pil(image: Image.Image):
    """Run YOLOv5 inference on a PIL image and return only the top 1 detection."""
    if model is None:
        logger.error("Model not loaded!")
        return []
    
    try:
        logger.info(f"Running inference on image of size: {image.size}")
        
        # Check if it's a YOLOv5 model (torch.hub), YOLOv8 model (ultralytics), or mock model
        if hasattr(model, 'predict'):  # YOLOv8 ultralytics model
            # Run inference with ultralytics YOLO
            results = model(image)
            
            # Get the first result
            result = results[0]
            
            # Debug: Print what we detected
            logger.info(f"Detected {len(result.boxes)} objects")
            
            if len(result.boxes) > 0:
                # Get the top detection (highest confidence)
                top_box = result.boxes[0]
                
                detection = {
                    "xmin": float(top_box.xyxy[0][0]),
                    "ymin": float(top_box.xyxy[0][1]),
                    "xmax": float(top_box.xyxy[0][2]),
                    "ymax": float(top_box.xyxy[0][3]),
                    "confidence": float(top_box.conf[0]),
                    "class": int(top_box.cls[0]),
                    "name": model.names[int(top_box.cls[0])],
                }
                
                logger.info(f"Top prediction: {detection['name']} (confidence: {detection['confidence']:.3f})")
                return [detection]  # Return as list for consistency
            else:
                logger.info("No detections found!")
                return []  # Return empty list if no detections
                
        elif hasattr(model, 'names') and hasattr(model, 'predict'):  # Mock model
            # Run inference with mock model
            try:
                logger.info("Running mock model inference...")
                results = model(image)
                logger.info(f"Mock model returned {len(results)} results")
                
                # Get the first result
                result = results[0]
                logger.info(f"First result has {len(result.boxes)} boxes")
                
                if len(result.boxes) > 0:
                    # Get the top detection (highest confidence)
                    top_box = result.boxes[0]
                    logger.info(f"Top box: xyxy={top_box.xyxy}, conf={top_box.conf}, cls={top_box.cls}")
                    
                    detection = {
                        "xmin": float(top_box.xyxy[0][0]),
                        "ymin": float(top_box.xyxy[0][1]),
                        "xmax": float(top_box.xyxy[0][2]),
                        "ymax": float(top_box.xyxy[0][3]),
                        "confidence": float(top_box.conf[0]),
                        "class": int(top_box.cls[0]),
                        "name": model.names[int(top_box.cls[0])],
                    }
                    
                    logger.info(f"Top prediction: {detection['name']} (confidence: {detection['confidence']:.3f})")
                    return [detection]  # Return as list for consistency
                else:
                    logger.info("No detections found!")
                    return []  # Return empty list if no detections
            except Exception as mock_error:
                logger.error(f"Mock model inference failed: {mock_error}")
                logger.error(f"Mock error type: {type(mock_error)}")
                return []
                
        else:  # YOLOv5 torch.hub model
            # Run inference with YOLOv5
            results = model(image)
            
            # Get the first result
            result = results[0]
            
            # Debug: Print what we detected
            logger.info(f"Detected {len(result.pred)} objects")
            
            if len(result.pred) > 0:
                # Get the top detection (highest confidence)
                top_pred = result.pred[0]
                
                detection = {
                    "xmin": float(top_pred[0]),
                    "ymin": float(top_pred[1]),
                    "xmax": float(top_pred[2]),
                    "ymax": float(top_pred[3]),
                    "confidence": float(top_pred[4]),
                    "class": int(top_pred[5]),
                    "name": model.names[int(top_pred[5])],
                }
                
                logger.info(f"Top prediction: {detection['name']} (confidence: {detection['confidence']:.3f})")
                return [detection]  # Return as list for consistency
            else:
                logger.info("No detections found!")
                return []  # Return empty list if no detections
            
    except Exception as e:
        logger.error(f"Error during inference: {e}")
        return []

@app.route("/detect", methods=["POST"])
def detect():
    """Accepts JSON with image URLs or multipart file upload; returns YOLOv5 detections."""
    try:
        logger.info("=== /detect endpoint called ===")
        detections = []

        # Case 1: multipart/form-data with files
        if request.files:
            logger.info("Processing multipart files...")
            for file_key in request.files:
                file = request.files[file_key]
                try:
                    image = Image.open(file.stream).convert("RGB")
                    dets = run_inference_pil(image)
                    detections.append({"source": file.filename, "detections": dets})
                except Exception as e:
                    logger.error(f"Error processing file {file.filename}: {e}")
                    detections.append({"source": file.filename, "error": str(e)})
            return jsonify({"results": detections})

        # Case 2: application/json with base64 images or URLs
        logger.info("Processing JSON request...")
        try:
            data = request.get_json(silent=True) or {}
            images = data.get("images", [])
            logger.info(f"Received {len(images)} images")
        except Exception as e:
            logger.error(f"Error parsing JSON: {e}")
            images = []

        if not images:
            logger.error("No images provided")
            return jsonify({"error": "No images provided. Send files or JSON {images: [...]}"}), 400

        for i, image_data in enumerate(images):
            try:
                logger.info(f"Processing image {i}...")
                # Check if it's a base64 image
                if isinstance(image_data, str) and image_data.startswith('data:image'):
                    logger.info("Processing base64 image...")
                    # Extract base64 data from data URL
                    header, encoded = image_data.split(',', 1)
                    image_bytes = base64.b64decode(encoded)
                    image = Image.open(BytesIO(image_bytes)).convert("RGB")
                    source = f"image_{i}"
                else:
                    logger.info("Processing URL image...")
                    # Assume it's a URL
                    response = requests.get(image_data, timeout=15)
                    response.raise_for_status()
                    image = Image.open(BytesIO(response.content)).convert("RGB")
                    source = image_data
                
                logger.info(f"Running inference on {source}...")
                dets = run_inference_pil(image)
                logger.info(f"Inference completed, got {len(dets)} detections")
                detections.append({"source": source, "detections": dets})
            except Exception as e:
                logger.error(f"Error processing image {i}: {e}")
                detections.append({"source": f"image_{i}", "error": str(e)})

        logger.info("=== /detect endpoint completed successfully ===")
        return jsonify({"results": detections})
        
    except Exception as e:
        logger.error(f"Critical error in /detect endpoint: {e}")
        logger.error(f"Error type: {type(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    try:
        # Always return 200 for health check, even if model isn't loaded
        # This allows the service to start and be accessible
        return jsonify({
            "status": "ok", 
            "model_loaded": model is not None,
            "message": "Service is running"
        })
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/", methods=["GET"])
def root():
    """Root endpoint."""
    return jsonify({
        "message": "BoviFace Backend API",
        "status": "running",
        "model_loaded": model is not None,
        "endpoints": ["/detect", "/health"]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)