from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from app.services import ecommerce_scanner
from app.core.db import reports_collection
from app.api.dependencies import get_current_user
from bson import ObjectId

router = APIRouter()

class ScanRequest(BaseModel):
    url: str

def make_json_serializable(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, list):
        return [make_json_serializable(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    else:
        return obj

@router.post("/ecommerce")
async def run_ecommerce_scan(req: ScanRequest, username: str = Depends(get_current_user)):
    findings = ecommerce_scanner.run_all_checks(req.url)

    result = {
        "target": req.url,
        "scanned_at": datetime.utcnow(),
        "status": "Completed",
        "issues": len(findings),
        "findings": findings,
        "scanned_by": username,
        "type": "ecommerce"
    }

    insert_result = reports_collection.insert_one(result)
    result["id"] = str(insert_result.inserted_id)

    # ✅ Convert everything to JSON-safe types before returning
    return make_json_serializable(result)
