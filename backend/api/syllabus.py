from flask import Blueprint, request, jsonify
from services.llm_client import CerebrasClient
from services.fallback_extractor import extract_skills_rule_based
from services.nlp_pipeline import clean_and_normalize
from services import db
from bson import ObjectId
import logging
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('syllabus', __name__, url_prefix='/syllabus')
llm = CerebrasClient()
logger = logging.getLogger(__name__)


@bp.route('/process', methods=['POST'])
@jwt_required(optional=True)
def process_syllabus():
    """Accept JSON {user_id, text}. Returns extracted + normalized skills and stores them."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    user_id = data.get('user_id') or current_user_id # Prioritize user_id from payload, fallback to JWT identity
    text = data.get('text')
    if not user_id or not text:
        return jsonify({'error': 'user_id and text required'}), 400

    try:
        skills = llm.extract_skills(text, role=None)
    except Exception:
        logger.warning('LLM failed; using fallback extractor')
        skills = extract_skills_rule_based(text)

    normalized = clean_and_normalize(skills)

    doc = {
        'user_id': ObjectId(user_id),
        'raw_text': text[:10000],
        'extracted_skills': skills,
        'normalized_skills': normalized,
    }
    res = db.syllabus_coll.insert_one(doc)
    doc['_id'] = str(res.inserted_id)
    doc['user_id'] = user_id
    return jsonify(doc)
