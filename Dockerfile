FROM python:3.11

LABEL authors="Michael"

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/
RUN python manage.py collectstatic --noinput
