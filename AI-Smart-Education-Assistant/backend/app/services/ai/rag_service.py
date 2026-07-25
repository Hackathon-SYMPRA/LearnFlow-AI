from typing import List, Dict
from app.db.chromadb import chroma_db
from app.core.config import settings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        self.collection_name = "edumind_vectors"

    def get_or_create_collection(self):
        client = chroma_db.get_client()
        if not client:
            raise RuntimeError("ChromaDB client is not initialized")
        return client.get_or_create_collection(name=self.collection_name)

    def store_documents(self, chunks: List[Dict]):
        """
        Store a list of chunks in ChromaDB.
        Each chunk is a dict with 'content' and 'metadata'.
        """
        if not chunks:
            return
            
        collection = self.get_or_create_collection()
        
        # Prepare data for ChromaDB
        documents = [chunk["content"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]
        
        # Generate unique IDs for each chunk based on document ID and chunk number
        ids = [f"{m.get('document_id', 'doc')}_{m.get('chunk_number', i)}" for i, m in enumerate(metadatas)]
        
        # We manually generate embeddings because we pass them directly, or we can use an embedding function
        # ChromaDB allows passing an embedding function directly when creating collection.
        # But to be safe and agnostic, we can generate them via LangChain and pass them.
        try:
            embedded_docs = self.embeddings.embed_documents(documents)
            collection.add(
                documents=documents,
                embeddings=embedded_docs,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"Stored {len(chunks)} chunks in ChromaDB")
        except Exception as e:
            logger.error(f"Error storing in ChromaDB: {str(e)}")
            raise RuntimeError(f"Embedding generation or storage failed: {str(e)}")

    def similarity_search(self, query: str, user_id: str, top_k: int = 5) -> List[Dict]:
        """
        Search for similar chunks in ChromaDB.
        Filters by user_id to ensure data isolation.
        """
        collection = self.get_or_create_collection()
        
        try:
            query_embedding = self.embeddings.embed_query(query)
            
            # Query chroma with metadata filter
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={"user_id": user_id}
            )
            
            # Format results
            formatted_results = []
            if results["documents"] and results["documents"][0]:
                docs = results["documents"][0]
                metas = results["metadatas"][0]
                distances = results["distances"][0] if "distances" in results and results["distances"] else [0] * len(docs)
                
                for doc, meta, dist in zip(docs, metas, distances):
                    formatted_results.append({
                        "content": doc,
                        "metadata": meta,
                        "score": dist
                    })
                    
            return formatted_results
        except Exception as e:
            logger.error(f"Error in similarity search: {str(e)}")
            return []

rag_service = RAGService()
