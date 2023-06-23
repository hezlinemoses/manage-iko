from django.urls import path
from accounts.views import (
    test_get,
    test_post,
    login,
    register,
    logout,
    )

urlpatterns = [
    path('test_get/',test_get),
    path('test_post/',test_post),
    path('login/',login),
    path('logout/',logout),
    path('register/',register),
]