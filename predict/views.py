from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, response
from rest_framework import generics, permissions, response, status
from rest_framework.decorators import api_view
from .serializers import AirQualityIndexSerializer
from .models import AirQualityIndex
from .MLAutomation.main import CollectingData
from .MLAutomation import gpt_advice
from accounts.models import AdminUser, IndividualUser


class AirQualityIndexAPIView(generics.ListAPIView):
  queryset = AirQualityIndex.objects.all()[::-1][:100]
  serializer_class = AirQualityIndexSerializer
  permission_classes = [permissions.IsAdminUser]

class TodayAirQualityIndexAPIView(generics.ListAPIView):
  queryset = AirQualityIndex.objects.all()
  serializer_class = AirQualityIndexSerializer
  permission_classes = [permissions.IsAdminUser]



@api_view(['GET'])
@permission_classes([])  # 👈 This ensures only authenticated users can access
def predict(request, *args, **kwargs):
    full_name = None
    user_type = 'organization'

    if request.user.is_authenticated:
        if request.user.user_type == 'individual':
            full_name = IndividualUser.objects.get(user_id=request.user).full_name
            user_type = 'normal_user'
        elif request.user.user_type == 'admin':
            full_name = AdminUser.objects.get(user_id=request.user).full_name
            user_type = 'normal_user'

    
    country = request.GET.get("country")
    state = request.GET.get("state")
    latitude = request.GET.get("latitude")
    longitude = request.GET.get("longitude")
    
    
    
    collecting_data = CollectingData(latitude, longitude, state, country)
    (classification_result, feature_importance, predic_res) = collecting_data.send_data_by_details()
    classification_result = classification_result[0]
    feature_importance = feature_importance[0]
    predic_res = predic_res[0]
    advice = gpt_advice.generate_advice(user_name=full_name, air_quality=classification_result, user_type=user_type, longitude=longitude, latitude=latitude)
    advice_message = gpt_advice.clean_advice_output(advice)
    
    # Classification, Regression, Affected metrics to model and Advice is going to frontend
    result = {
        "classification_result": classification_result,
        "feature_importance": feature_importance,
        "predic_res": predic_res,
        "GPT_Advice": advice_message
    } 


    return response.Response(result, status=status.HTTP_200_OK)
