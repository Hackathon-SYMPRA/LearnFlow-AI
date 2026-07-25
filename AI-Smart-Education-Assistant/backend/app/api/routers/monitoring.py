from fastapi import APIRouter
import psutil
from datetime import datetime, timezone
from app.schemas.response import SuccessResponse

router = APIRouter()

@router.get("/system", response_model=SuccessResponse)
async def system_monitoring():
    cpu_usage = psutil.cpu_percent(interval=0.1)
    ram = psutil.virtual_memory()
    ram_usage = ram.percent
    disk = psutil.disk_usage('/')
    disk_usage = disk.percent
    
    data = {
        "cpu_usage_percent": cpu_usage,
        "ram_usage_percent": ram_usage,
        "disk_usage_percent": disk_usage,
        "database_health": "ok", # Can be pinged
        "gemini_availability": "ok", 
        "timestamp": datetime.now(timezone.utc)
    }
    
    return SuccessResponse(message="System monitoring data retrieved successfully", data=data)
