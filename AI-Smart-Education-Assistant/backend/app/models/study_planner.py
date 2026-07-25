from pydantic import BaseModel, Field
from typing import Optional, List

class StudyPlannerBase(BaseModel):
    user_id: str
    exam_date: str
    daily_hours: int
    study_schedule: List[dict] = []
    progress: int = 0
    completion_status: str = 'In Progress'

class StudyPlannerInDB(StudyPlannerBase):
    id: str = Field(alias='_id')
    class Config:
        populate_by_name = True

