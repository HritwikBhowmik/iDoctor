
# iDoctor 

visit: https://hritwikbhowmik.github.io/iDoctor/

A comprehensive web-based healthcare platform that combines AI-powered disease diagnosis with intelligent doctor and medicine management. iDoctor leverages deep learning to provide preliminary disease identification and facilitates seamless healthcare administration.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

iDoctor is a full-stack healthcare management system designed to:
- **Diagnose diseases** using AI (specifically skin-related diseases using EfficientNet-B3)
- **Manage doctors** efficiently with role-based access
- **Organize medicines** in a centralized database
- **Track health statistics** and generate reports
- **Provide secure authentication** with JWT-based sessions

The platform uses a microservices architecture with separate services for AI predictions and database management, orchestrated via Docker for easy deployment.

---

## Features

### 🤖 AI-Powered Diagnosis
- Real-time disease classification from medical images
- Supports 6 disease categories: Chickenpox, Cowpox, HFMD, Measles, Monkeypox, and Healthy status
- Pre-trained EfficientNet-B3 model with 89.3% test accuracy
- Probability confidence score for each prediction

### 👨‍⚕️ Doctor Management
- Add, update, and remove doctor profiles
- Track doctor availability and specializations
- View doctor statistics and performance metrics
- Role-based admin dashboard

### 💊 Medicine Management
- Comprehensive medicine inventory system
- Track medicine stock and expiry dates
- Search and filter medications
- Manage medicine-doctor assignments

### 📊 Statistics & Reporting
- Track disease trends
- Monitor system health metrics
- Generate healthcare reports
- View diagnosis history

### 🔐 Security
- JWT-based authentication and authorization
- Role-based access control (Admin, Doctor, Patient)
- Secure password handling
- CORS protection

---

## Project Architecture

```
iDoctor (Microservices)
│
├── Frontend (Web Interface)
│   ├── Public Interface (Patient Portal)
│   └── Admin Dashboard (Management)
│
├── AI-Agent Service (Port 5665)
│   ├── Image Classification
│   └── Disease Prediction
│
├── Database-Agent Service (Port 5666)
│   ├── Authentication
│   ├── Doctor Management
│   ├── Medicine Management
│   └── Statistics Tracking
│
└── Nginx (Port 5667)
    └── Reverse Proxy & Load Balancing
```

---

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive styling with modern layouts
- **JavaScript (Vanilla)** - Interactive UI components
- **Bootstrap/Custom CSS** - UI framework

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework
- **Flask-JWT-Extended** - JWT authentication
- **Flask-SQLAlchemy** - ORM for database
- **Flask-CORS** - Cross-origin support

### Machine Learning
- **PyTorch** - Deep learning framework
- **EfficientNet-B3** - CNN architecture for classification
- **Torchvision** - Image preprocessing and transforms
- **Pillow** - Image processing

### Deployment & DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **Gunicorn** - WSGI application server

### Database
- **SQLite** - Lightweight database (development)
- **PostgreSQL** - Production database (configurable)

---

## Prerequisites

Before you begin, ensure you have:

- **Python 3.8 or higher**
- **Docker & Docker Compose** (for containerized deployment)
- **Git** (for version control)
- **CUDA toolkit** (optional, for GPU acceleration)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Verify Installation
```bash
python --version        # Should be 3.8+
docker --version        # Check Docker is installed
docker-compose --version # Check Docker Compose is installed
```

---

## Installation

### Option 1: Docker (Recommended)

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/idoctor.git
cd idoctor
```

**2. Build and start services**
```bash
cd API
docker-compose up --build
```

The services will be available at:
- **Frontend**: http://localhost:5667
- **AI-Agent API**: http://localhost:5665
- **Database API**: http://localhost:5666

**3. Access the application**
- Admin Dashboard: http://localhost:5667/admin
- Patient Portal: http://localhost:5667

---

### Option 2: Local Development Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/idoctor.git
cd idoctor
```

**2. Create Python virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**3. Install AI-Agent dependencies**
```bash
cd API/ai-agent
pip install -r requirements.txt
cd ../..
```

**4. Install Database-Agent dependencies**
```bash
cd API/db-agent
pip install -r requirements.txt
cd ../..
```

**5. Run services (in separate terminals)**

Terminal 1 - Start Database Agent:
```bash
cd API/db-agent
python app.py
```

Terminal 2 - Start AI Agent:
```bash
cd API/ai-agent
python app.py
```

Terminal 3 - Serve frontend (using Python HTTP server):
```bash
python -m http.server 8000 --directory public
```

Access the application at `http://localhost:8000`

---

## Usage

### For Patients

1. **Home Page**: Browse the platform and view available services
2. **Disease Diagnosis**: 
   - Navigate to diagnosis section
   - Upload an image of the affected area
   - Receive AI-powered preliminary diagnosis with confidence score
   - View recommended doctors

### For Administrators

1. **Admin Login**: Access http://localhost:5667/admin
2. **Dashboard**: View system statistics and health metrics
3. **Doctor Management**: 
   - Add new doctors with credentials
   - Update doctor information
   - Manage doctor specializations
4. **Medicine Management**:
   - Add medicines to inventory
   - Update stock levels
   - Track medicine-doctor assignments

---

## API Documentation

### AI-Agent Endpoints

#### Disease Prediction
```
POST /prediction
Content-Type: multipart/form-data

Parameters:
  file: [image file] (JPEG, PNG, supported formats)

Response:
{
  "prediction": "string (disease name)",
  "probability": "float (0-100)"
}

Example:
curl -X POST http://localhost:5665/prediction \
  -F "file=@skin_image.jpg"
```

