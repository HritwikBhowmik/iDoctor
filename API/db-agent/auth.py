
from flask import Blueprint, request, jsonify, current_app
from models import Admin
from database import db
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint("auth", __name__, url_prefix="/admin")

@auth_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=admin.id, expires_delta=timedelta(hours=8))
    return jsonify({"token": access_token, "email": admin.email})

# Utility route to create initial admin (should be removed or protected in production)
@auth_bp.route("/create-admin", methods=["POST"])
def create_admin():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message":"email & password required"}), 400
    if Admin.query.filter_by(email=email).first():
        return jsonify({"message":"Admin already exists"}), 400
    admin = Admin(email=email)
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()
    return jsonify({"message":"admin created", "email": admin.email})
