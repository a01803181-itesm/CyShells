import json
from pathlib import Path
import sys
import unittest

from pydantic import HttpUrl

from tiktok.parser import ApifyTiktokFYPParser
from models.tiktok import TiktokUser

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, BASE_DIR)

class TestApifyTikTokFYPParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        json_path = BASE_DIR / "tiktok" / "examples" / "response.json"
        try:
            with open(json_path, "r", encoding="utf-8") as file:
                payload = json.load(file)
            cls.parser = ApifyTiktokFYPParser(payload[0])
        except FileNotFoundError:
            raise FileNotFoundError(f"Test file not found at {json_path}")

    def test_tiktok_id(self):
        self.assertEqual(self.parser.id, "7695580228508339470")

    def test_url(self):
        self.assertEqual(self.parser.url, HttpUrl("https://www.tiktok.com/@elsanta100/video/7695580228508339470"))

    def test_user(self):
        user = TiktokUser(
            id="7051835262595712005",
            username="elsanta100",
            nickname="𝐸𝐿 𝑂𝑁𝐷𝐸𝐴𝐷𝑂777😎😈💯",
            avatar_url=HttpUrl("https://p19-common-sign.tiktokcdn.com/tos-maliva-avt-0068/d82754ccf21d2151b3628b8a7af0a9ee~tplv-tiktokx-cropcenter-q:720:720:q70.webp?dr=10795&refresh_token=27bf36aa&x-expires=1793599200&x-signature=dgUYCRp0f22rYX2Ez4eFbcISuAA%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1a816805&idc=my&sc=avatar&s=FEED&biz_tag=feedv2.avatar"),
            followers=0,
            following=0,
            total_likes_received=20,
            total_tiktoks=1
        )
        self.assertEqual(self.parser.user, user)

    def test_stats(self):
        plays_count, diggs_count, comments_count, shared_count = self.parser.stats
        self.assertEqual(plays_count, 6177)
        self.assertEqual(diggs_count, 20)
        self.assertEqual(comments_count, 762)
        self.assertEqual(shared_count, 71)

    def test_details(self):
        self.assertEqual(len(self.parser.hashtags), 0)
        self.assertEqual(len(self.parser.emojis), 0)

    def test_cover(self):
        self.assertEqual(self.parser.cover, HttpUrl("https://p16-common-sign.tiktokcdn.com/tos-useast5-p-0068-tx/oo8VhUjfI8MmeMJQdMWLFQhYHKSIQACxG9GkfA~tplv-tiktokx-shrink_ep:640:640:q78.webp?dr=1346&refresh_token=a5ebb341&x-expires=1793599200&x-signature=mlrpKqUchllHBaO2ZEsYN6H7jLk%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1a816805&idc=my&biz_tag=tt_video&s=FEED&sc=cover&bas=android_bas"))

if __name__ == "__main__":
    unittest.main(verbosity=2)