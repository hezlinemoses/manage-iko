FROM python:alpine

WORKDIR /usr/src/auth-service

COPY requirements.txt ./
# RUN apk update
RUN apk add git
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN ulimit -S -n 100000
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000"]