# 🎓 LearnFlow AI (AI-Smart-Education-Assistant) - Master Project Documentation & PRD

हा दस्तऐवज (Document) **LearnFlow AI (AI Smart Education Assistant)** या प्रकल्पाची अत्यंत सविस्तर आणि सखोल माहिती देण्यासाठी तयार करण्यात आला आहे. यामध्ये प्रोजेक्टचे उद्दिष्ट, वापरलेला संपूर्ण टेक्नॉलॉजी स्टॅक, सिस्टीम आर्किटेक्चर, सर्व पेजेस व मोड्यूल्सची सविस्तर कार्यपद्धती, RAG (Retrieval-Augmented Generation) पाइपलाइन, डेटाबेस स्कीमा, सुरक्षा, गॅमिफिकेशन आणि प्रोजेक्ट सेटअप प्रक्रियेची माहिती दिलेली आहे.

---

## 📌 १. प्रोजेक्टचा उद्देश आणि मुख्य ध्येय (Project Overview & Vision)

**LearnFlow AI** हा विद्यार्थ्यांसाठी बनवलेला एक ऑल-इन-वन (All-in-One) अत्याधुनिक AI शिक्षण सहाय्यक (AI Smart Education Assistant) आहे. विद्यार्थी त्यांचा अभ्यासक्रम सहज, सोप्या भाषेत आणि परस्परसंवादी (Interactive) पद्धतीने पूर्ण करू शकतील यासाठी या सिस्टीमची रचना केली आहे. 

### मुख्य ध्येये:
* **पर्सनलाइज्ड AI ट्युटर (Personalized AI Tutor):** प्रत्येक विद्यार्थ्याच्या आवडीनुसार आणि वेगांनुसार शिकवणारा AI शिक्षक.
* **स्मार्ट RAG बेस चॅट (Document-Aware RAG Chat):** स्वतःच्या स्टडी मटेरियल (PDF, DOCX, Text, Images) मधून अचूक उत्तरे मिळवणे.
* **ऑटोमेटेड नोट्स आणि माइंड मॅप (Automated Notes & Mind Map):** अवघड टॉपिक्सचे सेकंदात सोप्या नोट्स आणि ग्राफिकल ट्री-डायग्राममध्ये रूपांतर करणे.
* **व्हाइस-बेस्ड मॉक टेस्ट (Vocal Mock Test):** बोलून तोंडी परीक्षा देणे आणि AI कडून त्वरित फीडबॅक मिळवणे.
* **गॅमिफिकेशन आणि ट्रॅकिंग (Gamification & Analytics):** Daily Streak, XP Points, रीअल-टाईम प्रगती चार्ट्स द्वारे अभ्यासात सतत सातत्य ठेवणे.

---

## 🛠️ २. सविस्तर टेक्नॉलॉजी स्टॅक (Comprehensive Technology Stack)

