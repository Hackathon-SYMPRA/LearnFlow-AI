from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone

class ChatBase(BaseModel):
    user_id: str
    title: str
    messages: List[dict] = []
    total_questions: int = 0
    total_tokens: int = 0

class ChatInDB(ChatBase):
    id: str = Field(alias='_id')
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    class Config:
        populate_by_name = True

