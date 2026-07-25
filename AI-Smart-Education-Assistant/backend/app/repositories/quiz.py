from app.repositories.base import BaseRepository
from app.models.quiz import QuizInDB

quiz_repo = BaseRepository[QuizInDB](model=QuizInDB, collection_name='quizzes')
