from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url="/login")
@user_passes_test(lambda user: user.user_type=="admin", login_url="/login")
def index(request, *args, **kwargs):
  return render(request, 'index2.html')

def postman(request, *args, **kwargs):
  return render(request, 'postman.html')