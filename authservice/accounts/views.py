import base64
import os
import jwt
import logging
import datetime
import json
import urllib.parse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import MyUserSerializer,MinUserInfo, UserInfoEmail
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
            access_token = gen_token(payload={'user_id': user.id, 'is_staff':user.is_staff},type='access')
            refresh_token = gen_token(payload={'user_id': user.id, 'is_staff':user.is_staff},type='refresh')
            res = Response(
                data={},
                status=status.HTTP_201_CREATED,
                headers={'set-jwt-access':access_token,'set-jwt-refresh':refresh_token,'set-user':json.dumps({'id':user.id,'username':user.username})}
                )
            
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
            response = Response(
                data = {},
                status=status.HTTP_200_OK,
                headers={'set-jwt-access':access_token,'set-jwt-refresh':refresh_token,'set-user':json.dumps({'id':user.id,'username':user.username})}
            )
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
    jwt_validated = validate_jwt(request=request)
    if jwt_validated:
        current_user = jwt_validated.get('current_user')
        res =  Response(data={'current_user':current_user},status=status.HTTP_200_OK)
        if jwt_validated.get('access_token'):
            print('setting headers')
            res["set-jwt-access"] = jwt_validated.get('access_token')
        return res
    else:
        return Response(data={'user':None},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def check_user_login(request):
    jwt_validated = validate_jwt(request=request)
    if jwt_validated:
        res = Response(data={},status=status.HTTP_200_OK)
        if(jwt_validated.get('access_token')):
            # print(jwt_validated.get('access_token'))

            res["set-jwt-access"] = jwt_validated.get('access_token')

        return res
    else:
        return Response(data={'user':None},status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def user_list(request):
    '''Returns a list of users with their id and username'''
    #check jwt
    jwt_validated = validate_jwt(request=request)
    if jwt_validated:
        ##get current user and return it too
        current_user = jwt_validated.get('current_user')
        user_ids : str = request.GET.get('user_ids')
        print(user_ids,'000000000000')
        if user_ids:  ## this is when project service, team invite(requires email)
            str_array = user_ids.split(',')
            int_array = [int(item) for item in str_array]
            users = MyUser.objects.in_bulk(int_array)
            users_values = list(users.values())
            serialized_users = UserInfoEmail(instance=users_values,many=True)
            res = Response(data={"current_user":current_user,"members":serialized_users.data})
            if jwt_validated.get("access_token"):
                res["set-jwt-access"] = jwt_validated.get('access_token')
            return res
        ## this is for when frontend searches a user
        search_q = request.GET.get('search',"")
        users = MyUser.objects.filter(username__icontains=search_q)
        serialized = MinUserInfo(instance=users,many=True)
        res = Response(data={"current_user":current_user,'users':serialized.data},status=status.HTTP_200_OK)
        if jwt_validated.get("access_token"):
            res['set-jwt-access'] = jwt_validated.get("access_token")
        return res
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

def gen_token(payload,type):
    if type == 'access':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_access)}, algorithm = "HS256", key= access_key)
    elif type == 'refresh':
        return jwt.encode(payload={**payload, 'exp':datetime.datetime.now() + datetime.timedelta(seconds=max_age_refresh)}, algorithm= "HS256", key= refresh_key)
    
def validate_jwt(request):
    jwt_access = request.headers.get('X-Jwt-Access')
    jwt_refresh = request.headers.get('X-Jwt-Refresh')
    if jwt_access:
        try:
            payload = jwt.decode(jwt=jwt_access,key=access_key,algorithms="HS256")
            current_user = MyUser.objects.get(id=payload.get("user_id"))
            current_user_serialized = MinUserInfo(instance=current_user)
            return {'access_token':None, 'current_user':current_user_serialized.data}
        except:
            try:
                payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
                current_user = MyUser.objects.get(id=payload.get("user_id"))
                current_user_serialized = MinUserInfo(instance=current_user)
                access_token = gen_token(payload=payload,type='access')
                return {'access_token':access_token,'current_user':current_user_serialized.data}
                
            except:
                return None
    if jwt_refresh:
        try:
            payload = jwt.decode(jwt=jwt_refresh,key=refresh_key,algorithms="HS256")
            current_user = MyUser.objects.get(id=payload.get("user_id"))
            current_user_serialized = MinUserInfo(instance=current_user)
            access_token = gen_token(payload=payload,type='access')
            return {'access_token':access_token,'current_user':current_user_serialized.data}
        except:
            return None
