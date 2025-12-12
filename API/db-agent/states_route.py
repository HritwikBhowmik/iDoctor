
from flask import Blueprint, request, jsonify
from models import Doctor, Medicine
from utils import admin_required

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    """Public endpoint - Get stats for a specific condition/disease"""
    condition = request.args.get('condition')
    if condition:
        # Get doctors who treat this condition
        doctors = Doctor.query.filter_by(cures_disease=condition).all()
        # Get medicines for this condition
        medicines = Medicine.query.filter_by(for_disease=condition).all()
        return jsonify({
            "condition": condition,
            "doctors_count": len(doctors),
            "medicines_count": len(medicines),
            "advice": f"We found {len(doctors)} specialist(s) and {len(medicines)} medicine(s) for {condition}."
        })
    else:
        # Return overall stats
        doctors_total = Doctor.query.count()
        medicines_total = Medicine.query.count()
        return jsonify({
            "doctors": doctors_total,
            "medicines": medicines_total,
        })

@stats_bp.route("/admin/stats", methods=["GET"])
@admin_required
def admin_stats():
    """Admin-only endpoint - Get admin statistics"""
    doctors = Doctor.query.count()
    medicines = Medicine.query.count()
    return jsonify({
        "doctors": doctors,
        "medicines": medicines,
    })
