from django.db import models
from accounts.validators import phone_validator, min_length_validator

class Subscribers(models.Model):
  email = models.EmailField(unique=True)

class Contacts(models.Model):
  name = models.CharField(max_length=255, validators=[min_length_validator])
  email = models.EmailField()
  contact = models.CharField(max_length=15, validators=[min_length_validator])
  country = models.CharField(max_length=100, validators=[min_length_validator])
  subject = models.CharField(max_length=100, validators=[min_length_validator])
  message = models.TextField(max_length=2000,  validators=[min_length_validator])


class Questions(models.Model):
  name = models.CharField(max_length=255, validators=[min_length_validator])
  email = models.EmailField()
  phone = models.CharField(max_length=15, validators=[phone_validator])
  question = models.TextField(max_length=2000,  validators=[min_length_validator])

class OrganizationIdea(models.Model):
  organization_name = models.CharField(max_length=255, validators=[min_length_validator])
  responsible_person = models.CharField(max_length=255, validators=[min_length_validator])
  official_email = models.EmailField()
  premium_phone = models.CharField(max_length=15, validators=[phone_validator])
  alternative_phone = models.CharField(max_length=15, validators=[phone_validator])
  area_expertise = models.CharField(max_length=255, validators=[min_length_validator])
  country = models.CharField(max_length=100, validators=[min_length_validator])
  recommendation = models.TextField(max_length=2000, validators=[min_length_validator])

class IndividualIdea(models.Model):
  full_name = models.CharField(max_length=255, validators=[min_length_validator])
  email = models.EmailField()
  phone = models.CharField(max_length=15, validators=[phone_validator])
  expertise = models.CharField(max_length=255, validators=[min_length_validator])
  country = models.CharField(max_length=100, validators=[min_length_validator])
  idea = models.TextField(max_length=2000, validators=[min_length_validator])

