from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

class QuizBase(BaseModel):
    user_id: str
    subject_id: Optional[str] = None
    difficulty: str
    total_questions: int
    score: Optional[int] = None
    percentage: Optional[float] = None
    duration: Optional[int] = None

class QuizInDB(QuizBase):
    id: str = Field(alias='_id')
    created_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    class Config:
        populate_by_name = True

