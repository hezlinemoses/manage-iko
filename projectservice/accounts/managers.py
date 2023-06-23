from django.contrib.auth.base_user import BaseUserManager


class MyUserManager(BaseUserManager):
    def create_user(self,username,email,phone,*args,**kwargs):
        email = self.normalize_email(email)
        user = self.model(username= username,email = email,phone=phone,**kwargs)
        user.save()
        return user