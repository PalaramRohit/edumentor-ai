# EduMentor AI - Complete Backend Documentation
**Version:** 2.0 (Master Reference)
**Date:** 2026-02-03

---

## Part 1: Glossary of Technical Terms
*A dictionary of every concept used in this project.*

### 1. Web Framework Concepts
*   **Flask**: A "micro-web framework" written in Python. It is called "micro" because it does not require particular tools or libraries. We use it to create our **API** (Application Programming Interface).
*   **API (Application Programming Interface)**: A set of rules that allows the Frontend (React) to talk to the Backend (Python). Imagine it as a waiter in a restaurant who takes your order (Frontend) to the kitchen (Backend).
*   **Endpoint**: A specific URL where the API listens for requests (e.g., `/analysis/run`).
*   **JSON (JavaScript Object Notation)**: The language of data exchange. It looks like a Python dictionary `{ "key": "value" }` and is used to send data back and forth.
*   **CORS (Cross-Origin Resource Sharing)**: A security feature. By default, browsers block a website on `port 5173` from talking to a server on `port 5000`. We enabled CORS to allow this communication.

### 2. Machine Learning Concepts (The "Brain")
*   **NLP (Natural Language Processing)**: A branch of AI that gives computers the ability to understand text and spoken words in much the same way human beings can.
*   **Vectorization**: The process of converting words (text) into numbers (vectors) so a computer can do math on them. Computers cannot understand "Python", but they understand `[0.0, 0.5, 0.1]`.
*   **TF-IDF (Term Frequency-Inverse Document Frequency)**:
    *   **Definition**: A statistical formula to evaluate how important a word is to a document.
    *   **TF (Term Frequency)**: How many times a word appears in a text.
    *   **IDF (Inverse Document Frequency)**: Penalizes words that appear everywhere (like "the", "and", "coding") and boosts unique words (like "Django", "Kubernetes").
    *   **Why we used it**: It helps us find the *important* skills in a syllabus while ignoring common English filler words.
*   **Cosine Similarity**:
    *   **Definition**: A metric used to measure how similar two vectors are. It measures the cosine of the angle between two vectors projected in a multi-dimensional space.
    *   **Range**: 0 (Completely different) to 1 (Exactly the same).
    *   **Why we used it**: It allows us to compare a Student's Profile Vector against a Job Profile Vector to calculate a "Match Percentage".
*   **Spare Matrix**: A matrix (table of numbers) that is mostly zeros. Since a language has thousands of words but a student only knows a few, the vector is mostly empty. Efficient storage of this is crucial for speed.

### 3. Generative AI Concepts
*   **LLM (Large Language Model)**: A deep learning algorithm that can recognize, summarize, translate, predict, and generate text. We use **Llama-3.1** via Cerebras.
*   **Inference**: The actual act of the AI "thinking" and producing an answer.
*   **Prompt Engineering**: The art of structuring the input text to the AI to get the best possible output.
    *   *System Prompt*: "You are an academic mentor..." (Sets the behavior).
    *   *User Prompt*: "Explain Docker..." ( The specific request).
*   **Hallucination**: When an AI confidently invents false information.
    *   **Prevention**: We use "Grounding" (giving the AI strict data) and "Format Enforcement" (forcing it to output JSON) to minimize this.

---

## Part 2: Module-by-Module Explanation
*Detailed breakdown of every file in the backend.*

### 1. `services/ml_core.py` (The Mathematical Engine)
*   **Purpose**: To perform the math required for Skill Gap Analysis.
*   **Key Functions**:
    *   `TfidfVectorizer(min_df=1)`: Initializes the tool that turns text into numbers. `min_df=1` means "even if a word appears only once, count it".
    *   `fit_transform(corpus)`: The actual command that learns the vocabulary and converts the text.
    *   `cosine_similarity(a, b)`: Calculates the match score.
*   **The "Hybrid Score" Logic**:
    *   We didn't just trust the math. We added a custom rule: `Score = 0.6 * math_score + 0.4 * exact_match`.
    *   This ensures that if a student *explicitly* lists a skill, they get credit even if the vector context is slightly off.

### 2. `services/llm_client.py` (The AI Gateway)
*   **Purpose**: To talk to the external Cerebras AI service.
*   **Key Functions**:
    *   `generate_roadmap()`: Contains a massive, strict prompt that forbids the AI from chatting and forces it to return **only JSON data**. This is crucial so our Frontend doesn't crash trying to display a conversation.
    *   `extract_skills()`: Asks the AI to read a syllabus and return a Python list `['skill1', 'skill2']`.

### 3. `api/analysis.py` (The Coordinator)
*   **Purpose**: To connect the Database, the ML Engine, and the User Request.
*   **Logic Flow**:
    1.  Get User ID.
    2.  Get User's Skills from MongoDB (`syllabus_coll`).
    3.  Get Job Requirements from MongoDB (`jobs_coll`).
    4.  Send both to `MLCore` for comparison.
    5.  Save the result to MongoDB (`analysis_coll`).
    6.  Return the result to the user.

### 4. `api/roadmap.py` (The Planner)
*   **Purpose**: To hold the logic for generating study timelines.
*   **Why it's separate**: Roadmap generation takes time (3-5 seconds) because it calls the AI. Separating it keeps the rest of the site fast.

---

## Part 3: Why We Made These Technical Choices

### Why TF-IDF and not just "Word Matching"?
*   **Word Matching**: "Java" == "Java". Simple.
*   **Problem**: "Java Programming" != "Java". It fails.
*   **Solution**: TF-IDF understands that "Java" is the important part of "Java Programming", so it matches them even if they aren't identical strings.

### Why Flask (Python) instead of Node.js?
*   Python is the native language of **Data Science** and **Machine Learning**.
*   Using Python allows us to directly import `scikit-learn` (for TF-IDF) without needing complex bridges between languages.

### Why MongoDB (NoSQL) instead of SQL?
*   Our data is **unstructured**. A "Syllabus" can be any length. A "Roadmap" is a complex nested tree of weeks and tasks.
*   SQL requires strict tables (Rows/Columns).
*   MongoDB allows us to dump complex JSON objects directly, which is perfect for AI-generated data.
