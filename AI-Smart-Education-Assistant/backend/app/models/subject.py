from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

class SubjectBase(BaseModel):
    user_id: str
    subject_name: str
    subject_code: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class SubjectInDB(SubjectBase):
    id: str = Field(alias='_id')
    created_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    class Config:
        populate_by_name = True

