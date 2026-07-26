import os
import sys

# Monkey patch posthog telemetry globally to prevent chromadb 0.5.0 crash
class MockPosthog:
    def __init__(self, *args, **kwargs): pass
    def capture(self, *args, **kwargs): pass

sys.modules['posthog'] = MockPosthog()

import chromadb
from chromadb.config import Settings
from app.core.config import settings

class ChromaDatabase:
    client = None

    @classmethod
    def connect(cls):
        if not os.path.exists(settings.CHROMADB_PATH):
            os.makedirs(settings.CHROMADB_PATH)
            
        cls.client = chromadb.PersistentClient(
            path=settings.CHROMADB_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
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
