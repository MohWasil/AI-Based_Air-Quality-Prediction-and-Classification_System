from . import openweather
from . import countries_name
"""
    In this python file we are going to handle these steps:
        1. Checking latitude and longitude comes from frontend and send it to openweather server for collecting data
        if it is not working then we send his/her country.

    Note:
    it is very important that pass the latitude and longitude, country and state or province of the location
    and also make sure that if the latitude and longitude is not worked on openweather server. we will check based on their country
    and in some cases some country has 5 or less states that all their data will come and be seted. so in that case we will have more 
    prediction result.
    
    Reminder:
    We have used two different methods one for finding specific countries or location
    and the next one is for collecting and predicting all the data of countries at once.
"""

class CollectingData:
    def __init__(self, latitude, longitude, state, country):
        self.latitude = latitude
        self.longitude = longitude
        self.country = country
        self.state = state

    # collecting the coordinates data and send it for preprocessing        
    def send_data_by_details(self):
        # store the data
        all_data = []
        res = openweather.obj.fetch_air_quality(self.latitude, self.longitude)
        time = openweather.obj.fetch_local_time(self.latitude, self.longitude)

        # converting the countries abrieviation to full names
        temp = list(self.country)
        for x in range(1, len(temp)):
            temp[x] = temp[x].lower()
        temp = ''.join(temp)
        for coun in countries_name.countries:
            if coun.startswith(temp):
                result = coun
        if result:
            self.country = result


        if res and time:
            normalized_data = {
                'country': self.country,
                'state': self.state,
                'latitude': self.latitude,
                'longitude': self.longitude,
                **res,  # Spread air quality dictionary into this one
                'local_time': time  # Include the local time
            }
            all_data.append(normalized_data)
            return openweather.store_data_in_database(all_data, flag=1)
        else:
            data = openweather.obj.collect_air_quality_data(self.country)
            return openweather.store_data_in_database(data, flag=1)

    # Collecing the endire countries data and send it to preprocessing            
    def send_data_by_default(self):
        data = openweather.obj.collect_air_quality_data(None)
        return openweather.store_data_in_database(data)


# if __name__ == '__main__':
    
#     obj = CollectingData(lat, long, state, country)
    
#     # Based on user location cordinates
#     res = obj.send_data_by_details()
#     genereted = gpt_advice.generate_advice(user_name, res[0][0], user_type, location)
#     clean_generated = gpt_advice.clean_advice_output(genereted)
    
    
#     # Based on default
#     obj.send_data_by_default()
