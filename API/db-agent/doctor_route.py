
from flask import Blueprint, request, jsonify
from models import Doctor
from database import db
from utils import admin_required

doctor_bp = Blueprint("doctors", __name__, url_prefix="/doctors")

@doctor_bp.route("", methods=["GET"])
def list_doctors():
    """Public endpoint - Get all doctors or filter by cures_disease"""
    cures_disease = request.args.get('cures_disease')
    if cures_disease:
        doctors = Doctor.query.filter_by(cures_disease=cures_disease).all()
    else:
        doctors = Doctor.query.all()
    
    out = []
    for d in doctors:
        out.append({
            "id": d.id,
            "name": d.name,
            "specialty": d.specialty,
            "cures_disease": d.cures_disease,
            "location": d.location,
            "phone": d.phone,
            "email": d.email
        })
    return jsonify(out)

@doctor_bp.route("", methods=["POST"])
@admin_required
def create_doctor():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return jsonify({"message":"name required"}), 400
    doc = Doctor(name=name, specialty=data.get("specialty"), cures_disease=data.get("cures_disease"), 
                 location=data.get("location"), phone=data.get("phone"), email=data.get("email"))
    db.session.add(doc)
    db.session.commit()
    return jsonify({"message":"created", "id": doc.id})

@doctor_bp.route("/<id>", methods=["PUT"])
@admin_required
def update_doctor(id):
    doc = Doctor.query.get(id)
    if not doc:
        return jsonify({"message":"not found"}), 404
    data = request.get_json() or {}
    doc.name = data.get("name", doc.name)
    doc.specialty = data.get("specialty", doc.specialty)
    doc.cures_disease = data.get("cures_disease", doc.cures_disease)
    doc.location = data.get('location', doc.location)
    doc.phone = data.get("phone", doc.phone)
    doc.email = data.get("email", doc.email)
    db.session.commit()
    return jsonify({"message":"updated"})

@doctor_bp.route("/<id>", methods=["DELETE"])
@admin_required
def delete_doctor(id):
    doc = Doctor.query.get(id)
    if not doc:
        return jsonify({"message":"not found"}), 404
    db.session.delete(doc)
    db.session.commit()
    return jsonify({"message":"deleted"})
