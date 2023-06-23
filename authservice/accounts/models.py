from django.db import models
from django.core.validators import MinLengthValidator,ProhibitNullCharactersValidator,MaxLengthValidator,RegexValidator
from django.contrib.auth.validators import ASCIIUsernameValidator
from accounts.managers import MyUserManager

# Create your models here.

username_validator = ASCIIUsernameValidator()

class MyUser(models.Model):
    
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
        validators=[MinLengthValidator(5),ProhibitNullCharactersValidator,username_validator],
        error_messages={
            'unique':("A user with that username already exists")
        }
        )
    password = models.CharField(
        max_length=128,
        blank=False,
        null = False,
        validators=[MinLengthValidator(8)],
        )
    phone = models.CharField(
        max_length=10,
        null=False,
        blank=False,
        unique=True,
        validators=[MaxLengthValidator(10),MinLengthValidator(10),ProhibitNullCharactersValidator,RegexValidator(regex=r'^[0-9]+$',message='Enter a valid phone number',code='invalid_phone_number')]
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_anonymous = False
    is_authenticated = True
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = MyUserManager()
