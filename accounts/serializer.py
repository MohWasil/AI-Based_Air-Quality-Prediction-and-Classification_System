from rest_framework import serializers
from .models import IndividualUser, OrganizationalUser, CustomUser, AdminUser
from .validators import phone_validator, min_length_validator

class CustomUserSerializer(serializers.ModelSerializer):

  class Meta:
    model = CustomUser
    fields = ['email', 'password']
    extra_kwargs = {'password': {'write_only': True}}

class AdminUserSerializer(serializers.ModelSerializer):
  user = CustomUserSerializer()
  full_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  phone = serializers.CharField(max_length=15, validators=[phone_validator])
  username = serializers.CharField(max_length=255, validators=[min_length_validator])
    
  class Meta:
    model = IndividualUser
    fields = [
      'full_name',
      'phone',
      'gender',
      'username',
      'user'
    ]
    
  def create(self, validated_data):
    user = validated_data.pop('user')
    user = CustomUser.objects.create_superuser(
      email=user['email'],
      password=user['password'],
      user_type='admin'
    )
    user = AdminUser.objects.create(
      user=user,
      full_name=validated_data['full_name'],
      phone=validated_data['phone'],
      gender=validated_data['gender'],
      username=validated_data['username'],
    )
    return user

class IndividualUserSerializer(serializers.ModelSerializer):
  user = CustomUserSerializer()
  full_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  phone = serializers.CharField(max_length=15, validators=[phone_validator])
  country = serializers.CharField(max_length=100, validators=[min_length_validator])
  class Meta:
    model = IndividualUser
    fields = [
      'id',
      'full_name',
      'phone',
      'gender',
      'country',
      'user'
    ]
    extra_kwargs = {'id': {'read_only': True}}
    
  def create(self, validated_data):
    user = validated_data.pop('user')
    user = CustomUser.objects.create_user(
      email=user['email'],
      password=user['password'],
      user_type='individual'
    )
    user = IndividualUser.objects.create(
      user=user,
      full_name=validated_data['full_name'],
      phone=validated_data['phone'],
      gender=validated_data['gender'],
      country=validated_data['country'],
    )
    return user

  def update(self, instance, validated_data):
    user_data = validated_data.pop('user', None)
    if user_data:
        user_instance = instance.user
        for attr, value in user_data.items():
            setattr(user_instance, attr, value)
        user_instance.save()
    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    instance.save()
    return instance
  
class OrganizationalUserSerializer(serializers.ModelSerializer):
  user = CustomUserSerializer()
  organization_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  # responsible_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  phone = serializers.CharField(max_length=15, validators=[phone_validator])
  activity = serializers.CharField(max_length=255, validators=[min_length_validator])
  address = serializers.CharField(max_length=255, validators=[min_length_validator])
  country = serializers.CharField(max_length=100, validators=[min_length_validator])

  class Meta:
    model = OrganizationalUser
    fields = [
      'id',
      'organization_name',
      # 'responsible_name',
      'phone',
      'activity',
      'address',
      'country',
      'user',
    ]
    extra_kwargs = {'id': {'read_only': True}}
  
  def create(self, validated_data):
    user = validated_data.pop('user')
    user = CustomUser.objects.create_user(
      email=user['email'],
      password=user['password'],
      user_type='organization'
    )
    user = OrganizationalUser.objects.create(
      user=user,
      organization_name=validated_data['organization_name'],
      # responsible_name=validated_data['responsible_name'],
      phone=validated_data['phone'],
      activity=validated_data['activity'],
      address=validated_data['address'],
      country=validated_data['country'],
    )
    return user