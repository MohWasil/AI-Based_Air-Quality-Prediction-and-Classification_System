from django.urls import path
from .views import index, postman
urlpatterns = [
    path('', index),
    path('postman', postman)
]
