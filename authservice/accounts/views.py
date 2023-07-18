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
from accounts.models import MyUser
# from kombu import producers,Connection
# from accounts.producer import BasicPublisher
# from datetime import datetime,timedelta
# from authservice.celery import app as celery_app
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
        #     producer.publish(body='hello from django',headers={'test':'test','task':'task'},routing_key='check',)S
        response = Response(data={'msg':'hello from server'},status=status.HTTP_200_OK)
        return response
    
@api_view(['POST'])
def test_post(request):
    if request.method == 'POST':
        return Response(data='retruned data from server after post',status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = MyUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
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
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = authenticate(email = email, password = password)
            # creating payload and generating tokens
            payload = {'user_id' : user.id,'is_staff': user.is_staff}
            access_token = jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_access)}, algorithm = "HS256", key= access_key)
            refresh_token = jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_refresh)}, algorithm= "HS256", key= refresh_key)
            response = Response(data={},status=status.HTTP_200_OK)
            response.set_cookie('jwt_access',access_token,max_age=max_age_access,httponly=True,samesite="Strict")
            response.set_cookie('jwt_refresh',refresh_token,max_age=max_age_refresh,httponly=True,samesite="Strict")
            response.set_cookie('username',user.username,max_age=max_age_access,httponly=True,samesite="Strict")
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


@api_view(['GET'])               ##must cache user
def get_user(request):
    '''validates jwt, generates access token and return user. for invalid jwt, user will be none.'''
    jwt_user = validate_jwt(request=request)
    print(f'jwt user : {jwt_user}')
    if jwt_user:
        payload = jwt_user.get('payload')
        user_id = payload.get('user_id')
        user = MyUser.objects.get(id=user_id)
        serialized = MinUserInfo(instance=user)
        res =  Response(data={'user':serialized.data},status=status.HTTP_200_OK)
        if jwt_user.get('access_token'):
            print('setting jwt cookie in auth service')
            res.set_cookie('jwt_access',jwt_user.get('access_token'),max_age=max_age_access,httponly=True,samesite="Strict")
            res.set_cookie('hello','world')
        return res
    else:
        return Response(data={'user':None},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def check_user_login(request):
    jwt_user = validate_jwt(request=request)
    if jwt_user:
        res = Response(data={},status=status.HTTP_200_OK)
        if(jwt_user.get('access_token')):
            # print(jwt_user.get('access_token'))

            res.set_cookie('jwt_access',jwt_user.get('access_token'),max_age=max_age_access,httponly=True,samesite="Strict")

        return res
    else:
        return Response(data={'user':None},status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def user_list(request):
    '''Returns a list of users with their id and username'''
    user_ids = request.GET.get(user_ids)
    users = MyUser.objects.in_bulk(user_ids)
    serializer = MinUserInfo(users.values(),many=True)
    return Response

def gen_token(payload,type):
    if type == 'access':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_access)}, algorithm = "HS256", key= access_key)
    elif type == 'refresh':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_refresh)}, algorithm= "HS256", key= refresh_key)
    
def validate_jwt(request):
    jwt_access = request.COOKIES.get('jwt_access')
    jwt_refresh = request.COOKIES.get('jwt_refresh')
    if jwt_access:
        try:
            payload = jwt.decode(jwt=jwt_access,key=access_key,algorithms="HS256")
            return {'access_token':None, 'payload':payload}
        except:
            try:
                payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
                # print(payload)
                access_token = gen_token(payload=payload,type='access')
                return {'access_token':access_token,'payload':payload}
                
            except:
                return None
    if jwt_refresh:
        try:
            payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
            
            access_token = gen_token(payload=payload,type='access')
            return {'access_token':access_token,'payload':payload}
        except:
            return None