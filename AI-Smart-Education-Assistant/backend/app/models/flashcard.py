from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

class FlashcardBase(BaseModel):
    user_id: str
    subject_id: Optional[str] = None
    question: str
    answer: str
    difficulty: str

class FlashcardInDB(FlashcardBase):
    id: str = Field(alias='_id')
    created_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    class Config:
        populate_by_name = True

