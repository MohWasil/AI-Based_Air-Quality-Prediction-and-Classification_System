import requests
import time
import pandas as pd
import os
from dotenv import load_dotenv
from . import Preprocessing
from . import countries_name
from .. import models
from pathlib import Path
"handle the problem of first checking the longitude and latitude and else using country"


dotenv_path = Path(__file__).resolve().parent / ".env"

load_dotenv(dotenv_path)
openweather_api_key = os.getenv("openweather_api_key")
timezone_api_key = os.getenv("timezone_api_key")




class OpenWeather:
    def __init__(self, api_key, timezone_api):
        self.API_KEY = api_key
        self.TIMEZONE_API_KEY = timezone_api

    def fetch_countries(self, count=None):
        country = countries_name.countries
        if count in country:
            return [count]
        return country

    # ------------------------
    # 2. Get States for Country
    # ------------------------
    def fetch_states_for_country(self, country):
        """Fetch major states or provinces for a given country using OpenWeather's Geocoding API."""
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={country}&limit=10&appid={self.API_KEY}"
        response = requests.get(url)
        if response.status_code == 200:
            locations = [response.json()[0]]
            states = [(loc['name'], loc['lat'], loc['lon']) for loc in locations]
            return states
        else:
            return []

    # ------------------------
    # 3. Get Air Quality for State or City
    # ------------------------
    def fetch_air_quality(self, lat, lon):
        """Fetch air quality data for a specific latitude and longitude."""
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={self.API_KEY}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if 'list' in data and data['list']:
                components = data['list'][0]['components']
                aqi = data['list'][0]['main']['aqi']
                return {
                    'aqi': aqi,
                    'co': components.get('co'),
                    'no': components.get('no'),
                    'no2': components.get('no2'),
                    'o3': components.get('o3'),
                    'so2': components.get('so2'),
                    'pm2_5': components.get('pm2_5'),
                    'pm10': components.get('pm10'),
                    'nh3': components.get('nh3')
                }
        return {}

    # ------------------------
    # 4. Get Local Time for a Given Latitude and Longitude
    # ------------------------
    def fetch_local_time(self, lat, lon):
        """Fetch local time for a given latitude and longitude using TimezoneDB API."""
        url = f"http://api.timezonedb.com/v2.1/get-time-zone?key={self.TIMEZONE_API_KEY}&format=json&by=position&lat={lat}&lng={lon}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if 'formatted' in data:
                local_time = data['formatted']
                return local_time

        return None

    # ------------------------
    # 5. Main Data Collection
    # ------------------------
    def collect_air_quality_data(self, count_name):
        """Main function to collect air quality data for countries, states, and cities."""
        countries = self.fetch_countries(count_name)
        all_data = []
        
        for country in countries:  
            states = self.fetch_states_for_country(country)
            
            for state_name, lat, lon in states:  
                
                air_quality = self.fetch_air_quality(lat, lon)
                local_time = self.fetch_local_time(lat, lon)  # Get the local time
                
                if air_quality and local_time:
                    normalized_data = {
                        'country': country,
                        'state': state_name,
                        'latitude': lat,
                        'longitude': lon,
                        **air_quality,  # Spread air quality dictionary into this one
                        'local_time': local_time  # Include the local time
                    }
                    all_data.append(normalized_data)
                
                # Respect rate limits
                time.sleep(1)
        
        return all_data

def add_data_to_database(data):
    for d in data:
        models.AirQualityIndex.objects.create(**d)

def store_data_in_database(data, flag=0):
    """Store air quality data in a SQL database."""

    df = pd.DataFrame(data)
    if flag == 1:
        queryset = models.AirQualityIndex.objects.all()
        country = df['country'].unique()
        test = pd.DataFrame(list(queryset.values()))
        if len(df['aqi']) == 1:
            test = test[test['aqi'] == df['aqi'][0]]
        else:
            test = test[test['country'] == country[0]]
        add_data_to_database(data)
        df['mark'] = 1
        new_data = pd.concat([df, test],ignore_index=True)
        # print(new_data)
        return Preprocessing.Preprocessing(new_data).preprocess()

    else:
        add_data_to_database(data)
        df['mark'] = 0
        return Preprocessing.Preprocessing(df).preprocess()    
    
obj = OpenWeather(openweather_api_key, timezone_api_key)