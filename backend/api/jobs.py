from flask import Blueprint, request, jsonify
from services.llm_client import CerebrasClient
from services.nlp_pipeline import clean_and_normalize
from services import db

bp = Blueprint('jobs', __name__, url_prefix='/jobs')
llm = CerebrasClient()


@bp.route('/process', methods=['POST'])
def process_job():
    """Accept JSON {role, text, source, weights(optional)}"""
    data = request.get_json()
    role = data.get('role')
    text = data.get('text')
    source = data.get('source', 'manual')
    weights = data.get('weights', {})
    if not role or not text:
        return {'error': 'role and text required'}, 400

    try:
        skills = llm.extract_skills(text, role=role)
    except Exception:
        # fallback: basic splitting by commas and whitespace
        skills = [s.strip() for s in text.split(',') if s.strip()]

    normalized = clean_and_normalize(skills)

    doc = {
        'role': role,
        'source': source,
        'raw_text': text,
        'skills': normalized,
        'weights': weights,
        'cluster_id': None,
        'role_label': None,
    }
    res = db.job_coll.insert_one(doc)
    doc['_id'] = str(res.inserted_id)
    return doc, 201


@bp.route('/byrole/<role>', methods=['GET'])
def get_jobs_by_role(role):
    docs = list(db.job_coll.find({'role': role}))
    for d in docs:
        d['_id'] = str(d['_id'])
    return jsonify(docs)
