from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.cattle import router as cattle_router
import uvicorn

app = FastAPI(
    title="BoviFace API",
    description="Cattle identification and analysis API",
    version="1.0.0"
)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cattle_router, prefix="/api/v1", tags=["cattle"])

@app.get("/")
def home():
    return {
        "message": "BoviFace API is running 🚀",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/v1/health",
            "analyze": "/api/v1/analyze",
            "breeds": "/api/v1/breeds",
            "user_analyses": "/api/v1/analyses/{user_id}",
            "delete_analysis": "/api/v1/analyses/{analysis_id}"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
