from services.llm_client import CerebrasClient


def test_extract_skills_parses_json(monkeypatch):
    client = CerebrasClient(api_key="test", model="test")

    def fake_call(prompt, max_tokens=512, temperature=0.0):
        return {"text": '["python", "flask", "mongodb"]'}

    monkeypatch.setattr(client, "_call_model", fake_call)

    skills = client.extract_skills("some syllabus text")
    assert isinstance(skills, list)
    assert "python" in skills


def test_generate_roadmap_parses_json(monkeypatch):
    client = CerebrasClient(api_key="test", model="test")

    roadmap_json = '{"weeks": [{"week":1, "topics":["python"]}]}'

    def fake_call(prompt, max_tokens=1024, temperature=0.2):
        return {"text": roadmap_json}

    monkeypatch.setattr(client, "_call_model", fake_call)

    roadmap = client.generate_roadmap(["python"], hours_per_week=5, weeks=4)
    assert isinstance(roadmap, dict)
    assert "weeks" in roadmap
