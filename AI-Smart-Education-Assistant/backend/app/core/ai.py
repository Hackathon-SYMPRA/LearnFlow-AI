import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIProvider:
    @classmethod
    def initialize(cls):
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set. AI features will not work.")
            return
            
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            logger.info("Google Gemini AI Provider initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Google Gemini AI: {str(e)}")

ai_provider = AIProvider()
