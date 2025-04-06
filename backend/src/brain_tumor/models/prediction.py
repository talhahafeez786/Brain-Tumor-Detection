from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any, List

class PredictionBase(BaseModel):
    image_name: str
    prediction: str
    confidence: float
    prediction_date: datetime = Field(default_factory=datetime.utcnow)

class PredictionCreate(PredictionBase):
    prediction_date: datetime = Field(default_factory=datetime.utcnow)
    full_result: Optional[Dict[str, Any]] = None

class PredictionResponse(PredictionBase):
    id: Optional[str] = Field(None, alias="_id")
    prediction_date: Optional[datetime] = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DetailedPredictionResponse(BaseModel):
    _id: str
    image_name: str
    prediction: str
    confidence: float
    prediction_date: datetime
    model_accuracy: float
    diagnosis: str
    tumor_type: str
    tumor_info: str
    class_probabilities: Dict[str, float]

class ReportResponse(BaseModel):
    report: str

class StatisticsResponse(BaseModel):
    total_predictions: int
    tumor_types: Dict[str, Dict[str, Any]]
    has_tumor: int
    no_tumor: int