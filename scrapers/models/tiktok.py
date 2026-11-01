from datetime import datetime, UTC
from enum import Enum
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List

class Platform(Enum):
    TIKTOK = "tiktok"

class TiktokUser(BaseModel):
    id: str
    username: Optional[str] = Field(default="Unknown")
    nickname: Optional[str] = Field(default=None)
    avatar_url: Optional[HttpUrl] = Field(default=None)
    followers: int
    following: int
    total_likes_received: int
    total_tiktoks: int

class Tiktok(BaseModel):
    id: str
    url: HttpUrl
    user: TiktokUser
    description: Optional[str] = Field(default=None)
    created: datetime
    cover_url: Optional[HttpUrl] = Field(default=None)
    plays_count: int
    diggs_count: int
    comments_count: int
    shared_count: int
    hashtags: List[str] = Field(default=[])
    emojis: List[str] = Field(default=[])
    scraped_at: datetime = Field(default=datetime.now(UTC))