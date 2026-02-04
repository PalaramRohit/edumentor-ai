from flask import Blueprint, request, jsonify
from services.llm_client import CerebrasClient
from services import db
from bson import ObjectId

from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('roadmap', __name__, url_prefix='/roadmap')
llm = CerebrasClient()


@bp.route('/generate', methods=['POST'])
@jwt_required(optional=True)
def generate_roadmap():
    """JSON {user_id, missing_skills, hours_per_week(optional), weeks(optional)}"""
    current_user_id = get_jwt_identity()
    payload = request.get_json()
    
    user_id = payload.get('user_id') or current_user_id
    missing_skills = payload.get('missing_skills')
    hours = int(payload.get('hours_per_week', 10))
    weeks = int(payload.get('weeks', 8))
    lang = payload.get('lang', 'en')

    if not user_id or not missing_skills:
        return {'error': 'user_id and missing_skills required'}, 400

    # fetch user to get target role
    user = db.users_coll.find_one({'_id': ObjectId(user_id)})
    target_role = user.get('target_role', 'General Learner') if user else 'General Learner'

    try:
        roadmap = llm.generate_roadmap(missing_skills, target_role, hours, weeks, lang=lang)
        # Normalize key for frontend compatibility
        if 'weekly_roadmap' in roadmap:
            roadmap['weeks'] = roadmap.pop('weekly_roadmap')
    except Exception:
        # simple fallback: evenly distribute topics across weeks
        per_week = max(1, len(missing_skills) // weeks)
        roadmap = {'weeks': []}
        i = 0
        for w in range(weeks):
            chunk = missing_skills[i:i+per_week]
            roadmap['weeks'].append({
                'week': w+1, 
                'focus': f"Focus on {', '.join(chunk[:2])}",
                'expected_outcome': "Understand core concepts",
                'tasks': [f"Study {topic}" for topic in chunk]
            })
            i += per_week

    doc = {
        'user_id': ObjectId(user_id),
        'missing_skills': missing_skills,
        'roadmap': roadmap,
    }
    res = db.roadmap_coll.insert_one(doc)
    doc['_id'] = str(res.inserted_id)
    doc['user_id'] = str(doc['user_id'])
    print(f"Generated Roadmap: {roadmap}") # Print to server logs for visibility
    return jsonify(doc)
