
import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database import init_db
from auth import auth_bp
#from predict_route import predict_bp, load_model_once
from doctor_route import doctor_bp
from medicine_route import med_bp
from states_route import stats_bp
import logging

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # load config from instance/config.py
    instance_cfg = os.path.join(app.instance_path, "config.py")
    if os.path.exists(instance_cfg):
        app.config.from_pyfile(instance_cfg)
    else:
        # fallback to environment variables
        app.config.from_mapping(
            SECRET_KEY=os.environ.get("SECRET_KEY", "devkey"),
            JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "jwt-secret"),
            SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL", "sqlite:///./idoctor.db"),
            # MODEL_PATH=os.environ.get("MODEL_PATH", ""),
            # DATASET_MEAN=[0.485, 0.456, 0.406],
            # DATASET_STD=[0.229, 0.224, 0.225],
            # IMAGE_SIZE=224
        )

    # register extensions
    JWTManager(app)
    CORS(app)
    init_db(app)

    # register blueprints
    app.register_blueprint(auth_bp)
    #app.register_blueprint(predict_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(med_bp)
    app.register_blueprint(stats_bp)

    # load model once
    # try:
    #     load_model_once(app)
    # except Exception as e:
    #     app.logger.error("Error loading model: " + str(e))

    # logging
    logging.basicConfig(level=logging.INFO)
    app.logger.info("App created")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5666, debug=False)
