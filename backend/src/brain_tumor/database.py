from motor.motor_asyncio import AsyncIOMotorClient
from src.brain_tumor.config.setting import get_settings

settings = get_settings()

# Initialize the MongoDB client at module level
client = AsyncIOMotorClient(settings.MONGODB_URL)

async def get_database():
    """
    Get a handle to the database
    """
    try:
        # Get the database from the client
        db = client[settings.DATABASE_NAME]
        return db
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def close_db_connection():
    """
    Close the database connection
    """
    if client:
        client.close()