### 🎨 फ्रंटएंड (Frontend Architecture)
* **React 18 & Vite:** अतिशय जलद युजर इंटरफेस, Fast Refresh आणि कॉम्पोनंट-बेस्ड आर्किटेक्चरसाठी Vite Build Tool चा वापर.
* **Tailwind CSS:** सायबर, निऑन (Electric Neon, Cyber Purple, Flame Amber) आणि डार्क ग्लासमॉर्फिझम (Dark Glassmorphism) थीम डिझाईन.
* **Framer Motion:** पेजेस, मोडाल्स आणि कार्ड्ससाठी स्मूथ मायक्रो-अ‍ॅनिमेशन्स.
* **Three.js / React-Three-Fiber / Drei:** 3D ऑडिओ-रिएक्टिव्ह फ्लोटिंग ऑर्ब (3D AI Avatar) साठी जे बोलताना रिअल-टाईम वेव्हफॉर्मनुसार शेप आणि कलर बदलते (`Simplex Noise` द्वारे).
* **React Flow (`@xyflow/react`):** माइंड मॅपसाठी डायनॅमिक, ड्रॅगेबल, झूम करता येणारे आणि कस्टम स्टाईल केलेले नोड-ग्राफ डिझाईन.
* **Recharts:** स्टडी अव्हर्स, क्विझ परफॉर्मन्स आणि सब्जेक्ट ॲक्युरसी दाखवण्यासाठी रिस्पॉन्सिव्ह चार्ट्स व आलेखांचा वापर.
* **Web Speech API & React Speech Recognition:** ऑडिओ चॅट आणि व्होकल मॉक टेस्टसाठी `webkitSpeechRecognition` (Speech-to-Text) आणि `window.speechSynthesis` (Text-to-Speech).
* **React Markdown & Remark-GFM:** AI ने दिलेल्या उत्तरांमध्ये कोड सिंटॅक्स हायलाइटिंग, टेबल आणि LaTeX फॉरमॅटिंग दाखवण्यासाठी.
* **Canvas-Confetti:** क्विझ पूर्ण झाल्यावर आणि अचिव्हमेंट्स मिळाल्यावर सेलिब्रेशन अ‍ॅनिमेशनसाठी.
* **Axios:** JWT Interceptors सह सुरक्षित HTTP API कॉल्स आणि ऑटोमॅटिक सेशन एक्स्पायरी हँडलिंग.
* **React Hook Form & Zod:** इनपुट फॉर्म्स आणि डेटा व्हॅलिडेशनसाठी.
* **Lucide React & Sonner:** मॉडर्न आयकॉनोग्राफी आणि टोसिटिफिकेशन्स (Toast Notifications).
* **Html-to-Image:** माइंड मॅप आणि नोट्स डायरेक्ट इमेज फॉरमॅटमध्ये एक्सपोर्ट करण्यासाठी.

### ⚡ बॅकएंड (Backend Architecture)
* **FastAPI (Python 3.10+):** हाय-परफॉर्मन्स असिंक्रोनस (`async/await`) API सर्व्हर.
* **PyJWT & Passlib (bcrypt):** युजर ऑथेंटिकेशन, पासवर्ड एनक्रिप्शन आणि JWT अ‍ॅक्सेस टोकन व्हॅलिडेशन.
* **SlowAPI:** AI आणि ऑथ API एंडपॉइंट्सवर रेट लिमिटिंग (Rate Limiting) लावण्यासाठी, जेणेकरून API चा गैरवापर थांबवता येईल.
* **Middlewares:**
  * `RequestLoggingMiddleware`: प्रत्येक API रिक्वेस्टचे लॉगिंग.
  * `SecurityHeadersMiddleware`: XSS आणि सिक्युरिटी हेडर्स प्रोटेक्शन.
  * `GZipMiddleware`: 1KB पेक्षा मोठ्या रिस्पॉन्सचे कॉम्प्रेन्शन.
  * `CORSMiddleware`: क्रॉस-ओरिजिन सुरक्षा.
* **Motor (Async MongoDB Driver):** मॉन्गोडीबी सोबत हाय-स्पीड असिंक्रोनस डेटा संवादासाठी.
* **Document Processing & OCR Stack:**
  * `pdfplumber`: PDF फाईल्समधून मजकूर व टेबल्स काढण्यासाठी.
  * `python-docx`: Microsoft Word (`.docx`) फाईल्स प्रोसेस करण्यासाठी.
  * `pytesseract` & `Pillow (PIL)`: इमेज फाईल्स (`.jpg`, `.png`) मधील मजकूर वाचण्यासाठी Optical Character Recognition (OCR).
* **Recursive Text Chunking:** `chunking.py` मधील सानुकूल अल्गोरिदम (Chunk Size: 1000, Overlap: 200) जे RAG अचूकता वाढवते.
* **psutil:** सर्व्हरची CPU, RAM, आणि Disk Usage हेल्थ ट्रॅक करण्यासाठी.

