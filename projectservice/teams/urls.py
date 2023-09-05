from django.urls import path
from teams.views import (
team_list_view,
create_team,
check_invite_link,
inv_accept_reject,
team_detail_view,

)
    

urlpatterns = [
    path("team_list/",team_list_view),
    path("create/",create_team),
    path("check_invite_link/",check_invite_link),
    path("inv_accept_reject/",inv_accept_reject),
    path("<id>/",team_detail_view),
    
]
