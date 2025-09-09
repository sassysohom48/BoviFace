# BoviFace Backend

A FastAPI-based backend service for cattle identification and analysis using computer vision and machine learning.

## Features

- 🐄 Cattle breed identification from images
- 📸 Support for overall cattle and muzzle photos
- 🔍 Health analysis capabilities
- 📊 Confidence scoring for predictions
- 🚀 RESTful API with automatic documentation

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd bovi-backend
   ```

2. **Run startup script:**
   
   **On Windows:**
   ```bash
   start.bat
   ```
   
   **On macOS/Linux:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Manual setup (alternative):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

### API Endpoints

The API will be available at `http://localhost:8000`

#### Main Endpoints:
- `GET /` - API information
- `GET /api/v1/health` - Health check
- `POST /api/v1/analyze` - Analyze cattle images
- `GET /api/v1/breeds` - Get available breeds

#### API Documentation:
- Interactive docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Usage

### Analyze Cattle Images

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -F "cattle_image=@cattle_photo.jpg" \
  -F "muzzle_image=@muzzle_photo.jpg" \
  -F "name=Bella" \
  -F "age=24" \
  -F "breed=Holstein" \
  -F "weight=500" \
  -F "location=Farm A"
```

### Response Format

```json
{
  "success": true,
  "message": "Cattle analysis completed successfully",
  "predictions": [
    {
      "breed": "Holstein Friesian",
      "confidence": 0.85
    },
    {
      "breed": "Jersey",
      "confidence": 0.72
    }
  ],
  "analysis_id": "uuid-string",
  "timestamp": "2024-01-01T12:00:00"
}
```

## Project Structure

```
bovi-backend/
├── main.py                 # FastAPI application entry point
├── models.py               # Pydantic data models
├── requirements.txt        # Python dependencies
├── start.sh               # Linux/macOS startup script
├── start.bat              # Windows startup script
├── routers/
│   └── cattle.py          # Cattle analysis endpoints
└── services/
    ├── file_service.py    # File handling utilities
    └── ml_service.py      # Mock ML prediction service
```

## Development

### Adding Real ML Models

Replace the mock predictions in `services/ml_service.py` with actual machine learning models:

1. **Load your trained model:**
   ```python
   import tensorflow as tf
   model = tf.keras.models.load_model('path/to/model')
   ```

2. **Implement prediction logic:**
   ```python
   def predict_breed(self, cattle_image_path: str, muzzle_image_path: str):
       # Preprocess images
       # Run inference
       # Return predictions
   ```

### Environment Variables

Create a `.env` file for configuration:

```env
API_HOST=0.0.0.0
API_PORT=8000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=jpg,jpeg,png
```

## Production Deployment

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
