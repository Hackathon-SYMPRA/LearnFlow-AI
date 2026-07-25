import chromadb
from app.core.config import settings
import os

class ChromaDatabase:
    client = None

    @classmethod
    def connect(cls):
        if not os.path.exists(settings.CHROMADB_PATH):
            os.makedirs(settings.CHROMADB_PATH)
        cls.client = chromadb.PersistentClient(path=settings.CHROMADB_PATH)
        print("Connected to ChromaDB")

    @classmethod
    def get_client(cls):
        if not cls.client:
            cls.connect()
        return cls.client

    @classmethod
    def get_or_create_collection(cls, name: str):
        client = cls.get_client()
        return client.get_or_create_collection(name=name)

chroma_db = ChromaDatabase()
