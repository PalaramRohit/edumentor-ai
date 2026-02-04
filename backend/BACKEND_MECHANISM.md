# EduMentor AI - Backend Codebase Deep Dive

This document provides a detailed, file-by-file explanation of the backend architecture. Use this as a guide to understand exactly what each piece of code does.

---

## 1. Core Application (`/backend`)

### `app.py` (The Entry Point)
This is the heart of the application. It initializes the web server and "glues" everything together.
-   **`create_app()`**: This function creates the Flask application instance.
-   **`CORS(app)`**: Enables Cross-Origin Resource Sharing, allowing your Frontend (running on port 5173 or 8080) to talk to this Backend (running on port 5000).
-   **Blueprints**: It imports and registers "Blueprints" (modules) like `users_bp`, `analysis_bp`, etc. This tells Flask: *"If a request starts with `/users`, send it to `api/users.py`"*.

---

## 2. API Endpoints (`/backend/api`)
This folder contains the "Routes" – the URLs that the frontend can call.

### `api/users.py`
Handles user identity.
-   **`POST /` (create_user)**: Receives a JSON object with `name`, `email`, `target_role`. Saves it to MongoDB.
-   **`GET /<user_id>`**: Fetches a user's details by their ID.

### `api/syllabus.py`
Handles the raw text input from the student.
-   **`POST /process`**:
    1.  Receives raw text (e.g., "I know Python, Java...").
    2.  Calls `nlp.extract_skills` to find keywords.
    3.  Updates the `syllabus` collection in MongoDB with these new skills.

### `api/analysis.py` (The Brain)
Performs the math to see where the student stands.
-   **`POST /run`**:
    1.  Fetches the student's skills from the `syllabus` collection.
    2.  Fetches "Job Profiles" (e.g., Backend Dev requirements) from the `jobs` collection.
    3.  Calls `ml.compute_similarity()` to compare them.
    4.  Returns a JSON object with:
        -   `readiness_pct`: A score from 0-100.
        -   `missing_skills`: List of skills the student doesn't have.
        -   `weak_skills`: Skills the student has but needs to improve.

### `api/roadmap.py`
Generates the learning plan.
-   **`POST /generate`**:
    1.  Receives a list of `missing_skills`.
    2.  Constructs a prompt for the AI: *"Create a 8-week plan to learn [skills]"*.
    3.  Calls `llm.generate_roadmap()`.
    4.  Returns a structured JSON timeline (Weeks, Topics, Goals) to the frontend.

### `api/explain.py`
Handles the AI Chat and explanations.
-   **`POST /score`**: Explains *why* a readiness score is low (e.g., "You scored 40% because you lack Docker").
-   **`POST /chat`**: The general chat endpoint. Logic:
    1.  Takes `message` from the request.
    2.  Calls `llm.chat(message)`.
    3.  Returns the AI's text response.

---

## 3. Services & Logic (`/backend/services`)
This folder contains the "Business Logic" – the code that *does the work*.

### `services/db.py`
The Data Layer.
-   **`init_db()`**: Connects to your MongoDB database using the `MONGO_URI`.
-   **Collections**: Defines variables for accessing specific tables:
    -   `users_coll`: User profiles.
    -   `syllabus_coll`: Extracted skills.
    -   `jobs_coll`: Job market data.
    -   `analysis_coll`: Results of past scans.

### `services/llm_client.py`
The AI Integration Layer.
-   **Class `CerebrasClient`**: A wrapper around the AI API.
-   **`_call_model()`**: The internal helper that actually sends the HTTP request to Cerebras.
-   **`extract_skills()`**: Prompts the AI to find skills in text.
-   **`generate_roadmap()`**: A strict prompt that forces the AI to output valid JSON for the roadmap visualization.
-   **`chat()`**: A simple conversational prompt for the Mentor Chat panel.

### `services/ml_core.py`
The Math Layer (Machine Learning).
-   **Class `MLCore`**:
    -   Uses `TfidfVectorizer` (Term Frequency-Inverse Document Frequency) to turn text triggers (skills) into numbers (vectors).
    -   **`compute_similarity()`**:
        1.  Converts the Student's skill list into a Vector.
        2.  Converts the Job's requirement list into a Vector.
        3.  Uses `cosine_similarity` to measure the angle between them.
        4.  Closer angle = Higher Match Score.

### `services/nlp_pipeline.py`
The Text Processing Layer.
-   **`clean_and_normalize()`**:
    -   Removes punctuation and weird characters.
    -   Converts everything to lowercase.
    -   Example: "I KNOW Java!!!" -> "know java".
-   **`extract_skills_rule_based()`**: Uses a predefined dictionary to find skills if the AI is slow/unavailable.

---

## 4. Scripts & Utilities

### `seed_jobs.py`
-   Run this once to populate the database with dummy job data (Backend Dev, Frontend Dev, etc.) so the analysis has something to compare against.

### `debug_full.py` / `check_db.py`
-   Diagnostic tools created to verify that the Server, Database, and AI connection are working correctly.
