import os
import uuid
from datetime import datetime
from typing import List
from fastapi import UploadFile
import aiofiles
from PIL import Image
import numpy as np

class FileService:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(f"{upload_dir}/cattle", exist_ok=True)
        os.makedirs(f"{upload_dir}/muzzle", exist_ok=True)
    
    async def save_uploaded_file(self, file: UploadFile, file_type: str) -> str:
        """Save uploaded file and return the file path"""
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        if file_type == "cattle":
            file_path = os.path.join(self.upload_dir, "cattle", unique_filename)
        else:
            file_path = os.path.join(self.upload_dir, "muzzle", unique_filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return file_path
    
    async def process_image(self, file_path: str) -> dict:
        """Process image and return metadata"""
        try:
            with Image.open(file_path) as img:
                return {
                    "width": img.width,
                    "height": img.height,
                    "format": img.format,
                    "mode": img.mode,
                    "size_bytes": os.path.getsize(file_path)
                }
        except Exception as e:
            return {"error": str(e)}
    
    def cleanup_file(self, file_path: str):
        """Remove file from storage"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {e}")

file_service = FileService()
