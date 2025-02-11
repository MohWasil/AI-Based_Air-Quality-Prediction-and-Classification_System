from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import IndividualUserViewSet, OrganizationalUserViewSet, LoginAPIView, LogoutAPIView, AdminSignup

router = DefaultRouter()
router.register('individual-users', IndividualUserViewSet, basename='individualuser')
router.register('organizational-users', OrganizationalUserViewSet, basename='organizationaluser')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('admin-users/', AdminSignup.as_view()),
]
