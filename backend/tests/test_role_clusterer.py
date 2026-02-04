from services.role_clusterer import infer_role_label, cluster_jobs
from collections import defaultdict


def test_infer_role_label():
    top_skills = ['python', 'flask', 'postgresql']
    label = infer_role_label(top_skills)
    assert label == 'Backend Engineer'


def test_cluster_jobs_monkeypatched(monkeypatch):
    # Create fake job documents
    fake_jobs = [
        {'_id': 1, 'raw_text': 'Looking for python backend engineer with flask and postgresql', 'skills': ['python','flask','postgresql']},
        {'_id': 2, 'raw_text': 'Deep learning engineer with pytorch and tensorflow experience', 'skills': ['pytorch','tensorflow']},
        {'_id': 3, 'raw_text': 'Frontend dev with react and javascript', 'skills': ['react','javascript']}
    ]

    class FakeColl:
        def __init__(self):
            self.docs = fake_jobs
        def find(self):
            return self.docs
        def update_one(self, q, u, upsert=False):
            # no-op for test
            return None

    monkeypatch.setattr('services.db.job_coll', FakeColl())
    monkeypatch.setattr('services.db.job_clusters', FakeColl())

    clusters = cluster_jobs(k=3)
    assert isinstance(clusters, dict)
    assert len(clusters) == 3
    # ensure labels are present
    labels = [c['role_label'] for c in clusters.values()]
    assert 'Backend Engineer' in labels or 'AI / ML Engineer' in labels or 'Frontend Engineer' in labels
