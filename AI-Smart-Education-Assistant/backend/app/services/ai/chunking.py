from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict

class TextChunker:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
            separators=["\n\n", "\n", " ", ""]
        )
        
    def create_chunks(self, text: str, metadata: Dict) -> List[Dict]:
        """
        Splits text into chunks and attaches metadata to each chunk.
        """
        chunks = self.text_splitter.split_text(text)
        
        documents = []
        for i, chunk in enumerate(chunks):
            chunk_meta = metadata.copy()
            chunk_meta["chunk_number"] = i + 1
            documents.append({
                "content": chunk,
                "metadata": chunk_meta
            })
            
        return documents

chunker = TextChunker()
