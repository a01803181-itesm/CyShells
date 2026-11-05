from typing import Optional, Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection

from models.tiktok import Tiktok, TiktokUser
from pipelines.config.settings import get_settings
from utils.logger import logger, SUCCESS

_mongo_client: Optional[AsyncIOMotorClient] = None

def get_db() -> AsyncIOMotorDatabase:
    global _mongo_client
    if _mongo_client is None:
        settings = get_settings()

        uri = settings.mongo_db_uri

        _mongo_client = AsyncIOMotorClient(uri)

        logger.info(f'Connected to MongoDB cluster at {settings.MONGO_DB_HOST}:{settings.MONGO_DB_PORT}')

    return _mongo_client["cyshells"]

async def save_tiktok(tiktok: Tiktok) -> Optional[str]:
    db: AsyncIOMotorDatabase = get_db()

    collection = db["tiktoks"]

    try:
        document: AsyncIOMotorCollection = tiktok.model_dump(mode='json')

        result = await collection.insert_one(document)

        return result.inserted_id
    except Exception as e:
        logger.error(f"Failed to save tiktok to MongoDB: {e}")
        return None