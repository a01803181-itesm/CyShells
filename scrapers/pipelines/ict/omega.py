import requests
import os

import cv2
import numpy as np
import torch
import urllib3
from ultralytics import YOLO

from models.ict import Omega
from utils.logger import logger, SUCCESS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class OmegaFilter:
    def __init__(self):
        self.model = YOLO("yolov8x-oiv7.pt", verbose=False)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)

        self.categories = {
            "ARMAMENTO": ['weapon', 'gun', 'rifle', 'arm', 'shotgun', 'pistol', 'cannon', 'machine gun'],
            "MOVILIDAD": ['vehicle', 'truck', 'car', 'tank', 'van', 'pickup', 'land vehicle', 'ambulance'],
            "ESCENARIO": ['mountain', 'tree', 'forest', 'wood', 'plant', 'building', 'house', 'ruins', 'shack', 'wall', 'rock', 'cliff']
        }

    def _fetch_image(self, source: str):
        """Fetches an image from a URL or local path and returns a CV2 matrix."""
        if os.path.exists(source):
            return cv2.imdecode(source)

        try:
            res = requests.get(source, verify=False, timeout=10)
            if res.status_code == 200:
                return cv2.imdecode(np.frombuffer(res.content, np.uint8), cv2.IMREAD_COLOR)
            return None
        except Exception as e:
            logger.error(f"Fetch Error: {e}")

    def analyse_and_save(self, img_url: str, video_id: str, username: str, output_dir: str = "./temp_analysed") -> Omega:
        """
        Processes the image, draws bounding boxes, saves it locally,
        and returns the threat analysis telemetry.
        """

        logger.info(f"Initiating Omega Computer Vision analysis for tiktok @{username}/{video_id}...")

        img = self._fetch_image(img_url)
        if img is None:
            raise ValueError(f"Failed to fetch or decode image from {img_url}")

        results = self.model(img, verbose=False)
        risks_detected = {}
        count_categories = 0

        processed_image = results[0].plot()

        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = self.model.names[class_id].lower()

                for category, keywords in self.categories.items():
                    if any(keyword in class_name for keyword in keywords):
                        if category not in risks_detected:
                            risks_detected[category] = set()
                            count_categories += 1
                        risks_detected[category].add(class_name)

        if count_categories >= 2:
            threat_level = "ALTO"
        elif count_categories == 1:
            threat_level = "MEDIO"
        else:
            threat_level = "NULO"

        os.makedirs(output_dir, exist_ok=True)

        filename = f"omega_{username}_{video_id}_{threat_level.lower()}.jpg"
        local_filepath = os.path.join(output_dir, filename)

        cv2.imwrite(local_filepath, processed_image)

        risks_details = {k: list(v) for k, v in risks_detected.items()}

        logger.log(SUCCESS, f"Computer Vision analysis succeed. Threat level identified: {threat_level}")

        return Omega(
            threat_level=threat_level,
            risks_details=risks_details,
            path=local_filepath,
            filename=filename,
        )

if __name__ == "__main__":
    omega = OmegaFilter()
    results = omega.analyse_and_save(
        img_url="https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/okRQEBAFoQS8FRYgBpEpItQHQY9GDfeBU48qaI~tplv-tiktokx-shrink_ep:640:640:q78.webp?dr=1346&refresh_token=bd0308c5&x-expires=1793851200&x-signature=LIzmt2XDdPgCqWKoO%2BbyG2eQhN0%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1a816805&idc=sg1&bas=android_bas&biz_tag=tt_video&s=FEED&sc=cover",
        video_id="7684402906094669074",
        username="trakatra_ng",
    )

    print(f"{results = }")