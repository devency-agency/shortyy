from flask import Blueprint, request, jsonify, redirect, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from urllib.parse import urlparse
from app.utils import (
    Validator,
    URL,
    Analytics,
)
from app.utils import setup_logging, add_admin
from config import RECAPTCHA_V3_SECRET
from app import limiter

bp = Blueprint('routes', __name__)
logger = setup_logging()

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/shorten', methods=['POST'])
@limiter.limit("50 per minute")
def shorten_url():
    data = request.get_json()
    url = data.get('url')
    expiry = data.get('expiry', None)
    captcha = data.get('captcha', '')

    if not url or not Validator.verify_recaptcha_v3(captcha, RECAPTCHA_V3_SECRET) or expiry is None:
        return jsonify({'error': 'Missing url, captcha or invalid expiry'}), 400

    if not Validator.is_url(url):
        return jsonify({'error': 'Invalid URL format'}), 400

    try:
        short_url = URL.generate_short_url(url, request.remote_addr, expiry)
        return jsonify({'short_url': short_url}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/report', methods=['GET'])
@limiter.limit("10 per minute")
def report():
    url = request.args.get('url')
    captcha_token = request.args.get('token')

    if not url or not Validator.verify_recaptcha_v3(captcha_token, RECAPTCHA_V3_SECRET):
        return jsonify({'error': 'Missing url or token'}), 400

    try:
        parsed_url = urlparse(url)
        short_url = parsed_url.path.lstrip('/')

        if not short_url:
            return jsonify({'error': 'Invalid URL format'}), 400

        row = URL.get_original_url(short_url)
        if row is None:
            return jsonify({'error': 'URL not found'}), 404

        if Analytics.report_url(row):
            return jsonify({"message": "Your report was successfully sent"}), 200

        return jsonify({"error": "Failed to report the URL"}), 500
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/<short_url>', methods=['GET'])
def redirect_url(short_url):
    try:
        row = URL.get_original_url(short_url)
        if row is None:
            return jsonify({'error': 'URL not found'}), 404

        if Analytics.count_url_views(short_url, request.remote_addr, request.user_agent.string):
            ##
        return redirect(row)
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500
