FROM python:3.10-slim

WORKDIR /app

# Create instance directory for database and config
RUN mkdir -p /app/instance

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Ensure proper permissions
RUN chmod -R 755 /app/instance

EXPOSE 5666

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5666", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]

