from datetime import datetime, timezone, UTC
from pydantic import HttpUrl
from typing import Dict, Any, Optional, Tuple, List

from models.tiktok import TiktokUser

class ApifyTiktokFYPParser:
    __payload: Dict[str, Any]
    def __init__(self, payload: Dict[str, Any]) -> None:
        self.__payload = payload
    
    @property
    def id(self) -> str:
        return self.__payload.get("aweme_id", "Unknown")

    @property
    def url(self) -> Optional[HttpUrl]:
        url: Optional[str] = self.__payload.get("share_url").split("?")[0]
        return HttpUrl(url) if url else None

    @property
    def user(self) -> TiktokUser:
        user_details: Dict[str, Any] = self.__payload.get("author", {})
        id: str = user_details.get("uid", "Unknown")
        username: str = user_details.get("unique_id", "Unknown")
        nickname: Optional[str] = user_details.get("nickname", None)
        raw_avatar_url: Optional[str] = user_details.get("avatar_720", None)
        avatar_url: Optional[HttpUrl] = HttpUrl(raw_avatar_url) if raw_avatar_url else None
        followers: int = user_details.get("followers", 0)
        following: int = user_details.get("following", 0)
        _, likes, _, _ = self.stats
        total_likes_received: int = user_details.get("total_likes_received", likes)
        total_tiktoks: int = user_details.get("total_tiktoks", 1)
        return TiktokUser(
            id=id,
            username=username,
            nickname=nickname,
            avatar_url=avatar_url,
            followers=followers,
            following=following,
            total_likes_received=total_likes_received,
            total_tiktoks=total_tiktoks
        )

    @property
    def creation_datetime(self) -> datetime:
        unix_time = self.__payload.get("create_time", None)
        return datetime.fromtimestamp(unix_time, tz=timezone.utc) if unix_time else datetime.now(UTC)

    @property
    def description(self) -> Optional[str]:
        desc = self.__payload.get("desc", None)
        return desc if desc else None

    @property
    def stats(self) -> Tuple[int, int, int, int]:
        tiktok_stats: Dict[str, Any] = self.__payload.get("statistics", {})
        plays_count: int = tiktok_stats.get("play_count", 0)
        diggs_count: int = tiktok_stats.get("digg_count", 0)
        comments_count: int = tiktok_stats.get("comment_count", 0)
        shared_count: int = tiktok_stats.get("share_count", 0)
        return plays_count, diggs_count, comments_count, shared_count

    @property
    def hashtags(self) -> List[str]:
        return self.__payload.get("hashtags", [])

    @property
    def emojis(self) -> List[str]:
        return self.__payload.get("emojis", [])

    @property
    def cover(self) -> Optional[HttpUrl]:
        raw_url: Optional[str] = self.__payload.get("video", {}).get("cover", None)
        return HttpUrl(raw_url) if raw_url else None