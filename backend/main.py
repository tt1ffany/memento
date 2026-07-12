from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Memento API",
    description="API for Memento app",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Restrict to actual frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class PhotoPayload(BaseModel):
    photo_url: str

@app.post("/api/process")
async def process_photo(payload: PhotoPayload):
    try:
        # Verify data arrived by logging character length
        image_string_length = len(payload.photo_url)
        
        # Isolate the base64 data from the data URL if it exists
        raw_base64 = payload.photo_url.split(",")[-1] if "," in payload.photo_url else payload.photo_url

        print(f"Successfully received photo payload. Base64 length: {image_string_length}")

        return {
            "status": "success",
            "message": "Photo successfully uploaded to Python backend!",
            "received_bytes": len(raw_base64)
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Server failed to parse data: {str(e)}"
        }

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "message": "Memento API is running"
    }