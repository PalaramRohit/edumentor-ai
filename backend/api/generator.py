from flask import Blueprint, request, send_file, jsonify
from services import db
from services.llm_client import CerebrasClient
from services.pdf_service import create_resume_pdf, create_paper_pdf
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
import io

bp = Blueprint('generator', __name__, url_prefix='/generator')
llm = CerebrasClient()

@bp.route('/resume', methods=['POST'])
@jwt_required(optional=True)
def generate_resume():
    current_user_id = get_jwt_identity()
    print(f"DEBUG: Headers: {request.headers}")
    print(f"DEBUG: Identity found: {current_user_id}")
    
    payload = request.get_json() or {}
    print(f"DEBUG: Payload received: {payload}")
    
    if current_user_id:
        user = db.users_coll.find_one({'_id': ObjectId(current_user_id)})
    elif payload.get('user_id'):
        # Fallback to provided user_id (Bypass mode)
        provided_id = payload.get('user_id')
        print(f"DEBUG: Using fallback user_id from payload: {provided_id}")
        try:
             user = db.users_coll.find_one({'_id': ObjectId(provided_id)})
        except:
             print("DEBUG: Invalid ObjectId format for fallback user_id")
             user = None
    else:
        # Final fallback: Fetch the LATEST user (likely the one currently demoing)
        print("DEBUG: No valid token or user_id, falling back to LATEST user")
        user = db.users_coll.find_one(sort=[('_id', -1)])
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 1. Gather Data
    resume_data = {
        'name': payload.get('name') or user.get('name', 'Candidate'),
        'email': payload.get('email') or user.get('email', 'email@example.com'),
        'skills': user.get('skills', []),
        'education': payload.get('education', ''),
        'experience': payload.get('experience', ''),
        'projects': payload.get('projects', '')
    }

    # 2. Add AI Polish (Optional but recommended) - Skipping complex polishing for V1 speed, 
    # relying on PDF formatting. Or simple "Optimize this text" calls if needed.
    # For now, we pass direct input to ensure stability as per "UI Safety" concerns.
    
    # 3. Generate PDF
    try:
        pdf_buffer = create_resume_pdf(resume_data)
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"{user.get('name', 'Resume')}_Resume.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Resume PDF generation failed: {e}")
        return jsonify({'error': f'Failed to generate PDF: {str(e)}'}), 500


@bp.route('/paper', methods=['POST'])
@jwt_required(optional=True)
def generate_paper():
    current_user_id = get_jwt_identity()
    
    if current_user_id:
        user = db.users_coll.find_one({'_id': ObjectId(current_user_id)})
    else:
         # Fallback to LATEST user
         user = db.users_coll.find_one(sort=[('_id', -1)])

    if not user:
        return jsonify({'error': 'User not found'}), 404

    payload = request.get_json()
    title = payload.get('title')
    topic = payload.get('topic')
    points = payload.get('points')

    if not title or not topic:
        return jsonify({'error': 'Title and Topic are required'}), 400

    # 1. Generate Content via LLM
    try:
        prompt = (
            f"Write a technical paper titled '{title}' on the topic: '{topic}'.\n"
            f"Key points to cover: {points}\n"
            "Generate JSON output with keys: 'abstract', 'introduction', 'methodology', 'results', 'conclusion'.\n"
            "Each value should be a substantial paragraph."
        )
        
        # Use existing LLM client logic via _call_model since no specific method exists for paper
        # We need to manually parse or add a helper in LLM.
        # For safety/speed, let's treat it as a chat or generic generation 
        # But we need JSON structure.
        
        # We'll try to extract JSON.
        res = llm._call_model(prompt, max_tokens=2048)
        import json
        try:
            content = json.loads(res.get('text', '{}'))
        except:
            # Fallback text parsing if JSON fails? Or just return error.
            # Let's simple try strict JSON prompt.
            return jsonify({'error': 'LLM failed to generate structured content'}), 500

    except Exception as e:
        print(f"LLM Paper generation failed: {e}")
        return jsonify({'error': 'AI Generation failed'}), 500

    # 2. Format Data
    paper_data = {
        'title': title,
        'author': user.get('name', 'Author'),
        'abstract': content.get('abstract', ''),
        'introduction': content.get('introduction', ''),
        'methodology': content.get('methodology', ''),
        'results': content.get('results', ''),
        'conclusion': content.get('conclusion', '')
    }

    # 3. Generate PDF
    try:
        pdf_buffer = create_paper_pdf(paper_data)
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"{title.replace(' ', '_')}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"Paper PDF generation failed: {e}")
        return jsonify({'error': 'Failed to generate PDF'}), 500
