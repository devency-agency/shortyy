from flask import Flask, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from app.database import init_db

# Initialize the limiter globally
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["2000 per day", "500 per hour"]
)

def create_app():
    app = Flask(__name__, static_folder='static')  # Explicitly set the static folder

    # Set a secret key for JWT
    app.config['JWT_SECRET_KEY'] = 'your_secret_key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 28800
    
    # Attach the limiter to the app
    limiter.init_app(app)

    # Initialize database
    init_db()

    # Initialize JWT
    jwt = JWTManager(app)

    # Register routes
    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    from app.admin import bp as admin_bp
    app.register_blueprint(admin_bp)

    return app