### 🧠 AI इंजिन आणि LLMs (Large Language Models)
* **Groq API (`llama-3.1-8b-instant`):** चॅट, नोट्स, क्विझ, फ्लॅशकार्ड्स आणि मॉक टेस्टसाठी जगातील सर्वात जलद AI इन्फरन्स इंजिन.
* **Groq Vision API (`llama-3.2-11b-vision-preview`):** चॅटमध्ये अपलोड केलेल्या इमेजेस (Diagrams, Math problems) विश्लेषित करण्यासाठी मल्टीमॉडल व्हिजन मॉडेल.
* **Google Gemini API (`gemini-1.5-pro` / `gemini-1.5-flash`):** कॉम्प्युटेशनेली कॉम्पलेक्स जनरेशन, RAG रिझनिंग आणि सखोल अभ्यासाच्या समरीसाठी (`langchain-google-genai` द्वारे).
* **Language Localization Prompting:** मराठी (देवनागरी लिपी), हिंदी आणि इंग्रजी भाषा पूर्णपणे सपोर्ट.

### 💾 डेटाबेस स्टॅक (Databases)
* **MongoDB (NoSQL):** युजर प्रोफाईल, चॅट हिस्ट्री, क्विझ डिटेल्स, सब्जेक्ट्स, स्टडी प्लॅन्स आणि ॲनालिटिक्स ट्रॅकिंग.
* **ChromaDB (Vector Database):** टेक्स्ट चॅंक्सचे व्हेक्टर एम्बेडिंग्स साठवण्यासाठी व Similarity Search द्वारे RAG साठी वापर.

---

## 🏗️ ३. सिस्टीम आर्किटेक्चर आणि डेटा फ्लो (System Architecture & Data Flow)

```
[ User UI (React + Vite) ]
          │
          ├─► (HTTP / SSE Requests with JWT Token)
          ▼
[ FastAPI Backend Gateway ]
          │
          ├──► Middleware Pipeline (SecurityHeaders, RateLimiter, CORS, GZip)
          │
          ├──► Auth & Users Router ──────────► [ MongoDB (Users, Settings) ]
          │
          ├──► Document Processing Pipeline
          │         │
          │         ├─► PDF / DOCX / TXT / OCR Image Extraction
          │         ├─► Recursive Chunking (1000 chars, 200 overlap)
          │         └─► Store Vectors ──────► [ ChromaDB Vector Database ]
          │
          ├──► AI Processing & RAG Engine
          │         │
          │         ├─► Query Vector Search ──► [ ChromaDB ] (Fetch Top Context)
          │         ├─► Combine Context + Prompt + Chat History
          │         └─► Call LLM Provider ──► [ Groq (Llama 3.1) / Gemini API ]
          │
          └──► Response Serialization ───────► (JSON Response / SSE Text Stream) ──► Frontend UI
```

---

## 🚀 ४. सर्व पेजेस आणि मोड्यूल्सची सविस्तर माहिती (Detailed Pages & Features Breakdown)

### 🔐 १. ऑथेंटिकेशन आणि सिक्युरिटी मोड्यूल (`AuthPage`, `ForgotPassword`, `ResetPassword`, `SessionExpired`)
* **कार्य:** युजर लॉगिन, रजिस्ट्रेशन, पासवर्ड रिसेट आणि सुरक्षित सेशन व्यवस्थापन.
* **विशेष वैशिष्ट्ये:**
  * bcrypt द्वारे हॅश केलेला सुरक्षित पासवर्ड साठवणूक.
  * JWT (JSON Web Token) द्वारे अ‍ॅक्सेस आणि रिफ्रेश टोकन मेकॅनिझम.
  * ऑटोमॅटिक सेशन एक्स्पायरी डिटेक्ट करून युजरला सुरक्षितपणे `SessionExpiredPage` कडे रिडायरेक्ट करणे.
  * युजर रजिस्ट्रेशनवर वेलकम XP (Points) आणि डिफॉल्ट सेटिंग्ज तयार करणे.

