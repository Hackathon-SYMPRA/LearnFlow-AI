from app.repositories.base import BaseRepository
from app.models.study_planner import StudyPlannerInDB

study_planner_repo = BaseRepository[StudyPlannerInDB](model=StudyPlannerInDB, collection_name='study_plans')
