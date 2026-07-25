from pydantic import BaseModel, Field
from typing import Optional, List

class AnalyticsBase(BaseModel):
    user_id: str
    total_study_hours: int = 0
    total_chats: int = 0
    quiz_average: float = 0.0
    weak_topics: List[str] = []
    strong_topics: List[str] = []
    learning_streak: int = 0

class AnalyticsInDB(AnalyticsBase):
    id: str = Field(alias='_id')
    class Config:
        populate_by_name = True

