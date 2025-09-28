from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from app.services import scanner
from app.core.db import reports_collection
from app.api.dependencies import get_current_user

router = APIRouter()

class ScanRequest(BaseModel):
    url: str

@router.post("/")
async def run_scan(req: ScanRequest, username: str = Depends(get_current_user)):
    # Run the scanner
    findings = scanner.run_all_checks(req.url)

    # Prepare result to store in DB
    result = {
        "target": req.url,
        "scanned_at": datetime.utcnow(),
        "status": "Completed",
        "issues": len(findings),
        "findings": findings,
        "scanned_by": username
    }

    # Insert into MongoDB
    insert_result = reports_collection.insert_one(result)

    # Return JSON-friendly response
    return {
        "id": str(insert_result.inserted_id),
        "target": req.url,
        "status": "Completed",
        "issues": len(findings),
        "findings": findings,
        "scanned_at": result["scanned_at"].isoformat(),
        "scanned_by": username
    }
