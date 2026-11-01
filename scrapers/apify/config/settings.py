from functools import lru_cache
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    APIFY_API_TOKEN: Optional[str] = Field(default=None)
    
    TIKTOK_SESSION_ID: Optional[str] = Field(default=None)

@lru_cache
def get_settings() -> Settings:
    return Settings()