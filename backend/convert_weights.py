import torch
import sys
import pathlib

# Add yolov5 directory to Python path so it can find the models module
sys.path.append('yolov5')

# Monkey patch pathlib.PosixPath to work on Windows BEFORE importing anything else
pathlib.PosixPath = pathlib.Path

# Load the checkpoint (your YOLOv5 weights) with weights_only=False for conversion
print("Loading weights...")
ckpt = torch.load("best.pt", map_location="cpu", weights_only=False)

# Replace any Path objects with strings (Windows compatibility)
def convert_paths(obj):
    if isinstance(obj, dict):
        return {k: convert_paths(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_paths(item) for item in obj]
    elif isinstance(obj, pathlib.Path):
        return str(obj)
    else:
        return obj

print("Converting paths...")
ckpt = convert_paths(ckpt)

# Save the converted checkpoint
print("Saving converted weights...")
torch.save(ckpt, "best_windows.pt")

print("✅ Weights converted successfully! Saved as best_windows.pt")
