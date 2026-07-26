# LearnFlow-AI 🧠📚
An intelligent, AI-powered study companion designed to transform the way students learn. By leveraging Retrieval-Augmented Generation (RAG) and advanced LLMs, LearnFlow-AI turns any uploaded document into an interactive learning experience.

## ✨ Features
- 📄 **Smart Document Parsing**: Upload PDFs, DOCX, TXT, or even images. The system extracts text automatically using OCR and parses it into intelligent chunks.
- 💬 **Context-Aware AI Chat**: Ask questions directly based on your uploaded study materials. The AI will strictly answer based on the context provided.
- 📝 **Automated Study Materials**:
  - **Quizzes**: Generate multiple-choice quizzes with explanations.
  - **Flashcards**: Automatically create study flashcards categorized by difficulty.
  - **Mind Maps**: Visualize complex topics with dynamically generated mind maps.
  - **Notes**: Summarize entire documents into neat, readable notes.
- 🧑‍🏫 **AI Teacher Mode**: Get concepts explained in a 'Beginner' or 'Advanced' mode, just like a real teacher would.
- 🎤 **Mock Tests**: Practice vocal mock tests. The AI asks you questions one-by-one and evaluates your answers conceptually.

## 📸 Screenshots
*(Add your project screenshots here by replacing the placeholder image links or placing the images inside the `assets/` folder)*

| Dashboard | AI Chat |
| :---: | :---: |
| ![Dashboard Placeholder](assets/dashboard.png) <br> *(Replace with your dashboard image)* | ![Chat Placeholder](assets/chat.png) <br> *(Replace with your chat image)* |

| Mind Map Generation | Flashcards & Quizzes |
| :---: | :---: |
| ![Mind Map Placeholder](assets/mindmap.png) <br> *(Replace with your mind map image)* | ![Flashcards Placeholder](assets/flashcards.png) <br> *(Replace with your flashcards image)* |

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS
- React Flow (for Mind Maps)

**Backend:**
- FastAPI (Python)
- MongoDB (Motor for Async operations)
- ChromaDB (Vector Database for RAG)
- Groq AI (`llama-3.1-8b-instant`, `llama-3.2-11b-vision-preview`)
- LangChain (for Chunking and Embeddings)
- Tesseract OCR / pdfplumber (for Document Parsing)

## 🚀 Getting Started

### Prerequisites
- Node.js
- Python 3.9+
- MongoDB instance (Local or Atlas)
- Groq API Key and Google Gemini API Key

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate  
   
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` directory and add your credentials:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_secret_key
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
This project is configured for deployment on Render. A `render.yaml` file is included in the root directory for deploying both the frontend (Static Site) and backend (Web Service).

---
**Made with ❤️ during Hackathon SYMPRA**
