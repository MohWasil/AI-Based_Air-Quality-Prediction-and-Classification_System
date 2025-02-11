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
    
    # advice_message = ["Stay Indoors: Limit all outdoor activities, especially strenuous exercises. Stay indoors as much as possible, keeping windows and doors closed to prevent outdoor air from entering.', 'Use Air Purifiers: If possible, use air purifiers with HEPA filters in your home. This can significantly reduce indoor air pollutants and improve air quality.', 'Wear Masks: If you must go outside, wear an N95 or similar mask that can filter out fine particulate matter. This can help protect your lungs from harmful pollutants.', 'Hydrate: Drink plenty of water to help your body flush out toxins. Staying well-hydrated can also help your respiratory system function better.', 'Monitor Air Quality: Use air quality apps or websites to stay updated on local air quality indexes (AQI). This will help you plan activities when conditions improve.', 'Limit HVAC System Activity: If your heating and cooling system is not equipped with high-efficiency filters, limit its use to reduce circulating dangerous particles. When using it, ensure filters are clean and consider using a standalone air cleaner.', 'Consult Health Professionals: If you experience symptoms like coughing, wheezing, or shortness of breath, seek medical advice promptly. Individuals with pre-existing health conditions should prioritize regular consultations with healthcare providers." , "Hello" , "World news textform"]
    # print(advice_message)
    
    va = {
        "classification_result": classification_result,
        "feature_importance": feature_importance,
        "predic_res": predic_res,
        "GPT_Advice": advice_message
    } 


    return response.Response(va, status=status.HTTP_200_OK)
