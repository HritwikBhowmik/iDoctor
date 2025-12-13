# backend/instance/config.py
import os

# Secret keys
SECRET_KEY = "this_is_a_long_random_secret"
JWT_SECRET_KEY = "this_is_another_long_random_secret"

# Database (sqlite for simplicity). Use a real DB in production.
# Use absolute path so it works both locally and in Docker
db_path = os.path.join(os.path.dirname(__file__), "idoctor.db")
SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"

# Model file path (adjust to where you store the .pth)
MODEL_PATH = "/home/yourusername/your_project/model.pth"

# If you trained from scratch, set your dataset mean/std here as lists
# e.g. DATASET_MEAN = [0.56, 0.45, 0.38]
# If you trained with ImageNet normalization, set these to ImageNet values.
# DATASET_MEAN = [0.485, 0.456, 0.406]
# DATASET_STD = [0.229, 0.224, 0.225]

# # Prediction image size
# IMAGE_SIZE = 224

# # Max upload (bytes)
# MAX_CONTENT_LENGTH = 5 * 1024 * 1024
