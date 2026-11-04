from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class Omega(BaseModel):
    threat_level: str
    risks_labels: Dict[str, List[str]] = Field(default_factory=dict)
    path: str
    filename: str
    public_uri: Optional[str] = Field(default=None)