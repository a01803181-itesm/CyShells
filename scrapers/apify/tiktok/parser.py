from typing import Dict, Any

class ApifyTiktokFYPParser:
    __payload: Dict[str, Any]
    def __init__(self, payload: Dict[str, Any]) -> None:
        self.__payload = payload
    
    ...