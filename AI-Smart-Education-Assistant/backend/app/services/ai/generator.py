import google.generativeai as genai
from typing import List, Dict

class AIGenerator:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def _build_context_string(self, chunks: List[Dict]) -> str:
        context_str = ""
        for i, chunk in enumerate(chunks):
            content = chunk.get("content", "")
            meta = chunk.get("metadata", {})
            doc_id = meta.get("document_id", "Unknown")
            context_str += f"--- Source {i+1} (Doc: {doc_id}) ---\n{content}\n\n"
        return context_str

    async def generate_chat_response(self, query: str, context_chunks: List[Dict], chat_history: List[Dict] = None) -> str:
        context_str = self._build_context_string(context_chunks)
        
        history_str = ""
        if chat_history:
            history_str = "Previous Conversation:\n"
            for msg in chat_history:
                role = msg.get("role", "User")
                content = msg.get("content", "")
                history_str += f"{role.capitalize()}: {content}\n"
            history_str += "\n"

        prompt = f"""
        You are an intelligent educational assistant. Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student that you don't have sufficient study material on this, but provide a helpful, general answer if possible while mentioning uncertainty.
        Always cite the source document name if you use context.

        {history_str}Context:
        {context_str}

        Student's Question:
        {query}
        """
        
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def generate_chat_stream(self, query: str, context_chunks: List[Dict], chat_history: List[Dict] = None):
        context_str = self._build_context_string(context_chunks)
        
        history_str = ""
        if chat_history:
            history_str = "Previous Conversation:\n"
            for msg in chat_history:
                role = msg.get("role", "User")
                content = msg.get("content", "")
                history_str += f"{role.capitalize()}: {content}\n"
            history_str += "\n"

        prompt = f"""
        You are an intelligent educational assistant. Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student that you don't have sufficient study material on this, but provide a helpful, general answer if possible while mentioning uncertainty.
        Always cite the source document name if you use context.

        {history_str}Context:
        {context_str}

        Student's Question:
        {query}
        """
        
        response = await self.model.generate_content_async(prompt, stream=True)
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def generate_quiz(self, context_chunks: List[Dict], difficulty: str = "Medium", num_questions: int = 5) -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        You are a teacher. Create a {difficulty} difficulty quiz with {num_questions} multiple-choice questions based ONLY on the following study materials.
        Output MUST be in a strict JSON array format with fields: "question", "options" (array of 4 strings), "answer" (correct string), and "explanation".
        Do not output any markdown formatting like ```json, just the raw array.

        Context:
        {context_str}
        """
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def generate_flashcards(self, context_chunks: List[Dict], num_flashcards: int = 5) -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        Create {num_flashcards} flashcards from the provided study material.
        Output MUST be in a strict JSON array format with fields: "question", "answer".
        Do not output any markdown formatting like ```json, just the raw array.

        Context:
        {context_str}
        """
        response = await self.model.generate_content_async(prompt)
        return response.text
        
    async def generate_study_plan(self, topics: str, days: int, hours_per_day: int) -> str:
        prompt = f"""
        Create a detailed study plan for a student who needs to study the following topics: {topics}.
        They have {days} days until the exam, and can study {hours_per_day} hours per day.
        Provide a day-by-day structured plan.
        """
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def generate_notes(self, context_chunks: List[Dict], note_type: str = "Summary Notes") -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        Generate {note_type} from the provided study material.
        Structure the notes logically with headings, bullet points, and highlight key definitions or formulas where applicable.

        Context:
        {context_str}
        """
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def generate_teacher_response(self, query: str, context_chunks: List[Dict], mode: str = "Beginner", chat_history: List[Dict] = None) -> str:
        context_str = self._build_context_string(context_chunks)
        
        mode_instruction = ""
        if mode.lower() == "beginner":
            mode_instruction = "Explain concepts very simply, as if to a beginner. Use simple analogies and break down complex ideas step-by-step."
        elif mode.lower() == "advanced":
            mode_instruction = "Explain concepts in an advanced, detailed manner, suitable for an expert or higher-level student. Compare related concepts."
        else:
            mode_instruction = "Explain step-by-step and provide clear examples like a supportive teacher."

        history_str = ""
        if chat_history:
            history_str = "Previous Conversation:\n"
            for msg in chat_history:
                role = msg.get("role", "User")
                content = msg.get("content", "")
                history_str += f"{role.capitalize()}: {content}\n"
            history_str += "\n"

        prompt = f"""
        You are an expert Teacher. {mode_instruction}
        Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student gently, but provide a helpful answer mentioning uncertainty.

        {history_str}Context:
        {context_str}

        Student's Question:
        {query}
        """
        
        response = await self.model.generate_content_async(prompt)
        return response.text

ai_generator = AIGenerator()
