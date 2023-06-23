import os
import django
from kombu.common import QoS
from celery import Celery
from kombu import Queue,Exchange
from celery import bootsteps
from django.apps import apps


# Set the default Django settings module for the 'celery' program.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectservice.settings')
django.setup()
app = Celery('projectservice')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')


# Load task modules from all registered Django apps.
app.autodiscover_tasks()


class NoChannelGlobalQoS(bootsteps.StartStopStep):
    requires = {'celery.worker.consumer.tasks:Tasks'}

    def start(self, c):
        qos_global = False

        c.connection.default_channel.basic_qos(0, c.initial_prefetch_count, qos_global)
        def set_prefetch_count(prefetch_count):
            return c.task_consumer.qos(
                prefetch_count=prefetch_count,
                apply_global=qos_global,
            )
        c.qos = QoS(set_prefetch_count, c.initial_prefetch_count)

app.steps['consumer'].add(NoChannelGlobalQoS)


app.conf.task_queues = [
    Queue('check', Exchange(''), routing_key='check',
          queue_arguments={'x-queue-type': 'quorum'}),
    Queue('authtoproject', Exchange(''), routing_key='authtoproject',
          queue_arguments={'x-queue-type': 'quorum'}),
]

MyUser = apps.get_model('accounts', 'MyUser')

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print('heloooooooooooooooooo')


@app.task(bind=True,ignore_result=True)
def create_user(self,data):
    if data:
        print(data)
        print(data.get('is_staff'))
        user = MyUser.objects.create(email=data.get('email'),phone=data.get('phone'),username=data.get('username'),is_staff=data.get('is_staff'),is_active=data.get('is_active'))
        print(user)
