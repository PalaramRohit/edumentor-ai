from .db import db, users_coll, syllabus_coll, job_coll, job_clusters, analysis_coll, roadmap_coll
from .llm_client import CerebrasClient
from .db import db, users_coll, syllabus_coll, job_coll, job_clusters, analysis_coll, roadmap_coll
from .llm_client import CerebrasClient

# Make ML/NLP optional for now to allow server start if deps fail
try:
    from .nlp_pipeline import clean_and_normalize
except ImportError:
    clean_and_normalize = lambda x: x

try:
    from .ml_core import MLCore
except ImportError:
    MLCore = None

try:
    from .fallback_extractor import extract_skills_rule_based
except ImportError:
    extract_skills_rule_based = None

try:
    from .role_clusterer import cluster_jobs
except ImportError:
    cluster_jobs = None

__all__ = [
    'db', 'users_coll', 'syllabus_coll', 'job_coll', 'job_clusters', 'analysis_coll', 'roadmap_coll',
    'CerebrasClient', 'clean_and_normalize', 'MLCore', 'extract_skills_rule_based', 'cluster_jobs'
]
