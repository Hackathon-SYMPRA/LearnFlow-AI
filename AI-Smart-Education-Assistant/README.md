# 🎓 LearnFlow AI 🧠📚 (AI Smart Education Assistant)
> **An Intelligent, Multilingual, RAG-Powered AI Study Companion & Virtual Oral Examiner**  
> *Built for Hackathon SYMPRA*

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-orange.svg)](https://www.trychroma.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.1-f55036.svg)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4.svg)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_NoSQL-47A248.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📑 Table of Contents
1. [Project Overview & Core Vision](#-1-project-overview--core-vision)
2. [Key Highlights & Unique Innovations](#-2-key-highlights--unique-innovations)
3. [System Architecture & Data Flow](#-3-system-architecture--data-flow)
4. [Technology Stack & Architectural Decisions](#-4-technology-stack--architectural-decisions)
5. [Frontend Pages & Step-by-Step User Workflows](#-5-frontend-pages--step-by-step-user-workflows)
6. [Backend Services & Function-by-Function Breakdown](#-6-backend-services--function-by-function-breakdown)
7. [Hands-Free Voice AI Agent ('Hi Sympra')](#-7-hands-free-voice-ai-agent-hi-sympra)
8. [Complete REST API Reference](#-8-complete-rest-api-reference)
9. [Database Schema & Vector Architecture](#-9-database-schema--vector-architecture)
10. [Security, Performance & Gamification](#-10-security-performance--gamification)
11. [Step-by-Step Localhost Setup & Running Guide](#-11-step-by-step-localhost-setup--running-guide)
12. [Environment Variables Reference](#-12-environment-variables-reference)
13. [Cloud Deployment (Render)](#-13-cloud-deployment-render)
14. [Troubleshooting & FAQs](#-14-troubleshooting--faqs)

---

## 📌 1. Project Overview & Core Vision

**LearnFlow AI (AI-Smart-Education-Assistant)** is an end-to-end, full-stack, AI-driven educational platform designed to transform traditional passive rote learning into an active, interactive, and personalized educational experience.

### The Problem It Solves:
1. **Information Overload**: Students deal with voluminous textbooks and PDFs without a fast way to extract concise insights.
2. **Lack of Active Recall & Feedback**: Traditional self-study lacks an interactive teacher who can test students verbally and evaluate conceptual understanding.
3. **Language Barriers**: Complex technical concepts are often taught exclusively in English, making comprehension difficult for students more comfortable in regional languages such as Marathi and Hindi.
4. **Scattered Study Tools**: Students typically use separate tools for making notes, mind mapping, testing quizzes, making flashcards, and scheduling their study plans.

### The Solution:
LearnFlow AI brings all study tools into one unified platform powered by:
- **Retrieval-Augmented Generation (RAG)** for factual answers strictly backed by uploaded books/notes.
- **Three.js Audio-Reactive 3D Avatar** that speaks and visually animates in response to sound frequencies.
- **Interactive Vocal Mock Test** where the AI conducts 1-on-1 oral examinations, grades spoken answers, and gives real-time pedagogical hints.
- **Hands-Free Global Voice Navigation** via the **'Hi Sympra'** voice assistant.
- **Multilingual Support** with strict Devanagari script output for Marathi and Hindi, alongside English.

---

## ✨ 2. Key Highlights & Unique Innovations

| Feature | Description |
| :--- | :--- |
| **Document-Aware RAG Engine** | Upload PDFs, DOCX, TXT, or scan images with OCR. The system chunks text, generates embeddings with Google Gemini, and retrieves the most relevant context using ChromaDB vector similarity search. |
| **3D Audio-Reactive AI Avatar** | Built with Three.js and `@react-three/fiber`, featuring a simplex-noise deformed dynamic 3D sphere that pulsates and changes color in real time based on speech output. |
| **Vocal Mock Test (Oral Exams)** | Simulates a viva/oral exam. The AI asks one conceptual question; the student speaks their answer into the microphone. The AI evaluates correctness, provides constructive feedback, awards scores, and smoothly proceeds to the next question. |
| **'Hi Sympra' Hands-Free Voice Agent** | Global voice recognition powered by Web Speech API. Wake word `"Hi Sympra"` enables students to navigate pages, generate quizzes, flashcards, or mind maps using voice commands in English, Hindi, or Marathi. |
| **Dynamic Mind Maps** | Generates hierarchical topic nodes and animated connecting edges rendered with `@xyflow/react`. Supports dragging, zooming, pan controls, and one-click PNG image export. |
| **Smart Automated Notes** | Generates 5 distinct formats: *Summary Notes*, *Short Notes (Bullet Points)*, *Detailed Notes (with exam tips & code)*, *Chapter Summary*, and *Formula & Key Points*. |
| **Gamified Study Progress** | Daily login streak counters, XP points awarded for quizzes and notes, achievement badges, and canvas confetti celebrations upon test completion. |

---

## 🏗️ 3. System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph ClientLayer["💻 Client Layer (React 18 + Vite)"]
        UI["Glassmorphic UI\n(Tailwind CSS + Framer Motion)"]
        VoiceBrain["Sympra Voice Brain\n('Hi Sympra' Wake Word Detection)"]
        Avatar["Three.js 3D Avatar\n(Audio-Reactive Orb Mesh)"]
        MindMapUI["React Flow Mind Map\n(@xyflow/react)"]
    end

    subgraph ServerLayer["⚡ Backend Gateway (FastAPI + Python 3.10+)"]
        MW["Security & Performance Pipeline\n(CORS, GZip, SecurityHeaders, SlowAPI RateLimiter)"]
        AuthRouter["Auth & Users Router\n(JWT + bcrypt)"]
        AIRouter["AI & RAG Engine Router"]
        DocRouter["Document & Upload Router"]
    end

    subgraph Pipeline["⚙️ Document & Vector Ingestion Pipeline"]
        DocProc["Document Processor\n(pdfplumber, docx, Tesseract OCR)"]
        Chunker["Recursive Text Chunker\n(Chunk Size: 1000, Overlap: 200)"]
        Embedder["Google Gemini Embeddings\n(models/gemini-embedding-001)"]
    end

    subgraph DataLayer["💾 Persistence Layer"]
        Chroma["ChromaDB Vector Store\n(edumind_vectors)"]
        MongoDB["MongoDB Atlas Database\n(Users, Chats, Quizzes, Notes, Plans)"]
    end

    subgraph AIEngine["🧠 LLM & Inference Engine"]
        GroqLLM["Groq LPU Engine\n(openai/gpt-oss-20b, llama-3.3-70b)"]
        GroqVision["Groq Multimodal Vision\n(Image / Diagram Queries)"]
        GeminiPro["Google Gemini Pro / Flash\n(Complex Synthesis)"]
    end

    UI -->|HTTP / SSE Requests with Bearer JWT| MW
    VoiceBrain -->|Voice Intent Parsing| AIRouter
    MW --> AuthRouter
    MW --> DocRouter
    MW --> AIRouter

    DocRouter --> DocProc
    DocProc --> Chunker
    Chunker --> Embedder
    Embedder --> Chroma
    DocRouter --> MongoDB

    AIRouter -->|Vector Similarity Query| Chroma
    AIRouter -->|Fetch Chat History & User Profile| MongoDB
    AIRouter -->|Context + Multilingual System Prompt| GroqLLM
    AIRouter -->|Diagram / Image Query| GroqVision
    AIRouter -->|Complex Document Summaries| GeminiPro

    GroqLLM -->|SSE Stream / JSON Response| UI
    GroqLLM -->|Web Speech Audio Waveform| Avatar
```

---

## 🛠️ 4. Technology Stack & Architectural Decisions

### Frontend Stack:
* **React 18 & Vite**: Provides instant Hot Module Replacement (HMR) and optimized build times compared to traditional bundlers.
* **Tailwind CSS**: Engineered with a cyber dark glassmorphic theme using tailored HSL color tokens (`primary-500`, `dark-800`, neon accents).
* **Three.js, `@react-three/fiber`, `@react-three/drei`**: Renders the 3D procedural AI teacher avatar using a vertex-displaced simplex noise sphere reacting to audio input.
* **`@xyflow/react`**: Provides an interactive canvas for visualizing concept hierarchies as draggable, zoomable mind maps.
* **Recharts**: Responsive SVG charts illustrating weekly study hours, quiz accuracy, and subject mastery.
* **Web Speech API**: Handles client-side Speech-to-Text (`webkitSpeechRecognition`) and Text-to-Speech (`window.speechSynthesis`).
* **Axios with Interceptors**: Automatically injects Bearer JWT tokens into request headers and intercepts 401 errors to trigger smooth session renewal or logout.
* **Lucide React & Sonner**: High-aesthetic modern SVG iconography and toast notifications.
* **Canvas-Confetti**: Fires visual celebration particles when students pass quizzes or achieve milestone XP.

### Backend Stack:
* **FastAPI (Python 3.10+)**: High-throughput asynchronous framework utilizing Python type hints and `async/await` coroutines for non-blocking I/O.
* **Motor**: Asynchronous MongoDB driver built on `asyncio` for non-blocking document operations.
* **ChromaDB**: Lightweight, high-performance vector database used to store document chunks and perform similarity queries.
* **LangChain Google GenAI**: Generates dense embeddings (`models/gemini-embedding-001`) with REST transport.
* **Groq Cloud SDK**: Ultra-fast LLM inference providing streaming text responses in milliseconds.
* **Document Parsing Suite**:
  - `pdfplumber`: Extracts text and tabular layouts from PDF files.
  - `python-docx`: Parses Microsoft Word (.docx) documents.
  - `pytesseract` & `Pillow`: Performs Optical Character Recognition (OCR) on scanned notes, photos, and JPG/PNG screenshots.
* **SlowAPI**: Enforces rate limiting per IP address to safeguard against Denial of Service (DoS) attacks and API abuse.

---

## 📱 5. Frontend Pages & Step-by-Step User Workflows

LearnFlow AI contains **20 pages and modules**, each addressing a specific step of the study lifecycle:

### 1. Authentication & Session Handling
- **Pages**: `AuthPage.jsx`, `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`, `SessionExpiredPage.jsx`
- **Purpose**: Secure registration, login, token refresh, and session expiration handling.
- **Workflow**:
  1. The user registers with Name, Email, and Password.
  2. The server encrypts the password with `bcrypt`, creates the user profile with 100 bonus XP, and returns JWT tokens (`access_token` and `refresh_token`).
  3. When an access token expires, Axios interceptors attempt a refresh or redirect the user to `SessionExpiredPage` to log in again without losing current work.

### 2. Student Dashboard (`DashboardPage.jsx`)
- **Purpose**: The central command center showing progress, streaks, and recommended actions.
- **Workflow**:
  1. Displays the user's **Daily Study Streak** (tracks consecutive study days).
  2. Displays current **XP Points** and **Gamification Level Badge**.
  3. Provides **Quick Action Cards** to instantly launch Chat, Oral Mock Test, Notes, or Mind Maps.
  4. Features a **Daily Recommendation Widget** generated by AI based on upcoming exam deadlines.

### 3. Document Upload & Ingestion Hub (`UploadPage.jsx`)
- **Purpose**: Ingests textbooks, lecture slides, and notes into the RAG knowledge base.
- **Workflow**:
  1. The user drags and drops a file (PDF, DOCX, TXT, PNG, JPG).
  2. The system displays a real-time progress bar.
  3. Backend extracts raw text, cleans it, splits it into 1000-character chunks with 200-character overlap, generates vector embeddings, and stores them in ChromaDB.
  4. The document becomes immediately selectable for RAG queries.

### 4. RAG-Powered AI Chat (`ChatPage.jsx`)
- **Purpose**: Context-aware educational assistant that references uploaded documents.
- **Workflow**:
  1. The student selects one or multiple uploaded documents from a multi-select dropdown, or selects "General Knowledge".
  2. The student types or speaks a question (e.g., *"Explain Process Scheduling in Operating Systems"*).
  3. The backend retrieves the top 5 most similar chunks from ChromaDB and passes them to Groq's Llama model.
  4. The answer streams token-by-token with Markdown formatting, code blocks, and source citations.
  5. The student can attach an image or diagram to ask visual questions via Groq Vision.
  6. The student can switch the output language to Marathi, Hindi, or English at any time.

### 5. AI Teacher & Vocal Mock Test (`AITeacherPage.jsx`)
- **Purpose**: A virtual spoken tutor and oral viva examination room.
- **Workflow**:
  - **Mode 1: Explainer Teacher**:
    1. Selects either **Beginner** mode (simple everyday analogies) or **Advanced** mode (technical depth).
    2. The 3D audio-reactive sphere deforms in real time according to speech frequencies.
  - **Mode 2: Vocal Mock Test (Oral Examination)**:
    1. The AI reads the student's study material and asks one conceptual exam question verbally.
    2. The student clicks the microphone button and speaks their response.
    3. If the student says *"Explain this to me"* or *"Give me a hint"*, the AI provides guidance instead of penalizing them.
    4. If the student answers, the AI grades the answer, gives constructive feedback, and poses the next question.

### 6. Automated Notes Generator (`NotesPage.jsx`)
- **Purpose**: Automatically generates structured revision notes from documents or topics.
- **Workflow**:
  1. The student selects a document or enters any topic name (e.g., *"Database Normalization"*).
  2. Selects one of 5 note formats:
     - **Summary Notes**: Executive summary of core themes.
     - **Short Notes**: 15–20 concise bullet points grouped under subheadings.
     - **Detailed Notes**: 600–1200 words covering theory, practical examples, formulas, common pitfalls, and review checklists.
     - **Chapter Summary**: Comprehensive breakdown of an entire syllabus chapter.
     - **Formula & Key Points**: Tabular extraction of mathematical formulas, constants, and theorems.
  3. Notes are rendered in Markdown with options to save to MongoDB, copy, or export to PDF/Text.

### 7. Interactive Mind Maps (`MindMapPage.jsx`)
- **Purpose**: Visualizes complex hierarchies as interactive node-link diagrams.
- **Workflow**:
  1. Selects a document and clicks **Generate Mind Map**.
  2. The LLM produces a structured JSON graph specifying nodes (Root, Subtopics, Concepts) and connecting edges.
  3. Rendered using `@xyflow/react` with distinct color palettes for each hierarchy level.
  4. Nodes are draggable and zoomable. Students can export the entire diagram as a high-resolution PNG image.

### 8. Adaptive Quiz Center (`QuizPage.jsx`)
- **Purpose**: Generates interactive multiple-choice quizzes with instant grading.
- **Workflow**:
  1. Configures quiz settings: difficulty (**Easy**, **Medium**, **Hard**) and question count (e.g., 5, 10).
  2. A live countdown timer starts for each question.
  3. Selecting an answer immediately reveals correctness alongside a comprehensive educational explanation.
  4. Upon completion, a summary card displays total score, accuracy %, and triggers confetti animation.

### 9. 3D Spaced-Repetition Flashcards (`FlashcardsPage.jsx`)
- **Purpose**: Fast revision using flashcards categorized by difficulty.
- **Workflow**:
  1. Generates flashcard decks automatically from study materials.
  2. Clicking a card flips it with a 3D animation (Front: Question, Back: Answer).
  3. Students mark cards as **Easy**, **Medium**, or **Hard**.
  4. Tracks overall mastery percentage to highlight cards needing review.

### 10. Document Library (`LibraryPage.jsx`)
- **Purpose**: Central file repository for inspecting, previewing, and managing study assets.
- **Workflow**:
  1. Lists all uploaded files with size, type, upload timestamp, and associated subject.
  2. Clicking a document opens a modal displaying extracted text and vector chunks.
  3. Allows single or bulk deletion, purging both database records and vector embeddings.

### 11. Subjects & Chapters Organizer (`SubjectsPage.jsx`)
- **Purpose**: Organizes files, notes, and quizzes by academic subjects and chapters.
- **Workflow**:
  1. Creates subject folders with custom color tags (e.g., "Computer Networks" in cyan).
  2. Adds chapters and tags uploaded documents to specific subjects.

### 12. AI Study Planner (`PlannerPage.jsx`)
- **Purpose**: Generates an adaptive daily study schedule leading up to exams.
- **Workflow**:
  1. Enters subject names, remaining days until exams, and daily study hours.
  2. Generates a structured day-by-day timetable with specific topic milestones.
  3. Interactive checklist lets students toggle task statuses from *Pending* to *Completed*.

### 13. Analytics & Progress Tracker (`AnalyticsPage.jsx`)
- **Purpose**: Quantitative charts demonstrating academic progress and growth areas.
- **Workflow**:
  1. **Study Time Chart**: Recharts bar graph showing hours spent daily and weekly.
  2. **Accuracy Distribution**: Donut and line charts tracking quiz performance over time.
  3. **Weak Area Identification**: AI pinpoints topics with low quiz scores and suggests revision material.

### 14. Activity History (`HistoryPage.jsx`)
- **Purpose**: Full chronological log of all previous chats, quizzes taken, and notes generated.

### 15. Profile & Settings (`ProfilePage.jsx`, `SettingsPage.jsx`)
- **Purpose**: User preferences, avatar customization, dark mode toggles, and custom API key configuration.

---

## ⚙️ 6. Backend Services & Function-by-Function Breakdown

Every core backend service in `backend/app/services/` is detailed below with its parameters, return values, and step-by-step logic:

### 📄 1. Document Processor (`backend/app/services/ai/document_processor.py`)
Responsible for extracting and cleaning text from uploaded files of various formats.

* #### `extract_text(file_path: str, file_type: str) -> str`
  - **Purpose**: Entry point for extracting text from any supported file.
  - **Steps**:
    1. Verifies that `file_path` exists on disk; raises `FileNotFoundError` if missing.
    2. Inspects `file_type.lower()`.
    3. Routes to `_extract_from_pdf` for PDFs, `_extract_from_docx` for Word docs, `_extract_from_txt` for text files, or `_extract_from_image` for images (JPG, PNG).
    4. Passes the raw extracted string to `clean_text()` and returns the sanitized text.

* #### `clean_text(text: str) -> str`
  - **Purpose**: Strips formatting noise and invisible characters.
  - **Steps**:
    1. Removes null byte characters (`\x00`).
    2. Replaces consecutive tabs and spaces with a single space (`re.sub(r'[ \t]+', ' ', text)`).
    3. Normalizes consecutive empty lines into double newlines (`re.sub(r'\n\s*\n', '\n\n', text)`).
    4. Strips leading and trailing whitespace.

* #### `_extract_from_pdf(file_path: str) -> str`
  - Opens the file using `pdfplumber.open(file_path)`.
  - Iterates through each page, extracts text via `page.extract_text()`, and concatenates page strings with newline delimiters.

* #### `_extract_from_docx(file_path: str) -> str`
  - Initializes `docx.Document(file_path)`.
  - Loops over `doc.paragraphs` and joins all `para.text` lines.

* #### `_extract_from_image(file_path: str) -> str`
  - Checks if `pytesseract` and `Pillow` are available.
  - Loads the image via `Image.open(file_path)`.
  - Executes `pytesseract.image_to_string(image)` to perform Optical Character Recognition (OCR).

---

### ✂️ 2. Text Chunker (`backend/app/services/ai/chunking.py`)
Prepares raw text for embedding and vector similarity indexing.

* #### `create_chunks(text: str, metadata: dict) -> List[Dict]`
  - **Parameters**: `text` (cleaned document text), `metadata` (`document_id`, `user_id`, `subject_id`).
  - **Steps**:
    1. Defines `chunk_size = 1000` characters and `overlap = 200` characters.
    2. Recursively walks through the text string, advancing by `step = chunk_size - overlap` (800 characters).
    3. Extracts text slices of up to 1000 characters.
    4. Packages each slice into a dictionary: `{"content": chunk_text, "metadata": {**metadata, "chunk_number": index}}`.
    5. Returns the complete list of tagged chunk dictionaries.

---

### 🔍 3. RAG Service (`backend/app/services/ai/rag_service.py`)
Handles vector embeddings, collection storage in ChromaDB, and similarity search.

* #### `get_or_create_collection()`
  - Connects to the ChromaDB client and accesses the `edumind_vectors` collection.

* #### `store_documents(chunks: List[Dict])`
  - **Steps**:
    1. Separates chunks into text lists (`documents`) and metadata dictionaries (`metadatas`).
    2. Generates deterministic IDs: `f"{doc_id}_{chunk_number}"`.
    3. Generates high-dimensional vector embeddings using Google Generative AI (`models/gemini-embedding-001`).
    4. Calls `collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)`.

* #### `similarity_search(query: str, user_id: str, top_k: int = 5, document_ids: List[str] = None) -> List[Dict]`
  - **Steps**:
    1. Constructs a ChromaDB metadata filter: `{"user_id": str(user_id)}`.
    2. If `document_ids` are specified, constructs an `$and` or `$in` query filter targeting those specific files.
    3. Attempts a direct collection retrieval (`collection.get`) for targeted documents.
    4. If the vector search returns empty results, falls back to reading the raw document directly from disk to ensure zero-failure operation.
    5. Returns the top `k` most relevant chunks formatted with their content and metadata.

---

### 🧠 4. AI Generator (`backend/app/services/ai/generator.py`)
Handles all LLM prompts, model failover, and structured output parsing.

* #### `_create_completion(messages: List[Dict], temperature: float = 0.7, max_tokens: int = 2048, response_format: dict = None) -> str`
  - **Resilient Fallback Chain**: Iterates through models in priority order:
    1. `openai/gpt-oss-20b`
    2. `groq/compound`
    3. `qwen/qwen3.6-27b`
    4. `llama-3.3-70b-versatile`
    5. `groq/compound-mini`
  - **Reasoning Tag Cleanup**: Automatically detects and strips `<think>...</think>` internal model reasoning blocks so students receive clean, direct answers.

* #### `_get_language_instruction(language: str) -> str`
  - When the requested language is not English, injects strict system prompting requiring responses in the native script (Devanagari for Marathi/Hindi) while maintaining technical accuracy.

* #### `generate_chat_response(query, context_chunks, chat_history, language, images, doc_names) -> str`
  - Merges retrieved RAG context chunks, conversation history, and optional base64 image data into a unified prompt.
  - Produces answers citing source documents.

* #### `generate_chat_stream(...)`
  - Yields text chunks asynchronously using Groq's streaming API (`stream=True`) for real-time frontend typing effects.

* #### `generate_quiz(context_chunks, difficulty, num_questions) -> str`
  - Prompts the LLM to output a strict JSON array of question objects, each with `question`, `options` (4 items), `answer`, and `explanation`.

* #### `generate_flashcards(context_chunks, num_flashcards) -> str`
  - Instructs the LLM to output JSON flashcards containing `question`, `front`, `answer`, `back`, `difficulty`, and `subject`.

* #### `generate_notes(context_chunks, note_type) -> str`
  - Formats output according to the selected note type:
    - *Short Notes*: 15–20 concise bullet points.
    - *Detailed Notes*: 600–1200 words including executive summary, theoretical deep dive, code/formula examples, exam tips, and review checklist.
    - *Formula & Key Points*: Tables of mathematical/scientific formulas, equations, and constants.

* #### `generate_mindmap(context_chunks, topic_name) -> str`
  - Generates a JSON object with `nodes` and `edges` arrays conforming to React Flow's layout requirements (coordinates, custom styles, hierarchy).

* #### `generate_teacher_response(query, context_chunks, mode, chat_history, language) -> str`
  - Adjusts pedagogical tone based on `mode`:
    - `Beginner`: Uses simple real-world analogies and step-by-step breakdowns.
    - `Advanced`: Uses rigorous technical explanations and conceptual comparisons.

* #### `generate_mock_test_question(context_chunks, language, history) -> str`
  - Generates exactly one conceptual oral exam question (2–3 sentences) derived from the student's study material.

* #### `evaluate_mock_test_answer(user_answer, context_chunks, language, history) -> str`
  - Evaluates user input against 4 distinct conversational cases:
    1. **Clarification / Help Requested** (e.g., *"Explain this question"*, *"I don't understand"*): Explains the concept gently instead of advancing or marking it wrong.
    2. **Hint Requested**: Delivers a subtle pedagogical clue without giving away the complete answer.
    3. **Answer Provided**: Evaluates correctness in 1–2 encouraging sentences, notes key missing points if incorrect, and asks the next question.
    4. **Next Question Requested**: Acknowledges and proceeds directly to the next conceptual question.

---

### 🎙️ 5. Voice Agent Parser (`backend/app/services/ai/agent_parser.py`)
Converts natural spoken voice transcripts into structured application actions.

* #### `parse_intent(transcript: str, current_page: str) -> Dict[str, Any]`
  - Analyzes the spoken text and maps it into an intent enum:
    - `CHAT`: Ask a question.
    - `GENERATE_NOTES`: Create notes on a topic or document.
    - `GENERATE_MINDMAP`: Build an interactive concept map.
    - `AI_TEACHER_TEST`: Start a vocal mock test.
    - `GENERATE_QUIZ`: Generate a multiple-choice quiz.
    - `GENERATE_FLASHCARDS`: Generate revision flashcards.
  - Recognizes regional vernacular (e.g., *"mala quiz generate kar"*, *"notes banav"*, *"test ghya"*).
  - Returns a structured JSON payload:
    ```json
    {
      "detected_language": "en",
      "intent": "GENERATE_QUIZ",
      "parameters": { "source": "selected_document", "topic_name": null },
      "speech_reply": "Generating your quiz now."
    }
    ```

---

## 🗣️ 7. Hands-Free Voice AI Agent ('Hi Sympra')

The application features an ambient voice assistant integrated across all pages (`frontend/src/contexts/SympraVoiceContext.jsx` & `SympraAssistantUI.jsx`):

### How It Works:
```
[User speaks: "Hi Sympra, take my oral mock test"]
                      │
                      ▼
[Web Speech API: Speech-to-Text transcription]
                      │
                      ▼
[POST /api/v1/ai/agent/intent]
                      │
                      ▼
[SympraAgentParser classifies intent: AI_TEACHER_TEST]
                      │
                      ▼
[Frontend navigates to /ai-teacher & triggers Oral Mock Test]
                      │
                      ▼
[Text-to-Speech announces: "Starting your oral mock test now."]
```

### Voice Status Indicators:
- 🟢 **Green Pulse**: Actively listening for voice commands.
- 🟡 **Amber**: Processing query through the LLM.
- 🔵 **Blue Waveform**: Assistant is speaking via Text-to-Speech.
- ⚪ **Gray**: Idle; listening for the `"Hi Sympra"` wake word.

---

## 🌐 8. Complete REST API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication & Users
| Method | Endpoint | Description | Request Body | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | `{ "name", "email", "password" }` | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT tokens | `{ "email", "password" }` | No |
| `POST` | `/auth/refresh` | Refresh an expired access token | `{ "refresh_token" }` | No |
| `GET` | `/users/me` | Fetch profile information and XP stats | None | Yes |
| `PUT` | `/users/me` | Update profile information | `{ "name", ... }` | Yes |
| `PUT` | `/users/streak` | Update daily login streak | None | Yes |

### Document Management
| Method | Endpoint | Description | Request Body | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/upload/` | Upload document (PDF/DOCX/TXT/Image) | `multipart/form-data` | Yes |
| `GET` | `/upload/` | List all uploaded documents | None | Yes |
| `DELETE`| `/upload/{id}` | Delete document and vector embeddings | None | Yes |

### AI Generation & RAG
| Method | Endpoint | Description | Request Body | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/ai/chat` | Context-aware RAG question answering | `{ "query", "chat_history" }` | Yes |
| `POST` | `/ai/generate/quiz` | Generate multiple-choice quiz | `{ "difficulty", "num_questions", "document_ids" }` | Yes |
| `POST` | `/ai/generate/flashcards` | Generate revision flashcards | `{ "topic_query", "num_flashcards", "document_id" }` | Yes |
| `POST` | `/ai/generate/notes` | Generate notes (5 formats) | `{ "document_id", "topic", "note_type" }` | Yes |
| `POST` | `/ai/generate/mindmap` | Generate React Flow graph structure | `{ "document_id" }` | Yes |
| `POST` | `/ai/generate/study-plan` | Generate personalized study timetable | `{ "topics", "days", "hours_per_day" }` | Yes |
| `POST` | `/ai/chat/teacher` | Spoken AI teacher chat | `{ "query", "mode", "language", "chat_history" }` | Yes |
| `POST` | `/ai/mock-test/question` | Generate oral exam question | `{ "document_id", "language", "chat_history" }` | Yes |
| `POST` | `/ai/mock-test/evaluate` | Evaluate oral exam answer | `{ "document_id", "user_answer", "language" }` | Yes |
| `POST` | `/ai/agent/intent` | Voice intent classification | `{ "transcript", "current_page" }` | No |

### Chats, Quizzes & Subjects
| Method | Endpoint | Description | Request Body | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/chats/` | Create a new chat session | `{ "title", "documentIds" }` | Yes |
| `GET` | `/chats/` | List all user chat sessions | None | Yes |
| `POST` | `/chats/{id}/messages` | Send message to chat session | `{ "message", "language", "images" }` | Yes |
| `POST` | `/chats/{id}/messages/stream`| Stream response tokens via SSE | `{ "message", "language", "images" }` | Yes |
| `POST` | `/quizzes/generate` | Generate and save quiz session | `{ "difficulty", "num_questions" }` | Yes |
| `GET` | `/quizzes/` | Fetch historical quiz attempts | None | Yes |
| `GET` | `/subjects/` | List all subjects and chapters | None | Yes |
| `POST` | `/subjects/` | Create a new subject | `{ "name", "description", "color" }` | Yes |
| `GET` | `/analytics/overview` | Fetch study hours and accuracy stats | None | Yes |
| `GET` | `/monitoring/system` | System health (CPU, RAM, Disk, DB) | None | No |

---

## 💾 9. Database Schema & Vector Architecture

### MongoDB Collections (`edumind_db`)

```mermaid
erDiagram
    USERS ||--o{ DOCUMENTS : owns
    USERS ||--o{ CHATS : initiates
    USERS ||--o{ QUIZZES : completes
    USERS ||--o{ STUDY_PLANS : creates
    CHATS ||--o{ MESSAGES : contains
    DOCUMENTS ||--o{ CHUNKS : splits_into

    USERS {
        string _id PK
        string name
        string email
        string hashed_password
        int xp
        int streak
        datetime created_at
    }

    DOCUMENTS {
        string _id PK
        string user_id FK
        string original_name
        string file_type
        int file_size
        string storage_path
        datetime upload_date
    }

    CHATS {
        string _id PK
        string user_id FK
        string title
        string[] document_ids
        datetime created_at
    }

    QUIZZES {
        string _id PK
        string user_id FK
        string difficulty
        int score
        int total_questions
        json questions
        datetime completed_at
    }
```

### ChromaDB Vector Collection (`edumind_vectors`)
- **Storage Location**: Local directory specified by `CHROMADB_PATH` (`./chroma_data`).
- **Embedding Model**: `models/gemini-embedding-001` (768-dimensional float vectors).
- **Metadata Document Payload**:
  ```json
  {
    "id": "660c1d2e8b_chunk_0",
    "embedding": [-0.0245, 0.0512, -0.0189, "..."],
    "document": "An operating system manages hardware resources and coordinates application execution...",
    "metadata": {
      "document_id": "660c1d2e8b",
      "user_id": "660c1b4a3f",
      "chunk_number": 0,
      "filename": "Operating_Systems.pdf"
    }
  }
  ```

---

## 🛡️ 10. Security, Performance & Gamification

### Security:
1. **Password Hashing**: Salted `bcrypt` hashing ensures passwords cannot be recovered from database breaches.
2. **JWT Authentication**: Short-lived access tokens with long-lived refresh tokens signed with HS256.
3. **Rate Limiting**: `SlowAPI` enforces IP-based rate limiting on sensitive AI and authentication endpoints.
4. **Security Headers**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and Content Security Policies.

### Performance:
1. **Asynchronous Architecture**: Non-blocking `async/await` handling across FastAPI, Motor, and Groq SDK.
2. **GZip Compression**: Automatically compresses all HTTP response bodies exceeding 1000 bytes.
3. **Optimized Inference**: Utilizes Groq's specialized LPUs for sub-second text generation.

### Gamification:
1. **Daily Streaks**: Consecutive daily logins increment the user's streak counter; breaking the streak resets it.
2. **XP Progression**:
   - Creating an account: **+100 XP**
   - Reading notes: **+15 XP**
   - Completing a quiz: **+50 XP**
   - Completing an oral mock test: **+100 XP**
3. **Celebrations**: Passing test thresholds triggers `canvas-confetti` visual animations.

---

## 💻 11. Step-by-Step Localhost Setup & Running Guide

Follow these steps to run the complete application on your local machine:

### Prerequisites:
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 or higher)
- **Git**
- Active internet connection (for Groq, Google Gemini, and MongoDB Atlas)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/AI-Smart-Education-Assistant.git
cd AI-Smart-Education-Assistant
```

---

### Step 2: Backend Setup & Execution
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\activate

   # On Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` configuration file inside `backend/.env`:
   ```env
   PROJECT_NAME="LearnFlow AI - Backend"
   API_V1_STR="/api/v1"
   JWT_SECRET="super_secret_jwt_key_replace_with_your_own"
   JWT_ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=43200
   REFRESH_TOKEN_EXPIRE_DAYS=7
   MONGODB_URI="your_mongodb_atlas_connection_string"
   DATABASE_NAME="edumind_db"
   GEMINI_API_KEY="your_google_gemini_api_key"
   GROQ_API_KEY="your_groq_api_key"
   CHROMADB_PATH="./chroma_data"
   UPLOAD_DIRECTORY="./uploads"
   MAX_UPLOAD_SIZE=10485760
   ALLOWED_ORIGINS='["*"]'
   LOG_LEVEL="INFO"
   ```
5. Launch the backend API server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. **Verify Backend Status**:
   - Open [http://localhost:8000/health](http://localhost:8000/health) in your browser. You should see:
     ```json
     {"status": "ok"}
     ```
   - Interactive Swagger API Documentation is accessible at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Step 3: Frontend Setup & Execution
1. Open a **new terminal window** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. **Open the Application**:
   - Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 12. Environment Variables Reference

### Backend (`backend/.env`):
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection URI for MongoDB Atlas or local instance | `mongodb+srv://user:pass@cluster.mongodb.net/?...` |
| `DATABASE_NAME` | Name of the MongoDB database | `edumind_db` |
| `GROQ_API_KEY` | API key from Groq Console (for Llama 3.1 & Vision) | `gsk_P1c7y5f7...` |
| `GEMINI_API_KEY` | API key from Google AI Studio (for Embeddings) | `AIzaSyB...` |
| `JWT_SECRET` | Secret string used to sign JWT tokens | `super_secret_jwt_key` |
| `CHROMADB_PATH` | Directory where ChromaDB stores vector index files | `./chroma_data` |
| `UPLOAD_DIRECTORY` | Temporary storage path for uploaded user files | `./uploads` |
| `ALLOWED_ORIGINS` | CORS allowed origins array | `'["*"]'` |

### Frontend (`frontend/.env`):
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base API URL pointing to the FastAPI backend | `http://localhost:8000/api/v1` |

---

## 🌐 13. Cloud Deployment (Render)

A production-ready `render.yaml` configuration is included at the project root for one-click deployment on Render:

```yaml
services:
  # Backend Web Service
  - type: web
    name: learnflow-ai-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.12
      - key: MONGODB_URI
        sync: false
      - key: GROQ_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false

  # Frontend Static Site
  - type: web
    name: learnflow-ai-frontend
    env: static
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: "./frontend/dist"
    envVars:
      - key: VITE_API_BASE_URL
        sync: false
```

---

## ❓ 14. Troubleshooting & FAQs

### Q1: The browser displays "Browser doesn't support Voice AI"
- **Solution**: The Web Speech API is supported natively in modern Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Opera). Make sure you are using Chrome or Edge and have granted microphone permissions.

### Q2: ChromaDB vector search returns empty results
- **Solution**: LearnFlow AI incorporates an automatic disk-based fallback mechanism. If ChromaDB returns no vector matches, the backend reads the raw file from the `uploads/` directory to ensure queries succeed without interruption.

### Q3: How do I change the output language to Marathi or Hindi?
- **Solution**: On the Chat or AI Teacher pages, click the language dropdown and select **Marathi** or **Hindi**. The system automatically instructs the LLM to output pure Devanagari script.

### Q4: CORS errors when calling the API from frontend
- **Solution**: Ensure `ALLOWED_ORIGINS='["*"]'` in `backend/.env`, and verify that `VITE_API_BASE_URL` in `frontend/.env` matches your running backend URL (`http://localhost:8000/api/v1`).

---

## 🏆 Credits & Acknowledgments
* **Project**: LearnFlow AI (AI-Smart-Education-Assistant)
* **Event**: **Hackathon SYMPRA**
* **Mission**: Empowering every student with an intelligent, accessible, personalized AI mentor.
* **License**: [MIT License](LICENSE)

---
*Built with ❤️ during Hackathon SYMPRA.*
