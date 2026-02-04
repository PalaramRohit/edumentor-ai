import logging
import json
from config import CEREBRAS_API_KEY, CEREBRAS_MODEL

logger = logging.getLogger(__name__)

# Attempt to import the official Cerebras SDK
try:
    from cerebras.cloud.sdk import Cerebras
except Exception:
    Cerebras = None
    logger.warning("Cerebras SDK not installed; LLM calls will fail or use fallback.")


class CerebrasClient:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or CEREBRAS_API_KEY
        self.model = model or CEREBRAS_MODEL
        self.client = None

        if Cerebras is None:
            logger.debug("Cerebras class not found. Install `cerebras-cloud-sdk` to enable LLM features.")
            return

        try:
            self.client = Cerebras(api_key=self.api_key)
        except Exception as e:
            logger.exception("Failed to initialize Cerebras client: %s", e)
            self.client = None

        except Exception as e:
            logger.exception("Cerebras API call failed: %s", e)
            raise

    def _call_model(self, prompt: str, max_tokens: int = 512, temperature: float = 0.2) -> dict:
        """Call the Cerebras chat completions API and return a dict with key `text`."""
        if self.client is None:
            raise RuntimeError("Cerebras SDK not available or client initialization failed")

        messages = [
            {"role": "system", "content": "You are a helpful assistant. When asked to produce JSON, output only valid JSON."},
            {"role": "user", "content": prompt},
        ]

        try:
            res = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                max_completion_tokens=max_tokens,
                temperature=temperature,
                stream=False,
            )
            
            # Debug logging
            logger.info(f"Raw Cerebras response type: {type(res)}")
            # logger.info(f"Raw Cerebras response: {res}") 

            # SDK returns object; try to extract content
            content = None
            try:
                content = res.choices[0].message.content
            except Exception as e:
                logger.warning(f"Standard extraction failed: {e}")
                # Some SDK versions may provide different shape
                content = getattr(res, "text", None) or getattr(res, "message", "")
            
            logger.info(f"Extracted content: {content}")

            if not content:
                logger.error("Content is empty or None")
                return {"text": "{}"} # Return empty json object instead of empty string to avoid crash

            return {"text": content}
        except Exception as e:
            logger.exception("Cerebras API call failed: %s", e)
            raise

    def extract_skills(self, text: str, role: str = None) -> list:
        """Use Cerebras to extract skills. Returns list[str]."""
        prompt = (
            "Extract technical skills, tools, frameworks, libraries, and core concepts from the following text. "
            "Return output as a JSON array of strings ONLY (e.g. [\"python\", \"flask\"]).\n\n"
            f"Text:\n{text[:4000]}"
        )
        if role:
            prompt += f"\nTarget role: {role}."

        try:
            res = self._call_model(prompt, max_tokens=1024, temperature=0.0)
            text_out = res.get("text", "[]")
            skills = json.loads(text_out)
            return skills
        except json.JSONDecodeError:
            logger.exception("Failed to parse JSON from LLM response for skill extraction")
            raise
        except Exception as e:
            logger.exception("LLM skill extraction failed: %s", e)
            raise

    def generate_roadmap(self, missing_skills: list, target_role: str, hours_per_week: int = 10, weeks: int = 8, lang: str = 'en') -> dict:
        lang_name = {"en": "English", "hi": "Hindi", "te": "Telugu"}.get(lang, "English")
        prompt = (
            "You are an AI academic and career mentor system used inside a backend service.\n"
            "Your response will be parsed using Python json.loads().\n"
            "If your output is not valid JSON, the backend will CRASH.\n"
            f"IMPORTANT: All descriptive values in the JSON MUST be written in {lang_name}.\n\n"
            "TASK:\n"
            "Based on the student's current skills, syllabus, and target job role, generate a personalized WEEKLY LEARNING ROADMAP that is easy for an undergraduate student to understand.\n\n"
            "ABSOLUTE NON-NEGOTIABLE OUTPUT RULES:\n"
            "1. OUTPUT MUST NEVER BE EMPTY\n"
            "2. OUTPUT MUST BE VALID JSON ONLY\n"
            "3. DO NOT return plain text, markdown, explanations, headings, or code blocks\n"
            "4. DO NOT include ``` or any formatting symbols\n"
            "5. Use DOUBLE QUOTES for all keys and string values\n"
            "6. Response MUST start with { and MUST end with }\n\n"
            "JSON STRUCTURE (FOLLOW EXACTLY):\n\n"
            "{\n"
            "  \"overview\": {\n"
            "    \"target_role\": \"<string>\",\n"
            "    \"current_level\": \"<beginner | intermediate | advanced>\",\n"
            "    \"estimated_readiness_percent\": <number between 0 and 100>,\n"
            "    \"summary\": \"<friendly explanation in target language>\"\n"
            "  },\n"
            "  \"missing_or_weak_skills\": [\"skill1\", \"skill2\"],\n"
            "  \"weekly_roadmap\": [\n"
            "    {\n"
            "      \"week\": 1,\n"
            "      \"focus\": \"<topic in target language>\",\n"
            "      \"goals\": [\"<goal in target language>\"],\n"
            "      \"tasks\": [\"<task in target language>\"],\n"
            "      \"expected_outcome\": \"<outcome in target language>\"\n"
            "    }\n"
            "  ],\n"
            "  \"final_guidance\": \"<short motivational advice in target language>\"\n"
            "}\n\n"
            f"CONTEXT:\n"
            f"Target Role: {target_role}\n"
            f"Missing Skills: {missing_skills}\n"
            f"Language: {lang_name}\n"
            f"Time Constraint: {weeks} weeks, {hours_per_week} hours/week."
        )
        try:
            res = self._call_model(prompt, max_tokens=2048, temperature=0.2)
            roadmap = json.loads(res.get("text", "{}"))
            return roadmap
        except json.JSONDecodeError:
            logger.exception("Failed to parse JSON from LLM roadmap response")
            return {"error": "Invalid JSON response from LLM"}
        except Exception as e:
            logger.exception("LLM roadmap generation failed: %s", e)
            raise

    def explain_score(self, readiness_pct: float, gaps: dict, lang: str = 'en') -> str:
        lang_name = {"en": "English", "hi": "Hindi", "te": "Telugu"}.get(lang, "English")
        prompt = (
            f"Explain in short, non-technical terms why the readiness is {readiness_pct:.1f}% and summarize top skill gaps: {gaps}. "
            f"IMPORTANT: Respond ONLY in {lang_name}. Keep it actionable and friendly."
        )
        try:
            res = self._call_model(prompt, max_tokens=512, temperature=0.3)
            return res.get("text", "")
        except Exception as e:
            logger.exception("LLM explain failed: %s", e)
            raise

    def chat(self, message: str, lang: str = 'en') -> str:
        """General chat interaction with the AI Mentor."""
        lang_name = {"en": "English", "hi": "Hindi", "te": "Telugu"}.get(lang, "English")
        system_prompt = (
            "You are EduMentor, a helpful and encouraging academic AI assistant for undergraduate students. "
            f"IMPORTANT: You MUST speak ONLY in {lang_name}. "
            "Help them with programming concepts, career advice, and study tips."
        )
        prompt = f"{system_prompt}\n\nUser Question: {message}"
        try:
            res = self._call_model(prompt, max_tokens=1024, temperature=0.7)
            return res.get("text", "I'm having trouble thinking right now.")
        except Exception as e:
            logger.exception("LLM chat failed: %s", e)
            return "Server Error."
