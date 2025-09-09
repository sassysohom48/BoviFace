from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import json
from datetime import datetime
import uuid

from models import CattleInfo, AnalysisResponse, HealthResponse
from services.file_service import file_service
from services.ml_service import ml_service
from services.firebase_service import firebase_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="BoviFace API is running",
        timestamp=datetime.now()
    )

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_cattle(
    cattle_image: UploadFile = Form(...),
    muzzle_image: UploadFile = Form(...),
    name: str = Form(...),
    age: str = Form(...),
    breed: Optional[str] = Form(None),
    weight: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None)  # Add user_id for Firebase
):
    """
    Analyze cattle images and return breed predictions
    """
    try:
        # Validate file types
        if not cattle_image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Cattle file must be an image")
        
        if not muzzle_image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Muzzle file must be an image")
        
        # Save uploaded files
        cattle_path = await file_service.save_uploaded_file(cattle_image, "cattle")
        muzzle_path = await file_service.save_uploaded_file(muzzle_image, "muzzle")
        
        # Process images
        cattle_metadata = await file_service.process_image(cattle_path)
        muzzle_metadata = await file_service.process_image(muzzle_path)
        
        # Prepare cattle info for Firebase
        cattle_info = {
            'name': name,
            'age': age,
            'breed': breed,
            'weight': weight,
            'location': location
        }
        
        # Run ML prediction with Firebase integration
        predictions = ml_service.predict_breed(
            cattle_path, 
            muzzle_path, 
            user_id=user_id,
            cattle_info=cattle_info
        )
        
        # Generate analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Clean up files (optional - you might want to keep them)
        # file_service.cleanup_file(cattle_path)
        # file_service.cleanup_file(muzzle_path)
        
        return AnalysisResponse(
            success=True,
            message="Cattle analysis completed successfully",
            predictions=predictions,
            analysis_id=analysis_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        # Clean up files on error
        try:
            file_service.cleanup_file(cattle_path)
            file_service.cleanup_file(muzzle_path)
        except:
            pass
        
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze-health")
async def analyze_cattle_health(
    cattle_image: UploadFile = Form(...),
    muzzle_image: UploadFile = Form(...)
):
    """
    Analyze cattle health from images
    """
    try:
        # Save uploaded files
        cattle_path = await file_service.save_uploaded_file(cattle_image, "cattle")
        muzzle_path = await file_service.save_uploaded_file(muzzle_image, "muzzle")
        
        # Run health analysis
        health_analysis = ml_service.analyze_cattle_health(cattle_path, muzzle_path)
        
        return {
            "success": True,
            "health_analysis": health_analysis,
            "timestamp": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health analysis failed: {str(e)}")

@router.get("/breeds")
async def get_available_breeds():
    """
    Get list of available cattle breeds
    """
    return {
        "breeds": ml_service.CATTLE_BREEDS,
        "total_count": len(ml_service.CATTLE_BREEDS)
    }

@router.get("/analyses/{user_id}")
async def get_user_analyses(user_id: str):
    """
    Get all analyses for a specific user
    """
    try:
        analyses = firebase_service.get_user_analyses(user_id)
        return {
            "success": True,
            "analyses": analyses,
            "count": len(analyses)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analyses: {str(e)}")

@router.delete("/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """
    Delete a specific analysis
    """
    try:
        success = firebase_service.delete_analysis(analysis_id)
        if success:
            return {"success": True, "message": "Analysis deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Analysis not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete analysis: {str(e)}")
