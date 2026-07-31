import os
import sys

# Monkey patch posthog telemetry globally to prevent chromadb 0.5.0 crash
class MockPosthog:
    def __init__(self, *args, **kwargs): pass
    def capture(self, *args, **kwargs): pass

sys.modules['posthog'] = MockPosthog()

# Monkey patch sqlite3 to use newer pysqlite3 on Linux (Render)
try:
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

import chromadb

# Monkey patch for ChromaDB pysqlite3 TypeError: object of type 'int' has no len()
try:
    import chromadb.segment.impl.metadata.sqlite as sqlite_metadata
    original_decode_seq_id = getattr(sqlite_metadata, '_decode_seq_id', None)

    if original_decode_seq_id:
        def safe_decode_seq_id(seq_id_bytes):
            if isinstance(seq_id_bytes, int):
                return seq_id_bytes
            return original_decode_seq_id(seq_id_bytes)
            
        sqlite_metadata._decode_seq_id = safe_decode_seq_id
except (ImportError, AttributeError):
    pass

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