### 📊 २. स्टुडंट डॅशबोर्ड (`DashboardPage`)
* **कार्य:** विद्यार्थ्याच्या अभ्यासाचा सर्वसमावेशक मुख्य डॅशबोर्ड (Command Center).
* **विशेष वैशिष्ट्ये:**
  * **Daily Streak Counter:** सलग किती दिवस अभ्यास केला याचा रेकॉर्ड.
  * **XP & Gamification Badge:** कमावलेले पॉईंट्स आणि विद्यार्थ्याची लेव्हल.
  * **Recent Activity Timeline:** नुकत्याच वाचलेल्या फाईल्स, दिलेल्या क्विझ आणि तयार केलेल्या नोट्स.
  * **Quick Action Buttons:** एका क्लिकवर Chat, Quiz, Notes किंवा AI Teacher चालू करण्याची सोय.
  * **Daily Recommendation:** AI कडून आज काय अभ्यास करावा याचा सल्ला.

### 📂 ३. फाईल अपलोड आणि RAG नॉलेज बेस (`UploadPage`)
* **कार्य:** अभ्यासाचे साहित्य सिस्टीममध्ये अपलोड आणि प्रोसेस करणे.
* **विशेष वैशिष्ट्ये:**
  * Drag-and-Drop इंटरफेस: PDF, DOCX, TXT आणि JPG/PNG फाईल्स.
  * OCR इमेज प्रोसेसिंग: स्कॅन केलेल्या नोट्स किंवा चित्रांमधील मजकूर ओळखणे (`pytesseract`).
  * रिअल-टाईम अपलोड प्रोग्रेस बार आणि टेक्स्ट एक्स्ट्रॅक्शन स्टेटस.
  * चॅंकिंग आणि व्हेक्टर इंडेक्सिंग (ChromaDB मध्ये आपोआप डेटा एम्बेड होणे).

### 💬 ४. RAG-पावर्ड AI चॅट सहाय्यक (`ChatPage`)
* **कार्य:** अपलोड केलेल्या फाईल्सवरून किंवा सामान्य ज्ञानावर आधारित AI सोबत संवाद.
* **विशेष वैशिष्ट्ये:**
  * **Document Filtering:** युजर ठराविक फाईल्स निवडून फक्त त्या फाईल्समधून प्रश्न विचारू शकतो.
  * **Streaming Response:** रिअल-टाईम टाईपिंग इफेक्टसह जलद उत्तरे (Groq Llama 3.1 Instant).
  * **Multimodal Vision:** प्रश्न विचारताना सोबत डायग्राम किंवा मॅथ्स प्रॉब्लेमची इमेज जोडण्याची सोय (Groq Llama Vision).
  * **Multi-Language Support:** मराठी, हिंदी आणि इंग्रजी भाषेत अचूक उत्तरे.
  * **Markdown & Code Highlighting:** कोड ब्लॉक्स, टेबल्स आणि सूत्रांची सुंदर मांडणी.
  * **Chat History Management:** जुने चॅट सेव्ह होणे आणि कधीही पुन्हा पाहता येणे.

### 🎙️ ५. AI टीचर आणि व्होकल मॉक टेस्ट (`AITeacherPage`)
* **कार्य:** बोलणारा AI शिक्षक आणि तोंडी परीक्षा घेणारा व्हॉइस असिस्टंट.
* **विशेष वैशिष्ट्ये:**
  * **3D Audio-Reactive Orb:** Three.js द्वारे बनवलेला ३D AI अव्हेटार जो AI च्या आवाजानुसार आणि फ्रिक्वेन्सीनुसार फिरतो व रंग बदलतो.
  * **Mode 1: Explainer Teacher:** Beginner (सोप्या भाषेत उदाहरणांसह) किंवा Advanced (सखोल तांत्रिक माहिती) मोडमध्ये बोलून शिकवणे.
  * **Mode 2: Vocal Mock Test:** 
    * AI युजरच्या अपलोड केलेल्या साहित्यातून एक संकल्पनात्मक प्रश्न विचारतो.
    * युजर माईकवर बोलून उत्तर देतो (Speech-to-Text).
    * AI युजरच्या उत्तराचे मूल्यांकन करतो (Feedback & Score) आणि पुढचा प्रश्न विचारतो.

