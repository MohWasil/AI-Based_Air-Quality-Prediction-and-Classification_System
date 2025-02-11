from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

def is_individual(user):
  return user.user_type=='individual' or user.user_type=='admin'

def is_organizatoin(user):
  return user.user_type=='organization' or user.user_type=='admin'


def index(request, *args, **kwargs):
  return render(request, 'index.html')

@user_passes_test(
  lambda user: not user.is_authenticated,
  login_url="/",
  redirect_field_name=None
)

def login_page(request, *args, **kwargs):
  return render(request, 'loginair.html')

@login_required(login_url='/login')
@user_passes_test(is_individual, login_url='/login')
def individual_use(request, *args, **kwargs):
  return render(request, 'predictionmore.html')

@login_required(login_url='/login')
@user_passes_test(is_organizatoin, login_url='/login')
def organization_use(request, *args, **kwargs):
  return render(request, 'predictionorg.html')

def individual_signup(request, *args, **kwargs):
  return render(request, 'indsignup.html')

def organization_signup(request, *args, **kwargs):
  return render(request, 'organizationform.html')

def about(request, *args, **kwargs):
  return render(request, 'about.html')

def environmental_pollution(request, *args, **kwargs):
  return render(request, 'EnvironmentalPollution.html')

def health_care_preservation(request, *args, **kwargs):
  return render(request, 'HealthcarePreservation.html')

def mp10(request, *args, **kwargs):
  return render(request, 'mp10.html')

def mp25(request, *args, **kwargs):
  return render(request, 'mp25.html')

def termandcondition(request, *args, **kwargs):
  return render(request, 'termandcondition.html')

def graph(request, *args, **kwargs):
  return render(request, 'graph.html')