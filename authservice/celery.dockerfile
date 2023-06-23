FROM python:alpine

WORKDIR /usr/src/auth-service

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "celery", "-A", "authservice.celery", "worker", "-Q", "check", "-l", "INFO"]