import json
import logging
from typing import Dict, Any
from groq import AsyncGroq
from app.core.config import settings

logger = logging.getLogger(__name__)

class SympraAgentParser:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.text_model = "llama-3.1-8b-instant"

    async def parse_intent(self, transcript: str, current_page: str) -> Dict[str, Any]:
        system_prompt = """
        You are the 'Sympra Voice Agent Brain'. 
        The user has spoken a command.
        You must analyze the command and extract the intent and target parameters.
        
        Supported Intents:
        - CHAT: User wants to ask a question to the AI chat.
        - GENERATE_NOTES: User wants to generate notes from a document or topic.
        - GENERATE_MINDMAP: User wants to generate a mind map (e.g., "mind map", "mindmap").
        - AI_TEACHER_TEST: User wants to start a test/quiz with the AI Teacher.
        - GENERATE_QUIZ: User wants to generate a quiz.
        - GENERATE_FLASHCARDS: User wants to generate flashcards.
        - UNKNOWN: The intent is not recognized.

        Language Instructions:
        - YOU MUST ALWAYS set "detected_language" to "en" and your "speech_reply" MUST be in pure English language, regardless of what language the user speaks.

        You MUST output your response STRICTLY as a JSON object matching this schema:
        {
            "detected_language": "en",
            "intent": "CHAT" | "GENERATE_NOTES" | "GENERATE_MINDMAP" | "AI_TEACHER_TEST" | "GENERATE_QUIZ" | "GENERATE_FLASHCARDS" | "UNKNOWN",
            "parameters": {
                "source": "document" | "selected_document" | "topic" | null,
                "topic_name": "string or null",
                "chat_query": "string or null"
            },
            "speech_reply": "A brief, natural reply in English confirming the action."
        }
        
        Do NOT wrap the JSON in markdown blocks like ```json. Output ONLY the raw JSON object.
        """
        
        prompt = f"Current Page: {current_page}\nUser Transcript: \"{transcript}\""
        result_text = ""

        try:
            logger.info(f"Parsing intent for transcript: '{transcript}'")
            response = await self.client.chat.completions.create(
                model=self.text_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1, 
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            logger.info(f"LLM Raw JSON: {result_text}")
            return json.loads(result_text)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parsing Error: {e} - Raw output: {result_text}")
            return {
                "detected_language": "en",
                "intent": "UNKNOWN",
                "parameters": {},
                "speech_reply": "I'm sorry, I couldn't understand that."
            }
        except Exception as e:
            logger.error(f"Error parsing agent intent: {e}")
            return {
                "detected_language": "en",
                "intent": "UNKNOWN",
                "parameters": {},
                "speech_reply": "I'm sorry, I encountered an internal error."
            }

agent_parser = SympraAgentParser()
