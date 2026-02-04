from flask import Blueprint, request, jsonify
from services import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from bson import ObjectId

bp = Blueprint('auth', __name__, url_prefix='/auth')
bcrypt = Bcrypt()

@bp.route('/register', methods=['POST'])
def register():
    payload = request.get_json()
    required = ['name', 'email', 'password', 'year', 'branch', 'target_role']
    
    if not all(k in payload for k in required):
        return jsonify({'error': 'missing fields'}), 400

    # check if user exists
    if db.users_coll.find_one({'email': payload['email']}):
        return jsonify({'error': 'email already exists'}), 400

    # hash password
    hashed_password = bcrypt.generate_password_hash(payload['password']).decode('utf-8')

    user = {
        'name': payload['name'],
        'email': payload['email'],
        'password': hashed_password,
        'year': payload['year'],
        'branch': payload['branch'],
        'target_role': payload['target_role'],
        'skills': payload.get('skills', [])
    }

    res = db.users_coll.insert_one(user)
    user['_id'] = str(res.inserted_id)
    del user['password'] # don't return password

    return jsonify(user), 201

@bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json()
    if not payload or 'email' not in payload or 'password' not in payload:
        return jsonify({'error': 'missing email or password'}), 400
    
    user = db.users_coll.find_one({'email': payload['email']})
    if not user:
        return jsonify({'error': 'invalid credentials'}), 401
    
    if not bcrypt.check_password_hash(user['password'], payload['password']):
        return jsonify({'error': 'invalid credentials'}), 401
    
    # generate token
    access_token = create_access_token(identity=str(user['_id']))
    
    user['_id'] = str(user['_id'])
    del user['password']

    return jsonify({
        'token': access_token,
        'user': user
    }), 200
