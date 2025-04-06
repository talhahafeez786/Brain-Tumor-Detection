import logging
import traceback
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json
from bson import ObjectId
from src.brain_tumor.models.prediction import PredictionCreate, PredictionResponse, DetailedPredictionResponse
from src.brain_tumor.services.model_service import ModelService
from src.brain_tumor.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Custom JSONEncoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

router = APIRouter()
model_service = ModelService()

@router.post("/predict/")
async def create_prediction(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Create a new prediction from an uploaded MRI image and return formatted report directly.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        logger.debug(f"Reading file: {file.filename}")
        contents = await file.read()
        
        logger.debug("Making prediction with model")
        prediction_result = await model_service.predict_image(contents)
        logger.debug(f"Prediction result: {prediction_result}")
        
        # Store prediction in database
        prediction = PredictionCreate(
            image_name=file.filename,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            full_result=prediction_result
        )
        
        result = await db.predictions.insert_one(prediction.dict())
        prediction_id = str(result.inserted_id)
        
        # Format the response in the exact format requested
        class_probabilities = prediction_result["class_probabilities"]
        
        # Direct response body with the exact format
        response = {
            "prediction": prediction_result["prediction"],
            "confidence": prediction_result["confidence"],
            "model_accuracy": prediction_result["model_accuracy"],
            "diagnosis": prediction_result["diagnosis"],
            "tumor_type": prediction_result["tumor_type"],
            "tumor_info": prediction_result["tumor_info"],
            "class_probabilities": class_probabilities,
            "_id": prediction_id
        }
        
        logger.debug("Returning prediction response")
        return response
        
    except RuntimeError as e:
        logger.error(f"Model prediction error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Model prediction error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Plain text report endpoint
@router.post("/predict/report/", response_model=str)
async def get_prediction_report(
    file: UploadFile = File(...),
):
    """
    Create a prediction and return just the formatted text report.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        prediction_result = await model_service.predict_image(contents)
        
        # Format as plain text report
        report = "===== Tumor Detection Report =====\n"
        report += f"Prediction: {prediction_result['prediction']}\n"
        report += f"Confidence: {prediction_result['confidence']:.2f}\n"
        report += f"Model Accuracy (Approx.): {prediction_result['model_accuracy']:.2f}%\n"
        report += f"Diagnosis: {prediction_result['diagnosis']}\n"
        
        if prediction_result['prediction'] != "notumor":
            report += f"Tumor Type: {prediction_result['tumor_type']}\n"
            report += f"Tumor Info: {prediction_result['tumor_info']}\n"
        
        report += "--- Class Probabilities ---\n"
        for class_name, prob in prediction_result['class_probabilities'].items():
            report += f"{class_name}: {prob:.2f}\n"
        
        return JSONResponse(content={"report": report})
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@router.get("/predictions/")
async def get_predictions(
    limit: int = 10,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get the most recent predictions with detailed results.
    """
    try:
        cursor = db.predictions.find().sort("prediction_date", -1).limit(limit)
        mongo_predictions = await cursor.to_list(length=limit)
        
        # Format predictions for response
        predictions = []
        for doc in mongo_predictions:
            # Make a copy of the document to avoid modifying the original
            doc_copy = dict(doc)
            
            # Convert ObjectId to string
            if "_id" in doc_copy:
                doc_copy["_id"] = str(doc_copy["_id"])
            
            # Extract and format full_result at top level if available
            if "full_result" in doc_copy:
                result = doc_copy.pop("full_result")
                # Merge the prediction details into the top level
                doc_copy.update({
                    "prediction": result["prediction"],
                    "confidence": result["confidence"],
                    "model_accuracy": result["model_accuracy"],
                    "diagnosis": result["diagnosis"],
                    "tumor_type": result["tumor_type"],
                    "tumor_info": result["tumor_info"],
                    "class_probabilities": result["class_probabilities"]
                })
            
            predictions.append(doc_copy)
            
        return predictions
    except Exception as e:
        logger.error(f"Error retrieving predictions: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error retrieving predictions: {str(e)}")

@router.get("/statistics/")
async def get_stats(db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Get statistics about predictions by tumor type.
    """
    try:
        total = await db.predictions.count_documents({})
        
        # Count by tumor type
        pipeline = [
            {"$group": {"_id": "$prediction", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        counts_cursor = db.predictions.aggregate(pipeline)
        counts = await counts_cursor.to_list(length=100)
        
        # Calculate percentages
        type_stats = {}
        for item in counts:
            tumor_type = item["_id"]
            count = item["count"]
            percentage = count / total * 100 if total > 0 else 0
            type_stats[tumor_type] = {
                "count": count,
                "percentage": round(percentage, 2)
            }
        
        return {
            "total_predictions": total,
            "tumor_types": type_stats,
            "has_tumor": sum(stats["count"] for tumor_type, stats in type_stats.items() 
                           if tumor_type != "notumor"),
            "no_tumor": type_stats.get("notumor", {}).get("count", 0)
        }
    except Exception as e:
        logger.error(f"Statistics error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Statistics error: {str(e)}")