from rest_framework import viewsets, views
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.http import Http404
from .models import IndividualUser, OrganizationalUser, CustomUser
from .serializer import *
from rest_framework import permissions, status
from rest_framework.response import Response


class IsIndividual(permissions.BasePermission):
  def has_permission(self, request, view):
    return request.user.user_type=="individual"
  def has_object_permission(self, request, view, obj):
    return self.has_permission(request, view)
  

class IsOrganization(permissions.BasePermission):
  def has_permission(self, request, view):
    return request.user.user_type=="organization"
  def has_object_permission(self, request, view, obj):
    return self.has_permission(request, view)

class IndividualUserViewSet(viewsets.ModelViewSet):
  queryset = IndividualUser.objects.all()
  serializer_class = IndividualUserSerializer

  def get_permissions(self):
    if self.action == 'create':
      return []
    elif self.action == "list":
      return [permissions.IsAdminUser()]
    else:
      return [permissions.IsAuthenticated(), IsIndividual()]

  def get_object(self):
    if self.kwargs.get("pk")=="id":
      return self.request.user.individualuser
    raise Http404("Page Not Found")
  
  def update(self, request, *args, **kwargs):
    kwargs['partial'] = False
    return super().update(request, *args, **kwargs)

  def partial_update(self, request, *args, **kwargs):
    """Handle PATCH requests properly"""
    instance = self.get_object()  # Get the correct user instance
    serializer = self.get_serializer(instance, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    self.perform_update(serializer)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def create(self, request, *args, **kwargs):
    data = request.data
    serializer = self.get_serializer(data=data)
    if serializer.is_valid():
      serializer.save()
      
      return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
      )

    else:
      return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
      )
  def perform_create(self, serializer):
    serializer.save()

class OrganizationalUserViewSet(viewsets.ModelViewSet):
  queryset = OrganizationalUser.objects.all()
  serializer_class = OrganizationalUserSerializer

  def get_permissions(self):
    if self.action == 'create':
      return []
    elif self.action == "list":
      return [permissions.IsAdminUser()]
    else:
      return [permissions.IsAuthenticated(), IsOrganization()]


  def get_object(self):
    if self.kwargs.get("pk")=="id":
      return self.request.user.organizationaluser
    raise Http404("Page Not Found")
  
  def create(self, request, *args, **kwargs):
    data = request.data
    serializer = self.get_serializer(data=data)
    if serializer.is_valid():
      # user = serializer.save()
      serializer.save()

      # user = authenticate(email=data['user']['email'], password=data['user']['password'])
      # if user is not None:
      #   login(request, user)
      return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
      )
      # else:
      #   return Response(
      #     {"error": "Credential Error"},
      #     status=status.HTTP_400_BAD_REQUEST
      #   )
    else:
      return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
      )
  def perform_create(self, serializer):
    serializer.save()

class AdminSignup(views.APIView):
  permission_classes = [permissions.IsAdminUser()]
  def post(self, request, *args, **kwargs):
    serializer = AdminUserSerializer(request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(
      serializer.errors,
      status=status.HTTP_400_BAD_REQUEST
    )

  def perform_create(self, serializer):
    serializer.save()

from django.http import HttpRequest

class LoginAPIView(views.APIView):
  permission_classes = [permissions.AllowAny]
  def post(self, request: HttpRequest, *args, **kwargs):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(request, email=email, password=password)
    
    if user is not None:
      login(request, user)
      return Response(
        {'message': 'Successfully logged in', 'user_type': user.user_type},
        
        status=status.HTTP_200_OK
      )
    else:
      return Response(
        {'error': 'Invalid Credentials'},
        status=status.HTTP_400_BAD_REQUEST
      )

class LogoutAPIView(views.APIView):
  permission_classes = []
  def get(self, request, *args, **kwargs):
    if request.user.is_authenticated:
      logout(request)
      # return Response(
      #   {'message': 'Successfully logged out'},
      #   status=status.HTTP_200_OK
      # )
    # return Response(
    #   {'message': 'You are already logged out'},
    #   status=status.HTTP_200_OK
    # )
    return redirect(to="/login")