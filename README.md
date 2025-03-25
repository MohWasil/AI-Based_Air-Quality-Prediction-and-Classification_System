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
 

## Getting Started 🚀

You can set up and run this project in two ways:  
- **Clone the repository directly**
- **Download and install dependencies manually**

---

### 1. Clone the Repository Directly 🧑‍💻

If you want to clone the project and install dependencies in one go, follow these steps:

#### Clone the repository
```bash
git clone https://github.com/MohWasil/AI-Based_Air-Quality-Prediction-and-Classification_System.git
```


#### Navigate into the project directory
`cd your-directory`

#### Create a virtual environment (optional)
##### For Mac
```bash
python3 -m venv venv
source venv/bin/activate
```
##### On Windows <br>
```bash
python -m venv venv
venv\Scripts\activate
```
#### Install dependencies
```bash
pip install -r requirements.txt
```
### 2. Download and Install Dependencies Manually 📥

Alternatively, you can download the project as a ZIP file and install the dependencies manually:  
  1. Click the **Code** button on GitHub and select **Download ZIP**.  
  2. Extract the ZIP file to your desired location.  
  3. Open a terminal or command prompt and navigate to the extracted folder.  
  4. (Optional) Create and activate a virtual environment:  
  
  `cd your-extracted-folder`
  #### Mac and Linux
  ```bash
  python -m venv venv
  venv/bin/activate 
  ```
  #### Windows
  ```bash
  python -m venv venv
  venv\Scripts\activate
  ```
#### Install dependencies:
  ```bash 
  pip install -r requirements.txt
  ```
### Set up API Keys 🔑
Before running the server, you need to configure your API keys in the .env file. This file can be found in the `predict/MLAutomation` directory.<br>
You will need three API keys:
- **OpenAI API Key**
- **OpenWeather API Key**
- **TimeZone API Key**
You can obtain the necessary API keys from the following websites:.<br>
- [OpenAI Website](https://openai.com/)<br>
- [OpenWeather Website](https://openweathermap.org/api/air-pollution)<br>
- [TimeZone Website](https://timezonedb.com/)<br>

---

### 4. Database Setup 🗄️
After installing the dependencies and setting up your API keys, follow these steps:
#### 1. Makemigrations.
Use this command in your project directory to create database migrations: <br>
```bash
python manage.py makemigrations
```
#### 2. Migrate.
Now, migrate the database to apply the changes: <br>
```
python manage.py migrate
```
#### 3. Run The suerver.
Use this command to run the server locally: <br>
```
python manage.py runserver
```
Now, your server should be running locally and you can access the application!

---
## Troubleshooting ❓
- If you encounter any issues during setup, ensure that you’ve installed all dependencies correctly.
- Verify that the API keys are entered correctly in the .env file.

---
## Contributing 💡
We welcome contributions! If you'd like to contribute, please follow these steps:
Fork the repository.
- Create a new branch ```(git checkout -b feature-branch)```.
- Make your changes.
- Commit your changes ```(git commit -am 'Add feature')```.
- Push to the branch ```(git push origin feature-branch)```.
- Create a new Pull Request.
---
