FROM python:alpine

WORKDIR /usr/src/projectservice

COPY requirements.txt ./
RUN apk add git
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "celery", "-A", "projectservice.celery", "worker", "-Q", "check", "-l", "INFO"]