# BACKEND PRD PART 3
# AI Engine, RAG Pipeline, Document Intelligence & Learning Services

---

# 1. AI Engine Overview

## Objective

The AI Engine is the core intelligence layer of EduMind AI. It is responsible for understanding uploaded study materials, retrieving relevant information, generating accurate responses, creating quizzes, flashcards, summaries, study plans, and acting as an intelligent learning assistant.

The AI Engine must always prioritize user-uploaded study materials over general AI knowledge.

---

# 2. AI Service Architecture

The AI Engine should follow a modular architecture.

AI Modules

• Document Processing Service

• OCR Service

• Text Cleaning Service

• Chunking Service

• Embedding Service

• Vector Database Service

• Retrieval Service

• Prompt Builder

• Gemini Service

• Quiz Generator

• Flashcard Generator

• Notes Generator

• Study Planner

• Teacher Mode

• Analytics Service

Each module should be independent and reusable.

---

# 3. Retrieval-Augmented Generation (RAG)

## Objective

The RAG pipeline should provide AI answers using uploaded study materials instead of relying only on the LLM.

Workflow

Upload PDF

↓

Extract Text

↓

Clean Text

↓

Split into Chunks

↓

Generate Embeddings

↓

Store in ChromaDB

↓

User Question

↓

Embedding Generation

↓

Similarity Search

↓

Retrieve Relevant Chunks

↓

Prompt Construction

↓

Gemini

↓

Final Answer

---

# 4. Document Processing

Supported Files

• PDF

• DOCX

• TXT

Responsibilities

• Read Document

• Extract Metadata

• Detect Language

• Extract Images

• Extract Tables

• Remove Empty Pages

• Normalize Text

• Remove Headers

• Remove Footers

• Remove Duplicate Lines

The extracted content should be optimized for AI processing.

---

# 5. OCR Processing

Image OCR should support

• JPG

• JPEG

• PNG

Responsibilities

• Text Recognition

• Image Quality Validation

• Language Detection

• Noise Removal

• Orientation Detection

• OCR Confidence Score

Future Scope

• Handwritten Notes

---

# 6. Text Cleaning Pipeline

The cleaning service should

• Remove Extra Spaces

• Remove Blank Lines

• Normalize Unicode

• Remove Unsupported Symbols

• Preserve Mathematical Expressions

• Preserve Code Blocks

• Preserve Tables

Output should remain human-readable.

---

# 7. Document Chunking

Purpose

Large documents should be divided into meaningful chunks.

Chunking Rules

• Paragraph Based

• Sentence Based

• Heading Based

• Configurable Chunk Size

• Configurable Overlap

Metadata

Each chunk should contain

• Document ID

• Subject ID

• Chapter

• Page Number

• Chunk Number

• Source File

---

# 8. Embedding Generation

Responsibilities

Generate semantic embeddings for every chunk.

Embedding Features

• Batch Processing

• Async Processing

• Retry Failed Requests

• Duplicate Detection

• Metadata Mapping

Each embedding should map back to its source document.

---

# 9. Vector Database (ChromaDB)

Responsibilities

• Store Embeddings

• Delete Embeddings

• Update Embeddings

• Similarity Search

• Metadata Search

• Rebuild Collection

Collections should remain isolated per user.

---

# 10. Similarity Search

Search Features

• Semantic Search

• Top-K Retrieval

• Threshold Filtering

• Metadata Filtering

• Subject Filtering

• Chapter Filtering

• Multiple Document Retrieval

Return

• Matching Chunks

• Similarity Score

• Metadata

---

# 11. Context Builder

Responsibilities

Combine retrieved chunks into a structured prompt.

Prompt Sections

• System Instructions

• User Question

• Retrieved Context

• Citation Metadata

• Response Guidelines

Prompt should remain within model token limits.

---

# 12. Gemini AI Integration

Responsibilities

• Answer Questions

• Explain Concepts

• Generate Examples

• Generate Quiz

• Generate Flashcards

• Generate Study Plan

