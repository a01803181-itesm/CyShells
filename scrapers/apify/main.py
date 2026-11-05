import asyncio
from typing import Optional, List

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

    tiktoks: List[Tiktok] = await scrape_tiktok_fyp(items=3)

    if not tiktoks: return

    if tiktoks:
        omega = OmegaFilter()

        for i, tiktok in enumerate(tiktoks, 1):
            logger.info(f"Analysing tiktok {i}/{len(tiktoks)}. URL: https://www.tiktok.com/@{tiktok.user.username}/video/{tiktok.id}")

            analysis: Omega = await asyncio.to_thread(
                omega.analyse_and_save,
                img_url=str(tiktok.cover_url),
                video_id=tiktok.id,
                username=tiktok.user.username
            )

            logger.log(SUCCESS, f"Computer Vision analysis succeed. Threat level identified: {analysis.threat_level}")

            logger.info(f"Inserting Omega analysis image file into MinIO...")

            public_uri: Optional[str] = upload_media(
                s3_client=s3_client,
                file_path=analysis.path,
                object_name=analysis.filename,
            )

            if not public_uri: return

            logger.log(SUCCESS, f"Media file successfuly stored in MinIO instance. Public URI: {public_uri}")

            analysis.public_uri = public_uri
            tiktok.omega_analysis = analysis

            logger.info(f"Saving tiktok into MongoDB at 'tiktoks'...")

            inserted_id = await save_tiktok(tiktok)

            if not inserted_id: return

            logger.log(SUCCESS, f"Tiktok {tiktok.id} saved to MongoDB (Object ID: {inserted_id})")

        logger.log(SUCCESS, f"CyShells Intelligence pipeline terminated successfully")
    else:
        logger.error("Failed to extract or validate the listing data from Apify")

if __name__ == "__main__":
    asyncio.run(main())