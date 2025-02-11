from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *
router = DefaultRouter()

router.register('individual-ideas', IndividualIdeaViewSet, basename='individualidea')
router.register('organization-ideas', OrganizationIdeaViewSet, basename='organizationidea')
router.register('questions', QuestionsViewSet, basename='question')
router.register('contacts', ContactsViewSet, basename='contact')
router.register('subscibe', SubscibersViewSet, basename='subscribe')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', stats, name='stats')
    
]
