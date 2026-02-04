from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.users import bp as users_bp
from api.syllabus import bp as syllabus_bp
from api.jobs import bp as jobs_bp
from api.analysis import bp as analysis_bp
from api.roadmap import bp as roadmap_bp
from api.explain import bp as explain_bp
from api.auth import bp as auth_bp
from api.generator import bp as generator_bp
from config import JWT_SECRET_KEY


def create_app():
    app = Flask(__name__)
    # Enable CORS for specific frontend origins
    CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}}, supports_credentials=True)
    app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
    jwt = JWTManager(app)

    # register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(syllabus_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(roadmap_bp)
    app.register_blueprint(explain_bp)
    app.register_blueprint(roadmap_bp)
    app.register_blueprint(explain_bp)
    app.register_blueprint(generator_bp)
    
    from api.interview import bp as interview_bp
    app.register_blueprint(interview_bp)

    @app.route('/health')
    def health():
        return jsonify({'status': 'ok'})

    return app

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
