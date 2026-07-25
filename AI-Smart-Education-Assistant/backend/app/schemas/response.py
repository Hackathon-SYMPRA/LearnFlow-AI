from typing import Any, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class SuccessResponse(BaseModel):
    status: str = "success"
    message: str
    data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ErrorResponse(BaseModel):
    status: str = "error"
    error: str
    message: str
    validation_details: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
