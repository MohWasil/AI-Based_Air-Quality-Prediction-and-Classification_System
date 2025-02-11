from django.db import models

# Create your models here.

class AirQualityIndex(models.Model):
  country = models.CharField(max_length=100)
  state = models.CharField(max_length=100)
  latitude = models.FloatField()
  longitude = models.FloatField()
  aqi = models.IntegerField()
  co = models.FloatField()
  no = models.FloatField()
  no2 = models.FloatField()
  o3 = models.FloatField()
  so2 = models.FloatField()
  pm2_5 = models.FloatField()
  pm10 = models.FloatField()
  nh3 = models.FloatField()
  local_time = models.CharField(max_length=50)