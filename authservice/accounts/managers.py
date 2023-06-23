from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password

class MyUserManager(BaseUserManager):
    def create_user(self,username,email,password,phone,*args,**kwargs):
        email = self.normalize_email(email)
        user = self.model(username= username,email = email,phone=phone,**kwargs)
        password = make_password(password)
        user.password=password
        user.save()
        return user