### 📝 ६. स्मार्ट नोट्स जनरेटर (`NotesPage`)
* **कार्य:** अभ्यासाच्या साहित्यातून विविध प्रकारच्या नोट्स त्वरित तयार करणे.
* **विशेष वैशिष्ट्ये:**
  * **Note Types:**
    * *Summary Notes:* महत्त्वाचा सारांश.
    * *Short Notes:* बुलेट पॉईंट्समध्ये संक्षिप्त माहिती.
    * *Detailed Notes:* सविस्तर स्पष्टीकरण आणि उदाहरणे.
    * *Chapter Summary:* संपूर्ण प्रकरणाचा आढावा.
    * *Formula & Key Points:* गणिते, शास्त्रामधील सूत्रे आणि व्याख्या.
  * **Topic-based Note Generation:** फाईल अपलोड न करता कोणत्याही टॉपिकचे नाव देऊन नोट्स तयार करण्याची सोय.
  * **Export & Save:** नोट्स MongoDB मध्ये सेव्ह करणे आणि PDF/Text स्वरूपात डाऊनलोड करणे.

### 🗺️ ७. डायनॅमिक माइंड मॅप (`MindMapPage`)
* **कार्य:** अवघड संकल्पनांचा व्हिज्युअल ट्री-डायग्राम किंवा फ्लोचार्ट तयार करणे.
* **विशेष वैशिष्ट्ये:**
  * Groq Llama मॉडेलद्वारे नोड्स (Nodes) आणि एजेस (Edges) चा JSON डेटा तयार करणे.
  * `@xyflow/react` द्वारे इंटरअॅक्टिव्ह, ड्रॅगेबल आणि झूम-सक्षम ग्राफिकल मांडणी.
  * नोड्सवर क्लिक करून सविस्तर माहिती पाहणे.
  * माइंड मॅप इमेज (PNG) स्वरूपात सेव्ह / एक्सपोर्ट करणे.

### 🧪 ः. क्विझ आणि टेस्ट सेंटर (`QuizPage`)
* **कार्य:** अभ्यासाच्या नोट्सवर आधारित स्वयंचलित MCQ क्विझ आणि मूल्यांकन.
* **विशेष वैशिष्ट्ये:**
  * **Custom Quiz Generation:** काठिण्य पातळी (Easy, Medium, Hard) आणि प्रश्नांची संख्या निवडून क्विझ बनवणे.
  * **Live Timer & Progress:** वेळेचे भान ठेवून टेस्ट सोडवणे.
  * **Instant Result & Explanations:** टेस्ट पूर्ण झाल्यावर चुकीच्या उत्तरांचे स्पष्टीकरण मिळणे.
  * **Confetti Celebration:** उत्तम मार्क मिळाल्यास अ‍ॅनिमेशनद्वारे कौतुक.
  * **Score Analytics:** मार्क MongoDB मध्ये साठवले जाणे.

### 🎴 ९. फ्लॅशकार्ड्स हब (`FlashcardsPage`)
* **कार्य:** Spaced Repetition पद्धतीनुसार जलद रिव्हिजन करण्यासाठी ३D फ्लॅशकार्ड्स.
* **विशेष वैशिष्ट्ये:**
  * ३D फ्लिप कार्ड अ‍ॅनिमेशन (प्रश्न आणि मागे उत्तर).
  * "Easy", "Medium", "Hard" रेटिंग देऊन कार्ड्सची वर्गीकरण करणे.
  * Mastery Tracker: किती टक्के संकल्पना पक्क्या झाल्या हे पाहणे.

### 📚 १०. डॉक्युमेंट लायब्ररी (`LibraryPage`)
* **कार्य:** सर्व अपलोड केलेल्या फाईल्सचे मध्यवर्ती व्यवस्थापन (Central Storage).
* **विशेष वैशिष्ट्ये:**
  * फाईल सर्च, सब्जेक्टनुसार फिल्टरिंग आणि फाईलची साईझ व अपलोड तारीख पाहणे.
  * फाईलचे चॅंक्स आणि एक्स्ट्रॅक्ट केलेला मजकूर प्रीव्ह्यू करणे.
  * सिंगल किंवा बल्क फाईल डिलीट करण्याची सोय.

