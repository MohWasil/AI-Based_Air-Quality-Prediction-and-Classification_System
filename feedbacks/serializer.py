from rest_framework import serializers
from .models import Contacts, IndividualIdea, OrganizationIdea, Questions, Subscribers
from accounts.validators import phone_validator, min_length_validator

class QuestionsSerializer(serializers.ModelSerializer):
  name = serializers.CharField(max_length=255, validators=[min_length_validator])
  phone = serializers.CharField(max_length=15, validators=[phone_validator])
  
  class Meta:
    model = Questions
    fields = '__all__'

class SubscribersSerializer(serializers.ModelSerializer):
  class Meta:
    model = Subscribers
    fields = '__all__'

class ContactsSerializer(serializers.ModelSerializer):
  name = serializers.CharField(max_length=255, validators=[min_length_validator])
  contact = serializers.CharField(max_length=15, validators=[min_length_validator])
  country = serializers.CharField(max_length=100, validators=[min_length_validator])
  subject = serializers.CharField(max_length=100, validators=[min_length_validator])

  class Meta:
    model = Contacts
    fields = '__all__'
  
class IndividualIdeaSerializer(serializers.ModelSerializer):
  full_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  phone = serializers.CharField(max_length=15, validators=[phone_validator])
  expertise = serializers.CharField(max_length=255, validators=[min_length_validator])
  country = serializers.CharField(max_length=100, validators=[min_length_validator])
  
  class Meta:
    model = IndividualIdea
    fields = '__all__'
  
class OrganizationIdeaSerializer(serializers.ModelSerializer):
  organization_name = serializers.CharField(max_length=255, validators=[min_length_validator])
  responsible_person = serializers.CharField(max_length=255, validators=[min_length_validator])
  premium_phone = serializers.CharField(max_length=15, validators=[phone_validator])
  alternative_phone = serializers.CharField(max_length=15, validators=[phone_validator])
  area_expertise = serializers.CharField(max_length=255, validators=[min_length_validator])
  country = serializers.CharField(max_length=100, validators=[min_length_validator])
  
  class Meta:
    model = OrganizationIdea
    fields = '__all__'
  
