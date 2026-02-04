from services.nlp_pipeline import clean_and_normalize


def test_ontology_mapping_basic():
    skills = ["RESTful services", "API integration", "rest api development"]
    normalized = clean_and_normalize(skills)
    assert 'REST_API' in normalized or 'REST_API_GENERIC' in normalized


def test_ontology_mapping_sql():
    s = ["PostgreSQL", "relational database"]
    normalized = clean_and_normalize(s)
    assert 'SQL' in normalized