• Generate Notes

• Teacher Mode

All requests should use centralized prompt templates.

---

# 13. AI Chat Service

Features

• New Chat

• Continue Chat

• Multi-turn Conversation

• Context Preservation

• Source Citation

• Streaming Response

• Conversation Memory

Response Format

• Answer

• Sources

• Confidence Score

• Suggested Questions

---

# 14. Prompt Engineering

Prompt Templates

• Chat Prompt

• Quiz Prompt

• Flashcard Prompt

• Summary Prompt

• Planner Prompt

• Teacher Prompt

Prompt Rules

• Never hallucinate

• Prefer uploaded content

• Mention uncertainty

• Use simple language

---

# 15. Source Citation

Every answer should include

• Document Name

• Page Number

• Chapter

• Section

• Similarity Score

Frontend should display clickable citations.

---

# 16. Quiz Generator

Responsibilities

Generate quizzes from uploaded documents.

Supported Types

• MCQ

• True/False

• Fill in the Blanks

• Short Answer

Difficulty

• Easy

• Medium

• Hard

Quiz Metadata

• Subject

• Chapter

• Difficulty

• Generated Time

---

# 17. Flashcard Generator

Generate

Question

↓

Answer

↓

Explanation

↓

Keywords

↓

Difficulty

Flashcards should avoid duplicate questions.

---

# 18. Study Planner Generator

Inputs

• Exam Date

• Daily Hours

• Subjects

• Weak Topics

Output

• Daily Schedule

• Weekly Schedule

• Revision Plan

• Recommended Practice

Planner should dynamically adjust based on progress.

---

# 19. Notes Generator

Generate

• Summary Notes

• Detailed Notes

• Revision Notes

• Formula Sheet

• Key Definitions

• Important Concepts

---

# 20. AI Teacher Mode

Teacher Mode should

• Explain Step-by-Step

• Give Examples

• Explain Like a Teacher

• Explain in Beginner Mode

• Explain in Advanced Mode

• Compare Concepts

• Provide Practice Questions

---

# 21. Doubt Solver

Responsibilities

• Answer Follow-up Questions

• Explain Previous Answers

• Compare Topics

• Explain with Examples

• Explain with Tables

---

# 22. Voice AI Services

Speech-to-Text

Convert student voice into text.

Text-to-Speech

Convert AI responses into natural speech.

Features

• Multiple Languages

• Replay

• Pause

• Resume

---

# 23. AI Safety

The AI should

• Avoid Hallucinations

• Avoid Harmful Content

• Avoid Unsupported Answers

• Detect Empty Context

• Reject Invalid Prompts

If sufficient study material is unavailable, clearly inform the user instead of inventing information.

---

# 24. AI Performance

Target Performance

Document Processing

<10 seconds

Embedding Generation

Background Processing

Similarity Search

<500ms

AI Response

<5 seconds

Streaming

Immediate

---

# 25. Analytics

Track

• AI Questions

• Quiz Generated

• Flashcards Generated

• Documents Processed

• Study Plans Created

• Average Response Time

• Most Asked Subjects

---

# 26. Error Handling

Handle

• Gemini API Failure

• OCR Failure

• Embedding Failure

• ChromaDB Failure

• Timeout

• Invalid Document

• Empty Context

Every error should return

• Error Code

• Friendly Message

• Retry Option

---

# 27. Acceptance Criteria

The AI Engine will be considered complete when

✓ Documents are processed successfully.

✓ Text extraction is accurate.

✓ OCR functions correctly.

✓ Chunking is implemented.

✓ Embeddings are generated.

✓ ChromaDB stores vectors correctly.

✓ Similarity search retrieves relevant chunks.

✓ Gemini answers using retrieved context.

✓ Source citations are returned.

✓ Quiz generation works.

✓ Flashcards are generated.

✓ Study plans are generated.

✓ Teacher mode functions correctly.

✓ Voice services operate successfully.

✓ AI responses remain accurate and context-aware.

---

# END OF BACKEND PRD PART 3