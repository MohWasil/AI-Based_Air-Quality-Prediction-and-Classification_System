from django.urls import path

from .views import AirQualityIndexAPIView, TodayAirQualityIndexAPIView, predict

urlpatterns = [
    path('predict/', predict, name="predict"),
    path('aqi/', AirQualityIndexAPIView.as_view(), name="aqi"),
    path('today-aqi/', TodayAirQualityIndexAPIView.as_view(), name="today_aqi")
]
