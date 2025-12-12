
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

def gen_id():
    return str(uuid.uuid4())

class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Doctor(db.Model):
    __tablename__ = "doctors"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    name = db.Column(db.String(255), nullable=False)
    specialty = db.Column(db.String(255), nullable=True)
    cures_disease = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(255), nullable=True)

class Medicine(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    name = db.Column(db.String(255), nullable=False)
    for_disease = db.Column(db.Text, nullable=True)
    price = db.Column(db.Integer, nullable=True)

