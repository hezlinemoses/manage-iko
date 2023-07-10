import os
import jwt
import logging
import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import MyUserSerializer,MinUserInfo
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from accounts.mail import sendmail
from accounts.models import MyUser
# from kombu import producers,Connection
# from accounts.producer import BasicPublisher
# from datetime import datetime,timedelta
from authservice.celery import app as celery_app
# Create your views here.

access_key = os.environ.get('ACCESS_KEY')
refresh_key = os.environ.get('REFRESH_KEY')
max_age_access = 300   ## time in seconds
max_age_refresh = 600
# private_key = 'fsfs'
# public_key = 'dfs'
# connection = Connection('amqp://test:test@rmq:5672//') ////used with kombu

logging.basicConfig(level=logging.DEBUG)

@api_view(['GET'])
def test_get(request):
    if request.method == "GET":
        print('test_gettttttttt')
        # celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
        # celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
        # celery_app.send_task(name='projectservice.celery.debug_task',queue='check') 
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
            user = serializer.save()
            print(user.id)
            # celery_app.send_task(name='projectservice.celery.create_user',args=(serializer.data,),queue='authtoproject')       ##decided not to duplicate data. calls will be made from other services to access userdata
            # with producers[connection].acquire(block=True) as producer:                        ##used with kombu to create a producers pool for connection. it will presist throughout the runtime
            #     producer.publish(body={'task':'create_user','data':serializer.data},routing_key='authtomedia',)
            res = Response(data={},status=status.HTTP_201_CREATED)
            access_token = gen_token(payload={'user_id': user.id, 'is_staff':user.is_staff},type='access')
            refresh_token = gen_token(payload={'user_id': user.id, 'is_staff':user.is_staff},type='refresh')
            res.set_cookie("jwt_access",access_token,max_age=max_age_access,httponly=True,samesite="Strict")
            res.set_cookie("jwt_refresh",refresh_token,max_age=max_age_refresh,httponly=True,samesite="Strict")
            return res
        else:
            return Response(data={'errors':serializer.errors},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        print('post req recieved--login')
        print(request.COOKIES)
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = authenticate(email = email, password = password)
            # creating payload and generating tokens
            payload = {'user_id' : user.id,'is_staff': user.is_staff}
            access_token = jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(minutes=5)}, algorithm = "HS256", key= access_key)
            refresh_token = jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(minutes=10)}, algorithm= "HS256", key= refresh_key)
            response = Response(data={},status=status.HTTP_200_OK)
            response.set_cookie('jwt_access',access_token,max_age=max_age_access,httponly=True,samesite="Strict")
            response.set_cookie('jwt_refresh',refresh_token,max_age=max_age_refresh,httponly=True,samesite="Strict")
            return response
            # return response
        except ValidationError as error:
            logging.info(error.message)
            return Response(data={'error' : error.message},status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def logout(request):
    if request.method == 'POST':
        logging.INFO('post req recieved--login')
        logging.INFO(request.data)
        return Response(data='Done!!',status=status.HTTP_200_OK)


@api_view(['POST'])               ##must cache user
def get_user(request):
    jwt_access = request.COOKIES.get('jwt_access')
    jwt_refresh = request.COOKIES.get('jwt_refresh')
    if jwt_access:
        try:
            payload = jwt.decode(jwt=jwt_access,key=access_key,algorithms="HS256")
            user_id = payload.get('user_id')
            user = MyUser.objects.get(id=user_id)
            serialized = MinUserInfo(instance=user)
            return Response(data={'user':serialized.data},status=status.HTTP_200_OK)
        except:
            ## check if refresh token is valid
            try:
                payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
                user_id = payload.get('user_id')
                user = MyUser.objects.get(id=user_id)
                serialized = MinUserInfo(instance=user)
                res = Response(data={'user':serialized.data},status=status.HTTP_200_OK)
                access_token = gen_token(payload={'user_id':user.id,'is_staff':user.is_staff},type='access')
                ## setcookie
                res.set_cookie("jwt_access",access_token,max_age=max_age_access,httponly=True,samesite="Strict")
                return res
            except:
                return Response(data={'user':None},status=status.HTTP_403_FORBIDDEN)
    if jwt_refresh:
        # generate access token and return it as a cookie
        try:
            payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
            user_id = payload.get('user_id')
            user = MyUser.objects.get(id=user_id)
            serialized = MinUserInfo(instance=user)
            res = Response(data={'user':serialized.data},status=status.HTTP_200_OK)
            access_token = gen_token(payload={'user_id':user.id,'is_staff':user.is_staff},type='access')
            ## setcookie
            res.set_cookie("jwt_access",access_token,max_age=max_age_access,httponly=True,samesite="Strict")
            return res
        except:
            return Response(data={'user':None},status=status.HTTP_403_FORBIDDEN)
    
    ## if nothing is present return 403 unauthorized and make them login
    return Response(data={'user':None},status=status.HTTP_403_FORBIDDEN)

def gen_token(payload,type):
    if type == 'access':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_access)}, algorithm = "HS256", key= access_key)
    elif type == 'refresh':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_refresh)}, algorithm= "HS256", key= refresh_key)