import logging
import os
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from services import db

logger = logging.getLogger(__name__)


def infer_role_label(top_skills):
    """Heuristic to map top skills to a human-readable role label."""
    ts = set([s.lower() for s in top_skills])

    ml_keywords = {'tensorflow', 'pytorch', 'deep learning', 'nlp', 'computer vision', 'keras', 'scikit-learn', 'ml'}
    backend_keywords = {'flask', 'django', 'rest_api', 'rest', 'api', 'docker', 'kubernetes', 'sql', 'postgresql', 'mysql'}
    data_keywords = {'pandas', 'spark', 'hadoop', 'sql', 'nosql', 'bigquery', 'dataframe'}
    frontend_keywords = {'react', 'angular', 'vue', 'javascript', 'typescript', 'frontend'}

    if ts & ml_keywords:
        return 'AI / ML Engineer'
    if ts & frontend_keywords:
        return 'Frontend Engineer'
    if ts & data_keywords:
        return 'Data Scientist'
    if ts & backend_keywords:
        return 'Backend Engineer'
    return 'Other'


def cluster_jobs(k: int = 4, algorithm: str = 'kmeans') -> dict:
    """Cluster jobs using TF-IDF and assign cluster ids and inferred role labels.

    Returns a mapping of cluster_id -> metadata
    """
    jobs = list(db.job_coll.find())
    if not jobs:
        logger.info('No job documents found to cluster')
        return {}

    texts = [j.get('raw_text') or ' '.join(j.get('skills', [])) for j in jobs]

    vectorizer = TfidfVectorizer(max_df=0.9, min_df=1, ngram_range=(1, 2))
    X = vectorizer.fit_transform(texts)

    if algorithm == 'kmeans':
        model = KMeans(n_clusters=k, random_state=42)
        labels = model.fit_predict(X)
    else:
        raise ValueError('Unsupported clustering algorithm')

    # Update job docs with cluster assignments
    for job, lbl in zip(jobs, labels):
        db.job_coll.update_one({'_id': job['_id']}, {'$set': {'cluster_id': int(lbl)}})

    # Aggregate per-cluster metadata and infer labels
    clusters = {}
    for cluster_id in range(max(labels) + 1):
        cluster_jobs = [jobs[i] for i, l in enumerate(labels) if l == cluster_id]
        skill_counter = Counter()
        for cj in cluster_jobs:
            skill_counter.update(cj.get('skills', []))

        top_skills = [s for s, _ in skill_counter.most_common(10)]
        role_label = infer_role_label(top_skills)

        clusters[cluster_id] = {
            'cluster_id': int(cluster_id),
            'role_label': role_label,
            'top_skills': top_skills,
            'num_jobs': len(cluster_jobs)
        }

        # Update job docs with role_label
        for cj in cluster_jobs:
            db.job_coll.update_one({'_id': cj['_id']}, {'$set': {'role_label': role_label}})

        # Upsert cluster metadata
        db.job_clusters.update_one({'cluster_id': cluster_id}, {'$set': clusters[cluster_id]}, upsert=True)

    logger.info('Clustering complete: %d clusters created', len(clusters))
    return clusters
