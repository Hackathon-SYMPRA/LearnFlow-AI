from app.repositories.base import BaseRepository
from app.models.analytics import AnalyticsInDB

analytics_repo = BaseRepository[AnalyticsInDB](model=AnalyticsInDB, collection_name='analytics')
