from app.repositories.base import BaseRepository
from app.models.flashcard import FlashcardInDB

flashcard_repo = BaseRepository[FlashcardInDB](model=FlashcardInDB, collection_name='flashcards')
