from fastapi import APIRouter, Depends, Query
from app.core.db import reports_collection
from app.api.dependencies import get_current_user  

router = APIRouter()

# Get all reports for the current user (requires login)
@router.get("/")
async def get_reports(username: str = Depends(get_current_user)):
    reports = list(reports_collection.find({"scanned_by": username}, {"_id": 0}))
    return {"reports": reports}

# Get report by target URL for the current user (requires login)
@router.get("/target")
async def get_report(
    target: str = Query(..., description="URL to get report for"),
    username: str = Depends(get_current_user)  # enforce login
):
    report = reports_collection.find_one({"target": target, "scanned_by": username}, {"_id": 0})
    return report or {"error": "Report not found"}