### 📑 ११. सब्जेक्ट्स मॅनेजमेंट (`SubjectsPage`)
* **कार्य:** विषयानुसार अभ्यासाचे वर्गीकरण करणे.
* **विशेष वैशिष्ट्ये:**
  * नवीन विषय (Subject) आणि प्रकरणे (Chapters) तयार करणे.
  * अपलोड केलेल्या फाईल्स आणि नोट्स विशिष्ट विषयाशी जोडणे (Tagging).
  * विषयानुसार अभ्यासाची प्रगती पाहणे.

### 📅 १२. AI स्टडी प्लॅनर (`PlannerPage`)
* **कार्य:** परीक्षेच्या वेळापत्रकानुसार AI द्वारे अभ्यासाचे नियोजन बनवणे.
* **विशेष वैशिष्ट्ये:**
  * विषयांची नावे, परीक्षेचे दिवस आणि रोज उपलब्ध असलेले तास दिल्यावर AI द्वारे Day-by-Day टाइमटेबल तयार होणे.
  * टास्क चेकलिस्ट: Task Status (Pending, In Progress, Completed) बदलणे.

### 📈 १३. ॲनालिटिक्स आणि परफॉर्मन्स ट्रॅकिंग (`AnalyticsPage`)
* **कार्य:** विद्यार्थ्याच्या अभ्यासाची आकडेवारी आणि आलेखांद्वारे प्रगती दाखवणे.
* **विशेष वैशिष्ट्ये:**
  * Daily & Weekly Study Hours (Recharts आलेख).
  * Subject-wise Accuracy आणि Quiz History.
  * कमकुवत टॉपिक्स (Weak Areas) ओळखून सुधारण्यासाठी AI कडून सूचना.

### 📜 १४. हिस्ट्री लॉग (`HistoryPage`)
* **कार्य:** युजरने केलेल्या सर्व क्रियांचा (Past Chats, Quizzes, Notes) इतिहास पाहणे.

### ⚙️ १५. प्रोफाईल, सेटिंग्ज आणि सिस्टीम मॉनिटरिंग (`ProfilePage`, `SettingsPage`, Monitoring)
* **कार्य:** वैयक्तिक माहिती, थीम सेटिंग्ज आणि सर्व्हर हेल्थ ट्रॅकिंग.
* **विशेष वैशिष्ट्ये:**
  * युजर प्रोफाईल अपडेट आणि अव्हेटार बदलणे.
  * सानुकूल Groq / Gemini API Keys कॉन्फिगर करणे.
  * **System Monitoring (`/api/v1/monitoring/system`):** `psutil` द्वारे सर्व्हरची CPU, RAM, Disk usage आणि डेटाबेस हेल्थ ट्रॅक करणे.
  * **Global Search (`/api/v1/search`):** संपूर्ण अ‍ॅपमधील फाईल्स, नोट्स, क्विझ आणि चॅटमध्ये एकाच वेळी सर्च करणे.

---

## 💾 ५. डेटाबेस स्कीमा आणि मॉडेल्स (Database Schema & Models)

### MongoDB Collections (`backend/app/models/`)

| Collection Name | Key Fields / Schema | Description |
| :--- | :--- | :--- |
| **`users`** | `_id`, `name`, `email`, `hashed_password`, `xp`, `streak`, `created_at`, `settings` | युजरची ऑथ माहिती आणि गॅमिफिकेशन पॉईंट्स |
| **`chats` & `messages`** | `_id`, `user_id`, `title`, `document_ids`, `created_at`, `messages` (`role`, `content`, `sources`) | चॅट हिस्ट्री आणि RAG सोर्स संदर्भ |
| **`documents`** | `_id`, `user_id`, `filename`, `file_type`, `file_path`, `file_size`, `num_chunks`, `subject_id` | अपलोड केलेल्या फाईल्सची मेटाडेटा माहिती |
| **`quizzes` & `attempts`** | `_id`, `user_id`, `title`, `questions`, `score`, `total_questions`, `difficulty`, `completed_at` | क्विझचे प्रश्न, उत्तरे आणि मिळालेले मार्क |
| **`flashcards`** | `_id`, `user_id`, `document_id`, `cards` (`question`, `answer`, `difficulty`, `subject`, `mastered`) | रिव्हिजन फ्लॅशकार्ड्सचे संच |
| **`subjects`** | `_id`, `user_id`, `name`, `description`, `color`, `chapters` | अभ्यासाचे विषय आणि प्रकरणे |
| **`study_plans`** | `_id`, `user_id`, `topics`, `days`, `hours_per_day`, `plan_data` | AI ने बनवलेले दैनंदिन अभ्यासाचे वेळापत्रक |
| **`analytics`** | `_id`, `user_id`, `study_time_minutes`, `quizzes_taken`, `avg_score`, `streak_days` | अभ्यासाचा आलेख आणि प्रगतीचा डेटा |

