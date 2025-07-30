from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.utils import (
    Admin
)
from app.utils import setup_logging

bp = Blueprint('admin', __name__)
logger = setup_logging()

def get_jwt_admin_identity(current_user):
    if not Admin.login(user=current_user, password=None, is_token=True):
        raise ValueError("Unauthorized!")
    
@bp.route('/admin/login', methods=['GET'])
def admin_ui_login():
    return render_template('admin_login.html')

@bp.route('/admin/dashboard', methods=['GET'])
def admin_cms():
    return render_template('admin.html')

@bp.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        user = data.get('user', None)
        password = data.get('passphrase', None)

        if not Admin.login(user, password):
            return jsonify({'error': 'Unauthorized'}), 401

        access_token = create_access_token(identity=user)
        return jsonify({'access_token': access_token}), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/admin/links', methods=['GET', 'DELETE'])
@jwt_required()
def admin_links():
    get_jwt_admin_identity(get_jwt_identity())
    if request.method == 'GET':
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=20, type=int)

        try:
            data = Admin.admin_get_links(page=page, per_page=per_page)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500
    
    elif request.method == 'DELETE':
        bulk = request.args.get('bulk', default=False, type=lambda v: v.lower() == 'true')

        if bulk:
            try:
                if Admin.admin_delete_all_links():
                    return jsonify({"message": "All URLs deleted successfully"}), 200
                else:
                    return jsonify({'error': 'Failed to delete all URLs'}), 500
            except Exception:
                return jsonify({'error': 'Internal server error'}), 500
        else:
            data = request.get_json()
            short_url = data.get('short_url')

            if not short_url:
                return jsonify({'error': 'Missing short URL'}), 400

            try:
                if Admin.admin_delete_link(short_url):
                    return jsonify({"message": "URL deleted successfully"}), 200
                else:
                    return jsonify({'error': 'URL not found'}), 404
            except Exception:
                return jsonify({'error': 'Internal server error'}), 500

@bp.route('/admin/link/<short_url>', methods=['GET'])
@jwt_required()
def admin_link_details(short_url):
    get_jwt_admin_identity(get_jwt_identity())
    try:
        data = Admin.admin_get_link_details(short_url=short_url)
        if data:
            return jsonify(data), 200
        else:
            return jsonify({'error': 'URL not found'}), 404
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/admin/reports', methods=['GET', 'DELETE'])
@jwt_required()
def admin_reports():
    get_jwt_admin_identity(get_jwt_identity())
    if request.method == 'GET':
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=20, type=int)

        try:
            data = Admin.admin_get_reports(page=page, per_page=per_page)
            return jsonify(data), 200
        except Exception:
            return jsonify({'error': 'Internal server error'}), 500
        
    elif request.method == 'DELETE':
        data = request.get_json()
        report_id = data.get('report_id')

        if not report_id:
            return jsonify({'error': 'Missing report ID'}), 400

        try:
            if Admin.admin_delete_report(report_id):
                return jsonify({"message": "Report deleted successfully"}), 200
            else:
                return jsonify({'error': 'Report not found'}), 404
        except Exception:
            return jsonify({'error': 'Internal server error'}), 500

@bp.route('/admin/reports/bulk', methods=['DELETE'])
@jwt_required()
def admin_reports_bulk_delete():
    get_jwt_admin_identity(get_jwt_identity())
    try:
        if Admin.admin_delete_all_reports():
            return jsonify({"message": "All reports deleted successfully"}), 200
        else:
            return jsonify({'error': 'Failed to delete all reports'}), 500
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500
