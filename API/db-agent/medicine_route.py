
from flask import Blueprint, request, jsonify
from models import Medicine
from database import db
from utils import admin_required

med_bp = Blueprint("medicines", __name__, url_prefix="/medicines")

@med_bp.route("", methods=["GET"])
def list_meds():
    """Public endpoint - Get all medicines or filter by for_disease"""
    for_disease = request.args.get('for_disease')
    if for_disease:
        meds = Medicine.query.filter_by(for_disease=for_disease).all()
    else:
        meds = Medicine.query.all()
    return jsonify([{"id": m.id, "name": m.name, "for_disease": m.for_disease, "price": m.price} for m in meds])

@med_bp.route("", methods=["POST"])
@admin_required
def create_med():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return jsonify({"message":"name required"}), 400
    m = Medicine(name=name, for_disease=data.get("for_disease"), price=data.get("price"))
    db.session.add(m)
    db.session.commit()
    return jsonify({"message":"created", "id": m.id})

@med_bp.route("/<id>", methods=["PUT"])
@admin_required
def update_med(id):
    m = Medicine.query.get(id)
    if not m:
        return jsonify({"message":"not found"}), 404
    data = request.get_json() or {}
    m.name = data.get("name", m.name)
    m.for_disease = data.get("for_disease", m.for_disease)
    m.price = data.get("price", m.price)
    db.session.commit()
    return jsonify({"message":"updated"})

@med_bp.route("/<id>", methods=["DELETE"])
@admin_required
def delete_med(id):
    m = Medicine.query.get(id)
    if not m:
        return jsonify({"message":"not found"}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({"message":"deleted"})
