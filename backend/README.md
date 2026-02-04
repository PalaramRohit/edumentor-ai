# Skill–Syllabus Gap Analyzer (Backend)

🔧 Flask backend that combines Cerebras LLM for semantic skill extraction and local ML (TF-IDF + cosine) for scoring and explainability.

## Quickstart (Windows)

1. Create a venv local to this project (won't affect other folders):
   - powershell: python -m venv .venv
   - Activate: .\.venv\Scripts\Activate.ps1
2. Install deps: pip install -r requirements.txt
3. Download spaCy model: python -m spacy download en_core_web_sm
4. Copy `.env.example` → `.env` and fill values (Mongo URI, Cerebras API key)
5. Run: python app.py

## What is included
- Flask API endpoints: `POST /users` (create), `GET /users/<id>` (retrieve)
- `POST /syllabus/process` — accepts `{user_id, text}` and stores extracted/normalized skills
- `POST /jobs/process` — admin/ingestion of job description skills
- `POST /analysis/run` — run TF-IDF analysis for a user & role
- `POST /roadmap/generate` — generate roadmap from missing skills
- `POST /explain/score` — get human-friendly explanation for readiness

Other modules:
- LLM wrapper (`services/llm_client.py`) for Cerebras (with error handling & fallback)
- Local NLP (`services/nlp_pipeline.py`) using spaCy and an ontology map
- ML core (`services/ml_core.py`) using TF-IDF & cosine similarity for readiness and gap detection
- MongoDB integration via `pymongo`

## Notes
- Cerebras SDK package name and usage may change; update `requirements.txt` accordingly.
- Provide real credentials via `.env` (see `.env.example`).
- For production, run behind a WSGI server such as gunicorn and secure env vars.

---

### Example: Run locally (Windows)
1. powershell: `python -m venv .venv`
2. `\.venv\Scripts\Activate.ps1`
3. `pip install -r requirements.txt`
4. `python -m spacy download en_core_web_sm`
5. Set `.env` (or environment) and run `python app.py`

> ⚠️ Security note: **Do not commit** your `CEREBRAS_API_KEY`. Set it in `.env` or CI secrets. The repository must never contain clear-text API keys.
>
> If the key was **already** committed, rotate the key immediately and remove it from history (e.g. `git rm --cached .env` and use BFG or `git filter-branch` to purge it). Never share API keys in chat or public repos.

### Cerebras SDK example (use in your local environment)

Set `CEREBRAS_API_KEY` in your environment (or add to `.env`).

Python usage example (do not paste secret keys into source files):

```python
import os
from cerebras.cloud.sdk import Cerebras

client = Cerebras(api_key=os.environ.get("CEREBRAS_API_KEY"))
completion = client.chat.completions.create(
    messages=[{"role":"user","content":"Why is fast inference important?"}],
    model="llama-3.3-70b",
    max_completion_tokens=512,
    temperature=0.2
)
print(completion.choices[0].message.content)
```

### Example requests
- Create user: `POST /users` {name, email, branch, year, target_role}
- Process syllabus: `POST /syllabus/process` {user_id, text}
- Ingest job: `POST /jobs/process` {role, text, source, weights(optional)}
- Run analysis: `POST /analysis/run` {user_id, target_role}
- Generate roadmap: `POST /roadmap/generate` {user_id, missing_skills, hours_per_week}
- Explain score: `POST /explain/score` {user_id, analysis_id}
