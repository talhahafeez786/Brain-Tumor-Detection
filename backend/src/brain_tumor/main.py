from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import prediction
from .config.setting import get_settings

settings = get_settings()

app = FastAPI(
    title="TumorTech : Brain Tumor Detection API",
    description="API for detecting brain tumors from MRI scans",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(prediction.router, prefix="/api/v1", tags=["predictions"])

@app.get("/")
async def root():
    return {"message": "Brain Tumor Detection API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}