FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5665

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5665", "--timeout", "120", "--access-logfile", "-", "wsgi:application"]
