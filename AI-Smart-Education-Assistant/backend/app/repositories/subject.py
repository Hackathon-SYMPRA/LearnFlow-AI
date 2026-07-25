from app.repositories.base import BaseRepository
from app.models.subject import SubjectInDB

subject_repo = BaseRepository[SubjectInDB](model=SubjectInDB, collection_name='subjects')
