import torch
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
YV5_DIR = BASE_DIR / "yolov5"
WEIGHTS_PATH = BASE_DIR / "best_windows.pt"
TEST_IMG = BASE_DIR / "test.jpg"
SAVE_DIR = BASE_DIR / "runs"

# Load YOLOv5 model (custom weights)
model = torch.hub.load(str(YV5_DIR), "custom", path=str(WEIGHTS_PATH), source="local")

# Print classes from the model
print("Loaded model classes:", model.names)

# Set thresholds
model.conf = 0.1   # lower the confidence threshold
model.iou = 0.45   # NMS IoU threshold
model.eval()

# Run inference
results = model(str(TEST_IMG))
results.print()
results.save(save_dir=str(SAVE_DIR))
