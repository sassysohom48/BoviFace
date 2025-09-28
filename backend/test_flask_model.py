#!/usr/bin/env python3
"""
Test script to verify Flask app model loading works locally
"""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Import the model loading function from app.py
try:
    from app import load_model, model
    print("✅ Successfully imported load_model function")
    
    # Test model loading
    print("🔄 Testing model loading...")
    success = load_model()
    
    if success:
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
        if model is not None:
            print(f"Model classes: {model.names}")
            print(f"Model confidence: {model.conf}")
            print(f"Model IoU: {model.iou}")
        else:
            print("❌ Model is None")
    else:
        print("❌ Model loading failed")
        
except Exception as e:
    print(f"❌ Error importing or testing: {e}")
    import traceback
    traceback.print_exc()
