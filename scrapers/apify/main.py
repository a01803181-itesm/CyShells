import asyncio
from typing import Optional

from models.ict import Omega
from models.tiktok import Tiktok
from pipelines.database import save_tiktok
from pipelines.ict.omega import OmegaFilter
from pipelines.storage import init_s3, upload_media
from tiktok.orchestrator import scrape_tiktok_fyp
from utils.logger import logger, SUCCESS

logger.info("Initialising S3 Client and YOLOv8 Model...")
s3_client = init_s3()
omega_filter = OmegaFilter()

async def main():
    logger.info("Initialising CyShells Apify Scraper Agent...")

    tiktok: Optional[Tiktok] = await scrape_tiktok_fyp()

    if not tiktok: return

    if tiktok:
        logger.log(SUCCESS, f"Apify data successfully mapped to Tiktok Pydantic Model")

        omega = OmegaFilter()

        analysis: Omega = await asyncio.to_thread(
            omega.analyse_and_save,
            img_url=str(tiktok.cover_url),
            video_id=tiktok.id,
            username=tiktok.user.username
        )

        public_uri: Optional[str] = upload_media(
            s3_client=s3_client,
            file_path=analysis.path,
            object_name=analysis.filename,
        )

        if not public_uri: return

        analysis.public_uri = public_uri
        tiktok.omega_analysis = analysis

        await save_tiktok(tiktok)
    else:
        logger.error("Failed to extract or validate the listing data from Apify")

if __name__ == "__main__":
    asyncio.run(main())