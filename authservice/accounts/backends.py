from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from accounts.models import MyUser
from django.core.exceptions import ValidationError


class MyAuth(BaseBackend):

    def authenticate(self,request=None,email=None,password=None):
        if not email or not password:
            return None
        try:
            user = MyUser.objects.get(email=email)

            if check_password(password=password,encoded=user.password):
                return user
            else:
                raise ValidationError ('Invalid credentials')

        except :
            raise ValidationError('Invalid credentials')
        