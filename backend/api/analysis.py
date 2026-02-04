from flask import Blueprint, request, jsonify
from services.ml_core import MLCore
from services import db
from bson import ObjectId

from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('analysis', __name__, url_prefix='/analysis')
ml = MLCore()


@bp.route('/run', methods=['POST'])
@jwt_required(optional=True)
def run_analysis():
    current_user_id = get_jwt_identity()
    payload = request.get_json()
    # payload['user_id'] = current_user_id # Enforce user_id from token
    
    user_id = payload.get('user_id') or current_user_id 
    
    if not user_id:
        # Fallback to first user for demo
        first_user = db.users_coll.find_one()
        if first_user:
            user_id = str(first_user['_id'])
            print(f"DEBUG: Fallback analysis for first user: {user_id}")
    
    target_role = payload.get('target_role')
    """JSON {user_id, target_role}
    Returns analysis result and stores it.
    """
    try:
        # The original `data` variable is now `payload`
        # user_id = data.get('user_id') # This line is replaced by the new user_id logic
        role = target_role # Renamed for consistency with original code

        if not user_id or not role:
            return {'error': 'user_id and target_role required'}, 400

        # 1. Try to fetch user's manual skills first
        user_doc = db.users_coll.find_one({'_id': ObjectId(user_id)})
        manual_skills = user_doc.get('skills', []) if user_doc else []

        final_skills = []

        if manual_skills and len(manual_skills) > 0:
            print(f"Using manual skills for analysis: {manual_skills}")
            final_skills = manual_skills
        else:
            # 2. Fallback to syllabus skills
            print("No manual skills found, falling back to syllabus...")
            syl = db.syllabus_coll.find_one({'user_id': ObjectId(user_id)})
            if syl:
                final_skills = syl.get('normalized_skills', [])
            else:
                final_skills = []

        # If still empty, we can still run analysis but it will show 0 readiness
        print(f"Final skills used for analysis: {final_skills}")

        # fetch jobs for role
        job_docs = list(db.job_coll.find({'role': role}))

        if not job_docs:
            print(f"No jobs found for role: {role}")
            return {'error': 'no job skill data for role'}, 404

        job_skill_sets = []
        for j in job_docs:
            job_skill_sets.append({
                'role': j['role'],
                'skills': j['skills'],
                'weights': j.get('weights', {})
            })

        try:
            results = ml.compute_similarity(syllabus_skills, job_skill_sets)
        except Exception as e:
            print(f"ML Core crashed: {e}")
            import traceback
            traceback.print_exc()
            return {'error': 'Analysis calculation failed internally'}, 500

        # determine used cluster id (most common among the job_docs if present)
        cluster_ids = [j.get('cluster_id') for j in job_docs if j.get('cluster_id') is not None]
        role_cluster_used = None
        if cluster_ids:
            from collections import Counter
            most_common = Counter(cluster_ids).most_common(1)
            if most_common:
                role_cluster_used = int(most_common[0][0])

        # aggregate per-skill confidence across job results
        agg = {}
        counts = {}
        for r in results:
            psc = r.get('per_skill_confidence', {})
            for skill, info in psc.items():
                agg.setdefault(skill, 0.0)
                counts.setdefault(skill, 0)
                agg[skill] += info.get('final_score', 0.0)
                counts[skill] += 1
        
        per_skill_confidence = {}
        if agg:
            per_skill_confidence = {s: (agg[s] / counts[s]) for s in agg}

        analysis_doc = {
            'user_id': ObjectId(user_id),
            'role': role,
            'results': results,
            'per_skill_confidence': per_skill_confidence,
            'role_cluster_used': role_cluster_used
        }
    
        res = db.analysis_coll.insert_one(analysis_doc)
        analysis_doc['_id'] = str(res.inserted_id)
        # Convert ObjectId to str for response
        if 'user_id' in analysis_doc:
                analysis_doc['user_id'] = str(analysis_doc['user_id'])
        return jsonify(analysis_doc)

    except Exception as e:
        print(f"CRITICAL ERROR in /analysis/run: {e}")
        import traceback
        traceback.print_exc()
        return {'error': f"Internal Server Error: {str(e)}"}, 500
