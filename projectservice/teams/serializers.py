from rest_framework import serializers
from teams.models import Team,TeamMember,UserInfo
from django.apps import apps
from rest_framework.validators import UniqueTogetherValidator

class TeamSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=UserInfo.objects.all(),write_only=True)
    class Meta:
        model = Team
        fields = ["id","name","owner"]
        # validators = [
        #     UniqueTogetherValidator(
        #         queryset=Team.objects.all(),
        #         fields=["name","owner"],
        #         )
        # ]
    
    def validate(self, attrs):
        owner = attrs.get("owner")
        if owner.team_owner.filter(name = attrs.get("name")).exists():
            raise serializers.ValidationError({"name":"A team already exists with this name for this user."})
        return attrs



class TeamMemberSerializer(serializers.ModelSerializer):
    team = TeamSerializer()
    class Meta:
        model = TeamMember
        fields =['team','user']

class TMSUser(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["user"]
    
