from flask import Blueprint, request, jsonify
from services.llm_client import CerebrasClient
from services import db
from bson import ObjectId

bp = Blueprint('explain', __name__, url_prefix='/explain')
llm = CerebrasClient()


@bp.route('/score', methods=['POST'])
def explain_score():
    data = request.get_json()
    user_id = data.get('user_id')
    analysis_id = data.get('analysis_id')
    if not user_id or not analysis_id:
        return {'error': 'user_id and analysis_id required'}, 400

    analysis = db.analysis_coll.find_one({'_id': ObjectId(analysis_id)})
    if not analysis:
        return {'error': 'analysis not found'}, 404

    # Create a concise gaps summary
    summaries = []
    for r in analysis['results']:
        summaries.append({
            'role': r['role'],
            'readiness_pct': r['readiness_pct'],
            'missing': r['missing_skills'][:5]
        })

    try:
        lang = data.get('lang', 'en')
        explanation = llm.explain_score(analysis['results'], summaries, lang=lang)
    except Exception:
        explanation = "Readiness computed using TF-IDF & skill matching. Missing skills and weak skills are listed in the analysis results; focus on those first."

    return jsonify({'explanation': explanation})


@bp.route('/chat', methods=['POST'])
def chat():
    """Generic chat endpoint"""
    data = request.get_json()
    message = data.get('message', '')
    lang = data.get('lang', 'en')
    
    if not message:
        return {'error': 'Message required'}, 400

    response_text = llm.chat(message, lang=lang)
    return jsonify({'reply': response_text})
