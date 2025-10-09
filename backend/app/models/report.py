from pydantic import BaseModel
from typing import List, Optional

class Finding(BaseModel):
    name: str
    severity: str
    description: Optional[str] = None

class Report(BaseModel):
    target: str
    scanned_at: str
    status: str
    issues: int
    findings: List[Finding]
    scanned_by: str
    type: Optional[str] = None
