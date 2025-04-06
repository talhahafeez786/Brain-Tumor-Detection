# backend/scripts/init_db.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING

async def init_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.brain_tumor_db
    
    # Create collections if they don't exist
    if "predictions" not in await db.list_collection_names():
        await db.create_collection("predictions")
        print("Created 'predictions' collection")
        
        # Create indices
        await db.predictions.create_index([("prediction_date", ASCENDING)])
        print("Created index on prediction_date")
    else:
        print("'predictions' collection already exists")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_db())