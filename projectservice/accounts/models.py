from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from accounts.managers import MyUserManager

# Create your models here.
class MyUser(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(
        db_index=True,
        max_length=255,
        null=False,
        blank=False,
        unique=True,
        error_messages={
            'unique':("A user with that email already exists"),
        },

    )
    username = models.CharField(
        unique=True,
        max_length=20,
        blank=False,
        null=False,
        error_messages={
            'unique':("A user with that username already exists")
        }
        )
    phone = models.CharField(
        max_length=10,
        null=False,
        blank=False,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_anonymous = False
    is_authenticated = True
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = MyUserManager()