from rest_framework import serializers
from .models import IndividualUser, OrganizationalUser, CustomUser


class IndividualUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = IndividualUser
    fields = [
      'full_name',
      'phone',
      'gender',
      'country'
    ]
class OrganizationalUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrganizationalUser
    fields = [
      'organization_name',
      'responsible_name',
      'phone',
      'activity',
      'address',
      'country',
    ]


class CustomIndividualUserSerializer(serializers.ModelSerializer):
  individual_user = IndividualUserSerializer()
  
  class Meta:
    model = CustomUser
    fields = ['email', 'password', 'individual_user']
    extra_kwargs = {'password': {'write_only': True}}
  def create(self, validated_data):
    individual_user_data = validated_data.pop('individual_user')
    user = CustomUser.objects.create_user(
      email=validated_data['email'],
      password=validated_data['password'],
      user_type='individual'
    )
    IndividualUser.objects.create(
      user=user,
      full_name=individual_user_data['full_name'],
      phone=individual_user_data['phone'],
      gender=individual_user_data['gender'],
      country=individual_user_data['country'],
    )
    return user

class CustomOrganizationalUserSerializer(serializers.ModelSerializer):
  # organizational_user = OrganizationalUserSerializer()
  
  class Meta:
    model = CustomUser
    # fields = ['email', 'password']
    fields = '__all__'
    extra_kwargs = {'password': {'write_only': True}}
  def create(self, validated_data):
    organizational_user_data = validated_data.pop('organizational_user')
    user = CustomUser.objects.create_user(
      email=validated_data['email'],
      password=validated_data['password'],
      user_type='organization'
    )
    OrganizationalUser.objects.create(
      user=user,
      organization_name=organizational_user_data['organization_name'],
      responsible_name=organizational_user_data['responsible_name'],
      phone=organizational_user_data['phone'],
      activity=organizational_user_data['activity'],
      address=organizational_user_data['address'],
      country=organizational_user_data['country'],
    )
    return user