### Database-Agent Endpoints

#### Authentication
```
POST /auth/login
{
  "username": "admin",
  "password": "password"
}

Response:
{
  "access_token": "jwt_token",
  "user_id": "integer"
}
```

#### Doctor Management
```
GET    /doctors                 # Get all doctors
POST   /doctors                 # Create new doctor
GET    /doctors/<id>            # Get doctor details
PUT    /doctors/<id>            # Update doctor
DELETE /doctors/<id>            # Delete doctor
```

#### Medicine Management
```
GET    /medicines               # Get all medicines
POST   /medicines               # Add new medicine
GET    /medicines/<id>          # Get medicine details
PUT    /medicines/<id>          # Update medicine
DELETE /medicines/<id>          # Delete medicine
```

#### Statistics
```
GET    /stats                   # Get system statistics
GET    /stats/diseases          # Disease distribution
GET    /stats/doctors           # Doctor statistics
```

---

## Project Structure

```
idoctor/
├── admin/                      # Admin dashboard
│   ├── dashboard.html
│   ├── doctor-management.html
│   ├── medicine-management.html
│   ├── login.html
│   ├── js/
│   │   ├── admin-login.js
│   │   ├── dashboard.js
│   │   ├── doctor-manage.js
│   │   └── medicine-manage.js
│   └── styles/
│       ├── admin.css
│       └── dashboard.css
│
├── public/                     # Patient portal
│   ├── index.html
│   ├── assets/
│   ├── js/
│   │   └── app.js
│   └── styles/
│       └── style.css
│
├── API/                        # Backend services
│   ├── docker-compose.yml      # Container orchestration
│   │
│   ├── ai-agent/               # AI diagnosis service
│   │   ├── app.py              # Flask application
│   │   ├── Model.py            # EfficientNet model definition
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── model_5(...).pth     # Pre-trained weights
│   │
│   ├── db-agent/               # Database management service
│   │   ├── app.py              # Flask application
│   │   ├── database.py         # Database initialization
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── auth.py             # Authentication logic
│   │   ├── doctor_route.py     # Doctor endpoints
│   │   ├── medicine_route.py   # Medicine endpoints
│   │   ├── states_route.py     # Statistics endpoints
│   │   ├── utils.py            # Helper functions
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── instance/
│   │       └── config.py       # Database configuration
│   │
│   └── nginx/                  # Web server configuration
│       └── iDoctor.conf        # Nginx reverse proxy config
│
├── jupyter-notebook/           # ML development notebooks
│   ├── doctorML.ipynb
│   └── doctorML-latest.ipynb
│
├── README.md                   # This file
└── LICENSE
```

---

## Development

### Setting Up for Development

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/idoctor.git
cd idoctor
```

2. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make changes and test locally**
```bash
# Test AI predictions
python API/ai-agent/app.py

# Test database operations
python API/db-agent/app.py
```

4. **Commit and push**
```bash
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

### Running Tests

```bash
# Run AI model tests
python -m pytest API/ai-agent/ -v

# Run database tests
python -m pytest API/db-agent/ -v
```

### Building ML Models

The Jupyter notebooks in `jupyter-notebook/` contain the model training pipeline:
```bash
jupyter notebook jupyter-notebook/doctorML-latest.ipynb
```

---

## Deployment

### Production Deployment with Docker

1. **Build images**
```bash
cd API
docker-compose build
```

2. **Run with environment variables**
```bash
docker-compose up -d \
  -e DATABASE_URL="postgresql://user:password@db:5432/idoctor" \
  -e JWT_SECRET_KEY="your-secure-secret-key" \
  -e SECRET_KEY="your-secret-key"
```

3. **View logs**
```bash
docker-compose logs -f
```

### Environment Variables

Create a `.env` file in the `API/` directory:
```env
DATABASE_URL=sqlite:///idoctor.db
JWT_SECRET_KEY=your-secure-jwt-secret
SECRET_KEY=your-app-secret-key
FLASK_ENV=production
```

### Scaling Services

To scale services:
```bash
docker-compose up -d --scale db-agent=3
```

---

## Configuration

### Database Configuration

Edit [API/db-agent/instance/config.py](API/db-agent/instance/config.py) for database settings:
```python
SQLALCHEMY_DATABASE_URI = 'sqlite:///./idoctor.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### Model Configuration

The AI model parameters in [API/ai-agent/app.py](API/ai-agent/app.py):
- **Architecture**: EfficientNet-B3
- **Classes**: 6 diseases
- **Input Size**: 224x224 pixels
- **Max Upload Size**: 5MB

---

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or disable conflicting services
lsof -i :5665  # Check process using port 5665
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify DATABASE_URL environment variable
echo $DATABASE_URL

# Reinitialize database
python API/db-agent/app.py  # Will auto-create tables
```

### CUDA Not Available
The system automatically falls back to CPU if CUDA is unavailable. For GPU support:
```bash
# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Model Loading Error
Ensure the model weights file exists:
```bash
ls -la API/ai-agent/model_effb3*
```

---

## Performance Metrics

### Model Performance
- **Training Accuracy**: 93.4%
- **Test Accuracy**: 89.3%
- **Architecture**: EfficientNet-B3
- **Inference Time**: ~200-500ms per image

---

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

## Contact & Support

- **Email**: hbhritwik420@gmail.com

---


<div align="center">

**Made with ❤️**

[⬆ back to top](#idoctor-)

</div>
