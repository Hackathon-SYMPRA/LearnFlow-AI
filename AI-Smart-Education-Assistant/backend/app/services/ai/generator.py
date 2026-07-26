import os
from typing import List, Dict
from groq import AsyncGroq
import base64

from app.core.config import settings

class AIGenerator:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.text_model = "llama-3.1-8b-instant"
        self.vision_model = "llama-3.2-11b-vision-preview"

    def _build_context_string(self, chunks: List[Dict]) -> str:
        context_str = ""
        for i, chunk in enumerate(chunks):
            content = chunk.get("content", "")
            meta = chunk.get("metadata", {})
            doc_id = meta.get("document_id", "Unknown")
            context_str += f"--- Source {i+1} (Doc: {doc_id}) ---\n{content}\n\n"
        return context_str

    async def generate_chat_response(
        self, 
        query: str, 
        context_chunks: List[Dict], 
        chat_history: List[Dict] = None,
        language: str = "English",
        images: List[str] = None
    ) -> str:
        context_str = self._build_context_string(context_chunks)
        
        system_prompt = f"""
        You are an intelligent educational assistant. Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student that you don't have sufficient study material on this, but provide a helpful, general answer if possible while mentioning uncertainty.
        Always cite the source document name if you use context.
        Please respond entirely in the {language} language.

        Context:
        {context_str}
        """

        messages = [{"role": "system", "content": system_prompt}]

        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role not in ["system", "user", "assistant"]:
                    role = "user"
                messages.append({"role": role, "content": content})

        if images and len(images) > 0:
            content = [{"type": "text", "text": query}]
            for img_b64 in images:
                if "," in img_b64:
                    img_b64 = img_b64.split(",")[1]
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{img_b64}"
                    }
                })
            messages.append({"role": "user", "content": content})
            model_to_use = self.vision_model
        else:
            messages.append({"role": "user", "content": query})
            model_to_use = self.text_model
        
        response = await self.client.chat.completions.create(
            model=model_to_use,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].message.content

    async def generate_chat_stream(
        self, 
        query: str, 
        context_chunks: List[Dict], 
        chat_history: List[Dict] = None,
        language: str = "English",
        images: List[str] = None
    ):
        context_str = self._build_context_string(context_chunks)
        
        system_prompt = f"""
        You are an intelligent educational assistant. Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student that you don't have sufficient study material on this, but provide a helpful, general answer if possible while mentioning uncertainty.
        Always cite the source document name if you use context.
        Please respond entirely in the {language} language.

        Context:
        {context_str}
        """

        messages = [{"role": "system", "content": system_prompt}]

        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role not in ["system", "user", "assistant"]:
                    role = "user"
                messages.append({"role": role, "content": content})

        if images and len(images) > 0:
            content = [{"type": "text", "text": query}]
            for img_b64 in images:
                if "," in img_b64:
                    img_b64 = img_b64.split(",")[1]
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{img_b64}"
                    }
                })
            messages.append({"role": "user", "content": content})
            model_to_use = self.vision_model
        else:
            messages.append({"role": "user", "content": query})
            model_to_use = self.text_model
        
        stream = await self.client.chat.completions.create(
            model=model_to_use,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    async def generate_quiz(self, context_chunks: List[Dict], difficulty: str = "Medium", num_questions: int = 5) -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        You are a teacher. Create a {difficulty} difficulty quiz with {num_questions} multiple-choice questions based ONLY on the following study materials.
        Output MUST be in a strict JSON array format with fields: "question", "options" (array of 4 strings), "answer" (correct string), and "explanation".
        Do not output any markdown formatting like ```json, just the raw array.

        Context:
        {context_str}
        """
        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

    async def generate_flashcards(self, context_chunks: List[Dict], num_flashcards: int = 5) -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        Create {num_flashcards} flashcards from the provided study material.
        Output MUST be a strict JSON object containing a "flashcards" array.
        Each item in the array MUST have the following fields: 
        - "question" (string)
        - "answer" (string)
        - "difficulty" (string: "Easy", "Medium", or "Hard")
        - "subject" (string: identify the main subject/topic of the flashcard)
        
        Do not output any markdown formatting like ```json, just the raw JSON object.

        Context:
        {context_str}
        """
        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
        
    async def generate_study_plan(self, topics: str, days: int, hours_per_day: int) -> str:
        prompt = f"""
        Create a detailed study plan for a student who needs to study the following topics: {topics}.
        They have {days} days until the exam, and can study {hours_per_day} hours per day.
        Provide a day-by-day structured plan.
        """
        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

    async def generate_notes(self, context_chunks: List[Dict], note_type: str = "Summary Notes") -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        Generate {note_type} from the provided study material.
        Structure the notes logically with headings, bullet points, and highlight key definitions or formulas where applicable.

        Context:
        {context_str}
        """
        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

    async def generate_mindmap(self, context_chunks: List[Dict]) -> str:
        context_str = self._build_context_string(context_chunks)
        
        prompt = f"""
        Analyze the following study material and generate a mind map structure.
        Identify the main topic, key subtopics, and their relationships.
        Output MUST be a valid JSON object with two arrays: "nodes" and "edges".
        Nodes should have:
        - id: string (unique identifier, e.g., "1", "2")
        - position: object with x and y coordinates (e.g., {{ "x": 250, "y": 0 }})
        - data: object with label (e.g., {{ "label": "Main Topic" }})
        - style: object for styling (e.g., {{ "background": "#3B82F6", "color": "white", "padding": 10, "borderRadius": 8 }})
        Edges should have:
        - id: string (e.g., "e1-2")
        - source: string (id of source node)
        - target: string (id of target node)
        - animated: boolean (e.g. true)
        
        Arrange the nodes logically (e.g., main topic at x:400, y:50, subtopics branching out to x:150,400,650 and y:200, etc.).
        Do not output any markdown formatting like ```json, just the raw JSON object.

        Context:
        {context_str}
        """
        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content


    async def generate_teacher_response(self, query: str, context_chunks: List[Dict], mode: str = "Beginner", chat_history: List[Dict] = None) -> str:
        context_str = self._build_context_string(context_chunks)
        
        mode_instruction = ""
        if mode.lower() == "beginner":
            mode_instruction = "Explain concepts very simply, as if to a beginner. Use simple analogies and break down complex ideas step-by-step."
        elif mode.lower() == "advanced":
            mode_instruction = "Explain concepts in an advanced, detailed manner, suitable for an expert or higher-level student. Compare related concepts."
        else:
            mode_instruction = "Explain step-by-step and provide clear examples like a supportive teacher."

        system_prompt = f"""
        You are an expert Teacher. {mode_instruction}
        Use the following extracted context from study materials to answer the student's question.
        If the answer is not in the context, inform the student gently, but provide a helpful answer mentioning uncertainty.

        Context:
        {context_str}
        """
        messages = [{"role": "system", "content": system_prompt}]

        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role not in ["system", "user", "assistant"]:
                    role = "user"
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": query})

        response = await self.client.chat.completions.create(
            model=self.text_model,
            messages=messages,
            temperature=0.7
        )
        return response.choices[0].message.content

ai_generator = AIGenerator()
