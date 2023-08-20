import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from teams.serializers import TeamMemberSerializer, TeamSerializer
from teams.models import UserInfo,Team,TeamMember
from projectservice.celery import app as celery_app
# Create your views here.

auth_base_url = "http://auth-service:8000"

def forwarded_headers(reqheaders):
    return {
        'X-Jwt-Access':reqheaders.get('X-Jwt-Access'),
        'X-Jwt-Refresh':reqheaders.get('X-Jwt-Refresh')
        }

def add_auth_headers(auth_res_header,res_to_return):
    jwt_in_header = auth_res_header.get('set-jwt-access')
    if jwt_in_header:
        res_to_return["set-jwt-access"] = jwt_in_header
    return res_to_return

@api_view(["POST"])
def create_team(request):
    '''Create team and members if there is any(invite members)''' 
    user_ids =  request.data.get('user_ids')
    if user_ids:
        auth_req = requests.get(
        auth_base_url + f'/accounts/userlist/?user_ids={user_ids}',
        headers=forwarded_headers(reqheaders=request.headers)
        )
    else:
        auth_req = requests.get(
        auth_base_url+ f"/accounts/getcurrentuser/",
        headers= forwarded_headers(reqheaders=request.headers)
        )
    if auth_req.status_code == 401 or auth_req.status_code == 403:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    data = auth_req.json()
    current_user = data.get('current_user') ##from auth service
    members = data.get('members')   ##from auth service
    owner,_ = UserInfo.objects.get_or_create(user_id=current_user.get('id'))

    if Team.objects.filter(owner=owner,name=request.data.get('name')).exists():
        res = Response(data={'error':'A team with same name already exists'},status=status.HTTP_400_BAD_REQUEST)
        res = add_auth_headers(auth_res_header=auth_req,res_to_return=res)
        return res ## error instant return
    
    team_serializer = TeamSerializer(data={'name':request.data.get('name'),'owner':owner.user_id})
    if team_serializer.is_valid():
        team = team_serializer.save()
        if members:
            for member in members:
                team = Team.objects.get(id=team.id)
                user,_ = UserInfo.objects.get_or_create(user_id=member.get('id'))
                team_member = TeamMember.objects.create(team=team,user=user)
                try:
                    celery_app.send_task(name='projectservice.celery.send_invite_mail',queue='check',args=(member.get('username'),member.get('email'),team_member.id,team.name))
                    team_member.is_invited = True
                    team_member.save()
                    ## res will be returned at the end of code
                except:
                    pass # not handling errors
                    # res = Response(data={'message':'Please re-invite members'},status=status.HTTP_200_OK)
                    # res = add_auth_headers(auth_res_header=auth_req,res_to_return=res)
                    # return res ## error instan
        res = Response(data={},status=status.HTTP_201_CREATED)
    else:
        res =  Response(data=team_serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    res = add_auth_headers(auth_res_header=auth_req.headers,res_to_return=res)
    return res
    
    
    
    
@api_view(["GET"])
def list_user_teams(request):
    '''View to retrive the list of teams a user is a member/owner'''
    # r = requests.get("http://auth-service:8000/accounts/getcurrentuser",cookies=request.COOKIES) /// we will get current user and data from single endpoint.
    r = requests.get()
    print(r.content)
    res = Response(data={},status=status.HTTP_200_OK)
    if r.headers.get('Set-Cookie'):
        res["set-cookie"]=r.headers.get('Set-Cookie')
    return res

@api_view(["GET"])
def check_invite_link(request):
    get_current_user = requests.get(
        auth_base_url+ f"/accounts/getcurrentuser/",
        headers= forwarded_headers(reqheaders=request.headers)
        )
    if get_current_user.status_code == 401 or get_current_user.status_code == 403:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    data = get_current_user.json()
    current_user = data.get('current_user')
    team_member_id = request.GET.get('team_member_id')
    team_member = TeamMember.objects.get(id=team_member_id)
    if team_member.user.user_id != current_user.get('id') or team_member.is_invited == False or team_member.is_active == True:
        res = Response(data={},status=status.HTTP_400_BAD_REQUEST)
    else:
        res =  Response(data={},status=status.HTTP_200_OK)
    res = add_auth_headers(auth_res_header=get_current_user.headers,res_to_return=res)
    return res

@api_view(["POST"])
def inv_accept_reject(request):
    get_current_user = requests.get(auth_base_url+ f"/accounts/getcurrentuser/",headers=forwarded_headers(reqheaders=request.headers))
    if get_current_user.status_code == 401 or get_current_user.status_code == 403:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    data = get_current_user.json()
    current_user = data.get('current_user')
    team_mem_id = request.data.get("team_mem_id")
    action = request.data.get("action")
    team_member = TeamMember.objects.get(id=team_mem_id)
    if team_member.user.user_id != current_user.get('id') or team_member.is_invited == False:
        res = Response(data={},status=status.HTTP_400_BAD_REQUEST)
        res = add_auth_headers(auth_res_header=get_current_user.headers,res_to_return=res)
        return res
    if action == "accept":
        team_member.is_active = True
        team_member.save()
        res = Response(data={'team_id':team_member.team.id},status=status.HTTP_200_OK)
    elif action == "reject":
        team_member.is_invited = False
        team_member.save()
        res = Response(data={},status=status.HTTP_200_OK)
    else:
        res = Response(data={},status=status.HTTP_400_BAD_REQUEST)

    res = add_auth_headers(auth_res_header=get_current_user.headers,res_to_return=res)
    return res

@api_view(["GET"])
def team_list_view(request):
    ## return team list of current user, owned and is currently a member of
    get_current_user = requests.get(auth_base_url+ f"/accounts/getcurrentuser/",headers=forwarded_headers(reqheaders=request.headers))
    if get_current_user.status_code == 401 or get_current_user.status_code == 403:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    auth_data = get_current_user.json()
    current_user = auth_data.get('current_user')
    user = UserInfo.objects.get(user_id=current_user.get('id'))
    owned_teams = user.team_owner.all()
    joined_teams = user.team_member.filter(is_active=True)
    serialized_owned_teams = TeamSerializer(instance=owned_teams,many=True)
    serialized_joined_teams = TeamMemberSerializer(instance=joined_teams,many=True)
    res = Response(data={'owned_teams':serialized_owned_teams.data,'joined_teams':serialized_joined_teams.data},status=status.HTTP_200_OK)
    res = add_auth_headers(auth_res_header=get_current_user.headers,res_to_return=res)
    return res
    pass
