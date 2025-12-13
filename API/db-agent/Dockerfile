FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 5666

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5666/health', timeout=5)" || exit 1

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5666", "--timeout", "120", "app:app"]
