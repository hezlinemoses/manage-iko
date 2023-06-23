import logging
from celery import shared_task
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
@shared_task
def adding(x, y):
    print('hello')
@shared_task
def printname(name):
    print(name)