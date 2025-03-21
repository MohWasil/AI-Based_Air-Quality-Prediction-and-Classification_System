# AI Driven Air-Quality-Prediction-and-Classification monitor system.
This project develops a real-time air quality prediction system that collects historical and real-time data from the NEPA and OpenWeather API. The data is preprocessed with techniques like outlier correction and feature engineering, and then analyzed using machine learning models (Random Forest, XGBoost) for classification and deep learning models (LSTM, TSMixer) for pollutant concentration forecasting. Hyperparameter tuning and explainable AI techniques like SHAP and LIME are used to improve model performance and interpretability. The system is deployed in a real-time environment, with a web application for visualizing air quality data and mobile-based alerts to keep users informed of air quality changes.

**Project Consist of these steps:**
  **1. Data Collection:**
  Data is been collected from NEPA (National Environmental Protection Agency) of Afghanistan & OpenWeather for ten days.

  **2. Data Preprocessing:**
  * For this project Advance Preprocessing methods are used such as using **FTLRI** & **KNN** for imputation.
  * **K-means clustring** to cluster the locations.
  * **Lag & Rolling** for making history the dataset. and other methods.

 **3. Models Used:**
 Models selected for the project is RandomForest for classification and TSMixer for Regression. in addition to this Reinforcment learning PPO model
 is used to make more robust unexpected features in the future.
 

## Getting Started  

You can set up and run this project in two ways:  

### 1. Clone the Repository Directly  

If you want to clone the project and install dependencies in one go, follow these steps:  

#### Clone the repository
https://github.com/MohWasil/AI-Based_Air-Quality-Prediction-and-Classification_System.git


#### Navigate into the project directory
`cd your-repository`

#### Create a virtual environment optional
`python -m venv venv`

`On Mac and Linux` <br>
`venv/bin/activate` 

`On Windows` <br>
`venv\Scripts\activate`

#### Install dependencies
`pip install -r requirements.txt`

### 2. Download and Install Dependencies Manually  

Alternatively, you can download the project as a ZIP file and install the dependencies manually:  

1. Click the **Code** button on GitHub and select **Download ZIP**.  
2. Extract the ZIP file to your desired location.  
3. Open a terminal or command prompt and navigate to the extracted folder.  
4. (Optional) Create and activate a virtual environment:  

  python -m venv venv
  
  `On Mac and Linux` <br>
  `venv/bin/activate` 
  
  `On Windows` <br>
  `venv\Scripts\activate`

#### 5. Install dependencies:  
   `pip install -r requirements.txt`

**After installing dependencies you need to follow these steps:** <br>
**Note:** <br>
Please before migration or running the server you need to go to `predict folder --> MLAutomation --> .env file`.
in the env file you need to have three API key for the current use. <br>
first one is OpenAI api key.<br>
second is Openweather and the last one if from timezone.<br>
You need to have their API's to use the project. Variables are declared just paste your API's and use them. <br>
links are bellow.<br>
[OpenAI Website](https://openai.com/)<br>
[OpenWeather Website](https://openweathermap.org/api/air-pollution)<br>
[TimeZone Website](https://timezonedb.com/)<br>

#### 1. Makemigrations.
use this command in your project directory terminal <br>
`python manage.py makemigrations`

#### 2. Migrate.
Now migrate the project. <br>
`python manage.py migrate`

#### 3. Run The suerver.
Use this command to run the server locally. <br>
`python manage.py runserver`

