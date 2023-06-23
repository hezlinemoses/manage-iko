# import pika
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'authservice.settings')
django.setup()
# class BasicPublisher():
#     credentials = pika.PlainCredentials('test', 'test')
#     parameters = pika.ConnectionParameters(host='rmq',credentials=credentials,port=5672,heartbeat=60)
#     def __init__(self) -> None:
#         self._connection = None
#         self._channel = None
#         self.connect()
#         self.open_channel()
    
#     def connect(self):
#         self._connection = pika.BlockingConnection(parameters=self.parameters)

#     def open_channel(self):
#         self._channel = self._connection.channel()
    
#     def publish(self,queue,exchange,body,routing_key):
#         if self._connection.is_closed:
#             print('aloooooooooooooooooooooo')
#         elif self._connection.is_open:
#             print('hiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
#         if self._connection == None or self._connection.is_closed:
#             self.connect()
#         if self._channel == None or self._channel.is_closed:
#             self.open_channel()
#         if self._connection.is_open and self._channel.is_open:
#             self._channel.queue_declare(queue=queue,arguments={'x-queue-type':'quorum'},durable=True)
#             self._channel.basic_publish(exchange=exchange,
#                         routing_key=routing_key,
#                         body=body)
from kombu import connections,Connection

connections[Connection()]

