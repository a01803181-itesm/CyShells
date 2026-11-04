import asyncio
from typing import Optional

from models.tiktok import Tiktok
from pipelines.database import save_tiktok
from pipelines.storage import upload_media
from tiktok.orchestrator import scrape_tiktok_fyp
from utils.logger import logger, SUCCESS

async def main():
    logger.info("Initialising CyShells Apify Scraper Agent...")

    tiktok: Optional[Tiktok] = await scrape_tiktok_fyp()

    if not tiktok: return

    if tiktok:
        logger.log(SUCCESS, f"Apify data successfully mapped to Tiktok Pydantic Model")

        public_uri = upload_media(tiktok.cover_url, f"cover_{tiktok.id}.jpg")

        if not public_uri: return

        tiktok.cover_url = public_uri

        await save_tiktok(tiktok)
    else:
        logger.error("Failed to extract or validate the listing data from Apify")

if __name__ == "__main__":
    asyncio.run(main())