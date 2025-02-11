from rest_framework import serializers
from .models import AirQualityIndex

class AirQualityIndexSerializer(serializers.ModelSerializer):
  class Meta:
    model = AirQualityIndex
    fields = [
      'id',
      'country',
      'state',
      'latitude',
      'longitude',
      'aqi',
      'co',
      'no',
      'no2',
      'o3',
      'so2',
      'pm2_5',
      'pm10',
      'nh3',
      'local_time',
    ]
  