import os
from flask import Flask, jsonify, send_from_directory
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
    # Enable CORS - in production you should specify your Vercel URL
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
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
    app.register_blueprint(generator_bp)
    
    from api.interview import bp as interview_bp
    app.register_blueprint(interview_bp)

    # Point to the frontend build directory
    frontend_dist = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
    app.static_folder = frontend_dist
    app.static_url_path = '/'

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
