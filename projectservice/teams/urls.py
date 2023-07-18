from django.urls import path
from teams.views import (
list_user_teams,
create_team,
)
    

urlpatterns = [
    path("",list_user_teams),
    path("create/",create_team),
]
