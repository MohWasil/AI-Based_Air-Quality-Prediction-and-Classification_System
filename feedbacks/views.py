from rest_framework import viewsets, permissions, response, status
from accounts import models as account_models
from .models import *
from .serializer import *

def stats(request, *args, **kwargs):
  if request.user.is_authenticated and request.user.user_type=='admin':
    individual_count = account_models.IndividualUser.objects.count()
    organizatoin_count = account_models.OrganizationalUser.objects.count()
    followers = Subscribers.objects.count()
    feedbacks = Contacts.objects.count()
    return response.Response({
      "individual_count": individual_count,
      "organizatoin_count": organizatoin_count,
      "followers": followers,
      "feedbacks": feedbacks,
    }, status=status.HTTP_200_OK)
    
  else:
    return response.Response({
      "error": "Access Denied"
    }, status=status.HTTP_400_BAD_REQUEST)
class SubscibersViewSet(viewsets.ModelViewSet):
  queryset = Subscribers.objects.all()
  serializer_class = SubscribersSerializer
  
  def get_permissions(self):
    if self.action != "create":
      return [permissions.IsAdminUser()]
    return []

class ContactsViewSet(viewsets.ModelViewSet):
  queryset = Contacts.objects.all()
  serializer_class = ContactsSerializer
  
  def get_permissions(self):
    if self.action != "create":
      return [permissions.IsAdminUser()]
    return []

class QuestionsViewSet(viewsets.ModelViewSet):
  queryset = Questions.objects.all()
  serializer_class = QuestionsSerializer

  def get_permissions(self):
    if self.action != "create":
      return [permissions.IsAdminUser()]
    return []
  
class OrganizationIdeaViewSet(viewsets.ModelViewSet):
  queryset = OrganizationIdea.objects.all()
  serializer_class = OrganizationIdeaSerializer

  def get_permissions(self):
    if self.action != "create":
      return [permissions.IsAdminUser()]
    return []
  
  
class IndividualIdeaViewSet(viewsets.ModelViewSet):
  queryset = IndividualIdea.objects.all()
  serializer_class = IndividualIdeaSerializer
  
  def get_permissions(self):
    if self.action != "create":
      return [permissions.IsAdminUser()]
    return []

