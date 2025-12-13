FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 5666

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5666", "--timeout", "120", "--access-logfile", "-", "wsgi:application"]
