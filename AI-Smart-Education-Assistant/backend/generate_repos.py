import os

base_dir = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\app\repositories'

repos = {
    'subject.py': ('SubjectInDB', 'subjects'),
    'chat.py': ('ChatInDB', 'chats'),
    'quiz.py': ('QuizInDB', 'quizzes'),
    'flashcard.py': ('FlashcardInDB', 'flashcards'),
    'study_planner.py': ('StudyPlannerInDB', 'study_plans'),
    'analytics.py': ('AnalyticsInDB', 'analytics')
}

for filename, (model_name, collection) in repos.items():
    model_module = filename.replace('.py', '')
    content = f"from app.repositories.base import BaseRepository\nfrom app.models.{model_module} import {model_name}\n\n{model_module}_repo = BaseRepository[{model_name}](model={model_name}, collection_name='{collection}')\n"
    
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)
print("Repositories created.")
