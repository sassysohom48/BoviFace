#!/usr/bin/env python3
"""
Convert YOLOv5 weights from PosixPath to Windows-compatible format
"""
import pathlib
# Patch PosixPath BEFORE any other imports
pathlib.PosixPath = pathlib.Path

import torch
import sys
from pathlib import Path

# Add yolov5 to path
sys.path.append('yolov5')

def convert_paths(obj):
    """Recursively convert Path objects to strings"""
    if isinstance(obj, dict):
        return {k: convert_paths(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_paths(item) for item in obj]
    elif isinstance(obj, Path):
        return str(obj)
    else:
        return obj

if __name__ == "__main__":
    print("Converting best.pt to Windows-compatible format...")
    
    # Load with weights_only=False to allow custom classes
    ckpt = torch.load("best.pt", map_location="cpu", weights_only=False)
    
    # Convert all Path objects to strings
    ckpt = convert_paths(ckpt)
    
    # Save the converted checkpoint
    torch.save(ckpt, "best_windows.pt")
    
    print("✅ Conversion complete! Saved as best_windows.pt")
