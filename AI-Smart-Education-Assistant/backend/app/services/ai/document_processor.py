import os
import re
import pdfplumber
from docx import Document
try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

class DocumentProcessor:
    def extract_text(self, file_path: str, file_type: str) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        file_type = file_type.lower()
        if file_type == "pdf":
            raw_text = self._extract_from_pdf(file_path)
        elif file_type == "docx":
            raw_text = self._extract_from_docx(file_path)
        elif file_type == "txt":
            raw_text = self._extract_from_txt(file_path)
        elif file_type in ["jpg", "jpeg", "png"]:
            raw_text = self._extract_from_image(file_path)
        else:
            raise ValueError(f"Unsupported file type for extraction: {file_type}")
            
        return self.clean_text(raw_text)

    def clean_text(self, text: str) -> str:
        """
        Cleans the extracted text by removing extra spaces, blank lines,
        and unsupported symbols while trying to preserve useful formatting.
        """
        # Remove null characters
        text = text.replace('\x00', '')
        
        # Normalize multiple spaces to a single space
        text = re.sub(r'[ \t]+', ' ', text)
        
        # Remove consecutive blank lines
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Basic strip
        text = text.strip()
        
        return text

    def _extract_from_image(self, file_path: str) -> str:
        if not OCR_AVAILABLE:
            raise RuntimeError("OCR is not available. Please install pytesseract and Pillow.")
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            raise RuntimeError(f"Error processing Image OCR: {str(e)}")
            
    def _extract_from_pdf(self, file_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            raise RuntimeError(f"Error processing PDF: {str(e)}")
        return text
        
    def _extract_from_docx(self, file_path: str) -> str:
        text = ""
        try:
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            raise RuntimeError(f"Error processing DOCX: {str(e)}")
        return text
        
    def _extract_from_txt(self, file_path: str) -> str:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise RuntimeError(f"Error processing TXT: {str(e)}")

document_processor = DocumentProcessor()
