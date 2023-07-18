import requests
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.


@api_view(["POST"])
def create_team(request):
    '''Create team and members if there is any(invite members)'''
    print('inside create')
    r = requests.get("http://auth-service:8000/accounts/getcurrentuser",cookies=request.COOKIES)
    r_data = r.json()
    print(r_data)
    if r_data.get('user'):
        print(r_data.get('user'))
        res = Response(data={'data goes here'},status=status.HTTP_201_CREATED)
        if r.headers.get('Set-Cookie'):
            res["set-cookie"]=r.headers.get('Set-Cookie')
        return res
    # print(data)
    return Response(status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(["GET"])
def list_user_teams(request):
    '''View to retrive the list of teams a user is a member/owner'''
    r = requests.get("http://auth-service:8000/accounts/getcurrentuser",cookies=request.COOKIES)
    print(r.content)
    res = Response(data={},status=status.HTTP_200_OK)
    if r.headers.get('Set-Cookie'):
        res["set-cookie"]=r.headers.get('Set-Cookie')
    return res

