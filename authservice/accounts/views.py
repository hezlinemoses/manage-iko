import hashlib
import os
import base64
import jwt
import logging
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import MyUserSerializer
from kombu import producers,Connection
# from accounts.producer import BasicPublisher
# from datetime import datetime,timedelta
from authservice.celery import app as celery_app
# Create your views here.

access_key = os.environ.get('ACCESS_KEY')
refresh_key = os.environ.get('REFRESH_KEY')
# private_key = 'fsfs'
# public_key = 'dfs'
connection = Connection('amqp://test:test@rmq:5672//')


@api_view(['GET'])
def test_get(request):
    if request.method == "GET":
        print('test_gettttttttt')

        # print(request.COOKIES)
        # print(f"here is the cookie recieved {request.COOKIES.get('test')}")
        celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
        celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
        celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
        # with producers[connection].acquire(block=True) as producer:                        ##used with kombu to create a producers pool for connection. it will presist throughout the runtime
        #     producer.publish(body='hello from django',headers={'test':'test','task':'task'},routing_key='check',)

        jwt_cookie = request.COOKIES.get('jwt_access')
        if jwt_cookie:
            try:
                decoded = jwt.decode(jwt_cookie, access_key, algorithms=["HS256"])
                # print(f'decoded jwt-----{decoded}')
            except:
                # print('jwt invalid')
                pass

        
        encoded = jwt.encode({"some": "payload"}, access_key, algorithm="HS256")
        response = Response(data={'msg':'hello from server'},status=status.HTTP_200_OK)
        response.set_cookie('jwt_access',encoded,max_age=300,httponly=True,samesite='strict')
        return response
    
@api_view(['POST'])
def test_post(request):
    if request.method == 'POST':
        print('recieved a post req')
        print(request.COOKIES)
        return Response(data='retruned data from server after post',status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        print('post req recieved--reg')
        serializer = MyUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # celery_app.send_task(name='projectservice.celery.create_user',args=(serializer.data,),queue='authtoproject')       ##decided not to duplicate data. calls will be made from other services to access userdata
            # with producers[connection].acquire(block=True) as producer:                        ##used with kombu to create a producers pool for connection. it will presist throughout the runtime
            #     producer.publish(body={'task':'create_user','data':serializer.data},routing_key='authtomedia',)
            
            data ={'data':serializer.data}
            return Response(data=data,status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        print('post req recieved--login')
        logging.info(request.data)
        serializer = MyUserSerializer(data=request.data)
        if serializer.is_valid():
            print('its valid')
            res = {'datassss':'datassss'}
        else:
            print(serializer.errors)
            res = serializer.errors
        print(res)
        return Response(data=res,status=status.HTTP_200_OK)

@api_view(['POST'])
def logout(request):
    if request.method == 'POST':
        logging.INFO('post req recieved--login')
        logging.INFO(request.data)
        return Response(data='Done!!',status=status.HTTP_200_OK)



def generate_token_pairs(payload):
    return 10,12