from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CattleInfo(BaseModel):
    name: str
    age: str
    breed: Optional[str] = None
    weight: Optional[str] = None
    location: Optional[str] = None

class BreedPrediction(BaseModel):
    breed: str
    confidence: float

class AnalysisRequest(BaseModel):
    cattle_info: CattleInfo

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    predictions: List[BreedPrediction]
    analysis_id: Optional[str] = None
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime
