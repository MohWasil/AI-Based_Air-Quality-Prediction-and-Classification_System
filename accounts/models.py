from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from .validators import phone_validator, min_length_validator

class CustomUserManager(BaseUserManager):
  def create_user(self, email, password=None, **extra_fields):
    if not email:
      raise ValueError("The Email field must be set")
    email = self.normalize_email(email)
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user
  
  def create_superuser(
    self,
    email,
    password,
    # full_name,
    # phone,
    # gender,
    # username,
    **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)

    if not extra_fields.get('is_staff'):
      raise ValueError('Supseruser must have is_staff=True.')
    
    if not extra_fields.get('is_superuser'):
      raise ValueError('Supseruser must have is_superuser=True.')
    
    # AdminUser.objects.create(
    #   full_name=full_name,
    #   phone=phone,
    #   gender=gender,
    #   username=username,
    # )
    
    return self.create_user(email,password, **extra_fields)
  

class CustomUser(AbstractBaseUser, PermissionsMixin):
  email = models.EmailField(unique=True)
  USER_TYPE_CHOICES = (
    ('individual', 'Individual'),
    ('organization', 'Organization'),
    ('admin', 'Admin'),
  )
  user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
  
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  objects = CustomUserManager()

  REQUIRED_FIELDS = []
  USERNAME_FIELD = 'email'
  def __str__(self) -> str:
    return self.email
  
  
class AdminUser(models.Model):
  GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
  ]
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
  full_name = models.CharField(max_length=255, validators=[min_length_validator])
  phone = models.CharField(max_length=15, validators=[phone_validator])
  gender = models.CharField(max_length=5, choices=GENDER_CHOICES)
  username = models.CharField(max_length=255, unique=True, validators=[min_length_validator])
    
class IndividualUser(models.Model):
  GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
  ]
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
  full_name = models.CharField(max_length=255, validators=[min_length_validator])
  phone = models.CharField(max_length=15, validators=[phone_validator])
  gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
  country = models.CharField(max_length=100, validators=[min_length_validator])

class OrganizationalUser(models.Model):
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
  organization_name = models.CharField(max_length=255, validators=[min_length_validator])
  # responsible_name = models.CharField(max_length=255, validators=[min_length_validator])
  phone = models.CharField(max_length=15, validators=[phone_validator])
  activity = models.CharField(max_length=255, validators=[min_length_validator])
  address = models.CharField(max_length=255, validators=[min_length_validator])
  country = models.CharField(max_length=100, validators=[min_length_validator])
