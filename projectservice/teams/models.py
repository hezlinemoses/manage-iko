from django.db import models
from django.core.validators import MinLengthValidator
# Create your models here.

class UserInfo(models.Model):
    user_id = models.PositiveBigIntegerField(unique=True,primary_key=True,error_messages={
            'unique':("User already exists!"),
        },)

    

class Team(models.Model):
    owner = models.ForeignKey(UserInfo,on_delete=models.CASCADE,related_name='team_owner')
    name = models.CharField(max_length=30,validators=[MinLengthValidator(6)])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner','name'],name='unique_owner_team')
        ]
    # members = models.ManyToManyField(UserInfo,related_name='teams')  ## need custom fields for inviting/reinviting so were using model TeamMember

## 
class TeamMember(models.Model):  ##for inviting/reinviting/kicking/ to kick just set is_active = False so user's contribution will not be deleted but user will not be able to access this team
    team = models.ForeignKey(Team,on_delete=models.CASCADE,related_name='team_member')
    user = models.ForeignKey(UserInfo,on_delete=models.CASCADE,related_name='team_member')
    is_invited = models.BooleanField(default=False) ## change to true on sending invitation
    invited_at = models.DateTimeField(blank=True,null=True)  ##invite link only valid for 72hrs/
    inv_acceptedd = models.BooleanField(default = False)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default = False) ## team admins
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['team', 'user'], name='unique_team_member')
        ]
