import json
from typing import Any, Optional

import boto3
from botocore.client import Config, BaseClient
from botocore.exceptions import ClientError

from pipelines.config.settings import Settings, get_settings
from utils.logger import logger, SUCCESS

s3_client: BaseClient

settings: Optional[Settings] = None

def init_s3() -> Any:
    global settings
    settings = get_settings()

    client = boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1"
    )

    bucket_name = settings.MINIO_BUCKET_NAME

    try:
        client.head_bucket(Bucket=bucket_name)
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == "404":
            logger.info(f"MinIO bucket '{bucket_name}' not found. Creating it...")
            client.create_bucket(Bucket=bucket_name)

            public_policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                    }
                ]
            }

            client.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(public_policy)
            )
            logger.log(SUCCESS, f"Bucket '{bucket_name}' successfully created and set to public")
        else:
            logger.error(f"Failed to verify MinIO bucket: {e}")
            raise e
    return client

def upload_media(s3_client: BaseClient, file_path: str, object_name: str) -> Optional[str]:
    try:
        s3_client.upload_file(
            Filename=file_path,
            Bucket=settings.MINIO_BUCKET_NAME,
            Key=object_name,
            ExtraArgs={"ContentType": "image/jpeg"}
        )

        public_uri = f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_name}"

        return public_uri
    except ClientError as e:
        logger.error(f"Failed to upload {object_name}: {e}")
        return None

if __name__ == "__main__":
    s3_client = init_s3()
    public_uri = upload_media(s3_client, "omega_serranoemmanuel10_7693777902134955271_medio.jpg", "omega_serranoemmanuel10_7693777902134955271_medio.jpg")
    print(f"{public_uri = }")