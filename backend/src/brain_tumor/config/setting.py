from pydantic_settings import BaseSettings  # Updated import for newer Pydantic
from typing import List
from functools import lru_cache
from pathlib import Path
import os

class Settings(BaseSettings):
    # MongoDB settings (with explicit default)
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = "brain_tumor_db"
    
    # Model settings (with path resolution)
    MODEL_PATH: str = os.getenv("MODEL_PATH", "src/brain_tumor/models/brain_tumor_model.h5")

    #classes settings
    CLASSES_PATH: str =os.getenv("CLASSES_PATH", "src/brain_tumor/models/class_dict.npy")
    
    # API settings
    API_PREFIX: str = "/api/v1"
    
    # CORS settings (with parsing from env)
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Debug settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    @property
    def absolute_model_path(self) -> Path:
        """Returns absolute path to model file"""
        return (Path(__file__).parent.parent / self.MODEL_PATH).resolve()

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Ignore extra env vars
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()