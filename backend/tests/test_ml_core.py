from services.ml_core import MLCore


def test_compute_similarity_simple():
    ml = MLCore()
    syllabus = ['python', 'flask', 'mongodb']
    job = [{
        'role': 'Backend',
        'skills': ['python', 'sql', 'docker'],
        'weights': {'python': 2.0, 'sql': 1.0, 'docker': 1.0}
    }]
    res = ml.compute_similarity(syllabus, job)
    assert isinstance(res, list)
    assert res[0]['role'] == 'Backend'
    assert 'readiness_pct' in res[0]
