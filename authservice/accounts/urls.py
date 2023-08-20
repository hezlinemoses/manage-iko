from django.urls import path
from accounts.views import (
    test_get,
    test_post,
    login,
    register,
    logout,
    check_user_login,
    get_user,
    user_list
    )

urlpatterns = [
    path('test_get/',test_get),
    path('test_post/',test_post),
    path('login/',login),
    path('logout/',logout),
    path('register/',register),
    path('checkloginstatus/',check_user_login),
    path('getcurrentuser/',get_user),
    path('userlist/',user_list),
]