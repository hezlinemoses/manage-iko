import os
import django
import logging
from django.apps import apps
from kombu.common import QoS
from celery import Celery,app
from kombu import Queue,Exchange
from celery import bootsteps
from celery.worker.control import inspect_command,control_command
from celery import app
from projectservice.mail import send_team_invite
from sib_api_v3_sdk.rest import ApiException
from urllib3.exceptions import MaxRetryError
# Set the default Django settings module for the 'celery' program.
logging.basicConfig(level=logging.DEBUG)

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
        c.initial_prefetch_count = 5  ### this is usually num.of.cores*4. im using this to limit prefetch to 5
        c.connection.default_channel.basic_qos(0, c.initial_prefetch_count, qos_global)
        c.qos = QoS(c.task_consumer.qos, c.initial_prefetch_count) ## dont change first argument.
app.conf.update(task_acks_late=True) ## will send acknowledgment message after exicuting task.
app.steps['consumer'].add(NoChannelGlobalQoS)


app.conf.task_queues = [
    Queue('check', Exchange(''), routing_key='check',
          queue_arguments={'x-queue-type': 'quorum'}),
    Queue('authtoproject', Exchange(''), routing_key='authtoproject',
          queue_arguments={'x-queue-type': 'quorum'}),
]


##initializing models.
Team = apps.get_model(app_label='teams',model_name='Team')
TeamMember = apps.get_model(app_label='teams',model_name='TeamMember')
UserInfo = apps.get_model(app_label='teams',model_name='UserInfo')

@app.task(bind=True, ignore_result=True)
def send_invite_mail(self,username,email,team_mem_id,team_name):
    try:
        send_team_invite(username=username,email=email,team_mem_id=team_mem_id,team_name=team_name)
        team_member = TeamMember.objects.get(id=team_mem_id)
        team_member.is_invited=True
        team_member.save()
    except ApiException as e:
        logging.error("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
    except MaxRetryError as e:
        logging.error("Something wrong with connection!")
    

