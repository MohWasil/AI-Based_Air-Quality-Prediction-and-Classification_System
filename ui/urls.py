from django.urls import path
from .views import *
urlpatterns = [
    path('', index, name='index'),
    path('login', login_page, name='login'),
    path('individual-use', individual_use, name='individual_use'),
    path('organization-use', organization_use, name='organization_use'),
    path('individual-signup', individual_signup, name='individual_signup'),
    path('organization-signup', organization_signup, name='organization_signup'),
    path('about', about, name='about'),
    path('environmental-pollution', environmental_pollution, name='environmental_pollution'),
    path('health-care-preservation', health_care_preservation, name='health_care_preservation'),
    path('mp10', mp10, name='mp10'),
    path('mp25', mp25, name='mp25'),
    path('termandcondition', termandcondition, name='termandcondition'),
    path('graph', graph, name='graph'),
]
