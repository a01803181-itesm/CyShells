import boto3
from botocore.client import Config, BaseClient
from botocore.exceptions import ClientError
from pipelines.config.settings import Settings, get_settings
from typing import Any, Optional

from utils.logger import logger, SUCCESS

s3_client: BaseClient

settings: Optional[Settings] = None

def init_s3() -> Any:
    global settings
    settings = get_settings()

    return boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1"
    )

def upload_media(s3_client: BaseClient, file_path: str, object_name: str) -> Optional[str]:
    logger.info(f"Inserting media file {object_name} into MinIO...")
    
    try:
        s3_client.upload_file(
            Filename=file_path,
            Bucket=settings.MINIO_BUCKET_NAME,
            Key=object_name,
            ExtraArgs={"ContentType": "image/jpeg"}
        )

        public_uri = f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_name}"

        logger.log(SUCCESS, f"Media file successfuly stored in MinIO instance. Public URI: {public_uri}")

        return public_uri
    except ClientError as e:
        logger.error(f"Failed to upload {object_name}: {e}")
        return None