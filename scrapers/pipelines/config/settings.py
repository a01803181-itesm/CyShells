from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    MONGO_DB_HOST: str = Field(default='localhost')
    MONGO_DB_PORT: str = Field(default='27017')

    @property
    def mongo_db_uri(self) -> str:
        return f'mongodb://{self.MONGO_DB_HOST}:{self.MONGO_DB_PORT}'

@lru_cache
def get_settings() -> Settings:
    return Settings()