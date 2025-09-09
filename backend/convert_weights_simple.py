import os
import sys
from pathlib import Path
import torch
import pathlib

# Add yolov5 directory to Python path (same as detect.py)
FILE = Path(__file__).resolve()
ROOT = FILE.parents[0] / 'yolov5'  # YOLOv5 root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH

# Monkey patch pathlib.PosixPath to work on Windows
pathlib.PosixPath = pathlib.Path

# Load the checkpoint (your YOLOv5 weights)
print("Loading weights...")
ckpt = torch.load("best.pt", map_location="cpu", weights_only=False)

# Replace any Path objects with strings (Windows compatibility)
def convert_paths(obj):
    if isinstance(obj, dict):
        return {k: convert_paths(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_paths(item) for item in obj]
    elif isinstance(obj, Path):
        return str(obj)
    else:
        return obj

print("Converting paths...")
ckpt = convert_paths(ckpt)

# Save the converted checkpoint
print("Saving converted weights...")
torch.save(ckpt, "best_windows.pt")

print("✅ Weights converted successfully! Saved as best_windows.pt")
