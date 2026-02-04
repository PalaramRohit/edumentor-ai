from flask import Blueprint, request, jsonify
from services.llm_client import CerebrasClient
import logging

bp = Blueprint('interview', __name__, url_prefix='/interview')
llm = CerebrasClient()
logger = logging.getLogger(__name__)

@bp.route('/start', methods=['POST'])
def start_interview():
    """Starts an interview session."""
    data = request.get_json()
    role = data.get('role', 'Software Developer')
    
    # Generate the first question
    prompt = (
        f"You are a technical interviewer for a {role} position. "
        "Start the interview by introducing yourself briefly and asking the first technical question. "
        "Keep it professional and concise."
    )
    
    try:
        lang = data.get('lang', 'en')
        response = llm.chat(prompt, lang=lang)
        return jsonify({'message': response})
    except Exception as e:
        logger.error(f"Interview start failed: {e}")
        return jsonify({'message': f"Hello! I am ready to interview you for the {role} role. Tell me about yourself."}), 200


@bp.route('/chat', methods=['POST'])
def chat_interview():
    """Continues the interview conversation."""
    data = request.get_json()
    message = data.get('message')
    history = data.get('history', [])
    lang = data.get('lang', 'en')
    
    if not message:
        return jsonify({'error': 'Message required'}), 400

    context = "You are a strict but fair technical interviewer. Assess the candidate's last answer and ask the next follow-up question. Keep responses under 3 sentences."
    full_prompt = f"{context}\n\nCandidate: {message}\nInterviewer:"
    
    try:
        response = llm.chat(full_prompt, lang=lang)
        return jsonify({'message': response})
    except Exception as e:
        logger.error(f"Interview chat failed: {e}")
        return jsonify({'message': "That's interesting. Let's move to the next topic."}), 200
