from datetime import datetime, UTC
from pydantic import HttpUrl
from typing import Optional

from apify_client import ApifyClientAsync

from models.tiktok import Tiktok
from config.settings import get_settings
from utils.logger import logger, SUCCESS
from tiktok.parser import ApifyTiktokFYPParser

async def scrape_tiktok_fyp() -> Optional[Tiktok]:
    settings = get_settings()

    if not settings.APIFY_API_TOKEN:
        logger.error('APIFY_API_TOKEN is not set in the environment variables')
        return None

    if not settings.TIKTOK_SESSION_ID:
        logger.error('TIKTOK_SESSION_ID is not set in the environment variables')

    client = ApifyClientAsync(settings.APIFY_API_TOKEN)

    run_input = {
        'maxItems': 1,
        'proxyConfiguration': {
            'useApifyProxy': True,
            'apifyProxyGroups': [
                'RESIDENTIAL'
            ],
            'apifyProxyCountry': 'MX'
        },
        'sessionId': settings.TIKTOK_SESSION_ID
    }

    logger.info(f"Triggering Apify Actor 'romy/tiktok-for-you-scraper'...")

    try:
        run = await client.actor('romy/tiktok-for-you-scraper').call(run_input=run_input)

        logger.info("Actor execution completed. Fetching results dataset...")

        dataset = client.dataset(run.default_dataset_id)

        items = await dataset.list_items()

        if not items.items:
            logger.warning("Apify Actor returned no results")
            return None

        logger.log(SUCCESS, f"Apify Actor return {len(items.items)} results!!")

        payload = items.items[0]
        parser = ApifyTiktokFYPParser(payload)

        url = parser.url if parser.url else HttpUrl("https://www.tiktok.com")
        plays_count, diggs_count, comments_count, shared_count = parser.stats

        return Tiktok(
            id=parser.id,
            url=url,
            user=parser.user,
            description=parser.description,
            created=parser.creation_datetime,
            cover_url=parser.cover,
            plays_count=plays_count,
            diggs_count=diggs_count,
            comments_count=comments_count,
            shared_count=shared_count,
            hashtags=parser.hashtags,
            emojis=parser.emojis,
            scraped_at=datetime.now(UTC)
        )
    except Exception as e:
        logger.error(f"Apify Actor execution failed: {e}")
        return None