from app.repositories.base import BaseRepository
from app.models.chat import ChatInDB

chat_repo = BaseRepository[ChatInDB](model=ChatInDB, collection_name='chats')