### ChromaDB Vector Collection
* **Vector Store Path:** `backend/chroma_data`
* **Stored Payload:**
  * `id`: unique chunk ID (`doc_id_chunk_index`)
  * `embedding`: Dense vector representing chunk semantics
  * `metadata`: `{ "document_id": "...", "user_id": "...", "chunk_index": 1, "filename": "..." }`
  * `document`: Original chunk text string

---

## 🛡️ ६. सुरक्षा, परफॉर्मन्स आणि गॅमिफिकेशन (Security, Performance & Gamification)

1. **सुरक्षा (Security):**
   * Password Hashing: `bcrypt` सॉल्टिंगसह.
   * Authentication: JWT Tokens सह Expiry आणि Protected Route validation.
   * API Protection: `SlowAPI` द्वारे डोस (DDoS) व गैरवापर रोखण्यासाठी रेट लिमिटिंग.
   * Clean Input Handling: Request Validation (`pydantic` & `zod`).

2. **परफॉर्मन्स (Performance):**
   * Asynchronous Execution: FastAPI आणि Async Driver (`motor`, `AsyncGroq`).
   * Ultra-Fast Inference: Groq Llama 3.1 चा वापर करून अवघ्या मिलीसेकंदात रिस्पॉन्स.
   * GZip Payload Compression: नेटवर्क बँडविड्थ वाचवण्यासाठी.
   * Chunk Optimization: RAG साठी अचूक 1000 कॅरेक्टर चॅंक्स.

3. **गॅमिफिकेशन (Gamification System):**
   * **Daily Streak System:** सलग लॉगिन करून अभ्यास केल्यास स्ट्रिक वाढते.
   * **XP & Leveling:** क्विझ सोडवल्यास, नोट्स वाचल्यास XP Points मिळतात.
   * **Celebrations:** यश मिळाल्यावर Canvas Confetti अ‍ॅनिमेशन्स.

---

## ⚙️ ७. लोकल सेटअप आणि रन करण्याच्या सूचना (Local Setup & Run Guide)

### १. बॅकएंड सेटअप (Backend Setup):
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Dependencies Install करा:
pip install -r requirements.txt
# .env फाईल तयार करा (GROQ_API_KEY, GEMINI_API_KEY, MONGODB_URL समाविष्ट करा)
# सर्व्हर चालू करा:
uvicorn app.main:app --reload --port 8000
```

### २. फ्रंटएंड सेटअप (Frontend Setup):
```bash
cd frontend
npm install
# .env फाईलमध्ये API URL द्या: VITE_API_BASE_URL=http://localhost:8000/api/v1
# सर्व्हर चालू करा:
npm run dev
```

---

## 📝 सारांश (Conclusion)

**LearnFlow AI (AI Smart Education Assistant)** हा एक अत्यंत परिपूर्ण, अत्याधुनिक, सुरक्षित आणि वापरण्यास सोपा एज्युकेशनल प्लॅटफॉर्म आहे. यामध्ये अत्याधुनिक AI (Groq & Gemini LLMs), व्हेक्टर डेटाबेस RAG (ChromaDB), 3D ऑडिओ-रिएक्टिव्ह व्हिज्युअलायझेशन (Three.js) आणि रीयल-टाईम व्हॉइस इंटरअॅक्शनचा सुरेख संगम करण्यात आला आहे.
