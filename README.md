# 🌍💨 Scalable AI-driven air quality forecasting and classification for public health applications 📊🌱
**Goal** : Provide both individuals (health guidance) and organizations (policy/mitigation recommendations) with real-time, location-aware air quality forecasts and actionable advice.
This project develops a real-time air quality prediction and classification system that collects historical and real-time data from the `NEPA` and `OpenWeather API`. The data is preprocessed with techniques like outlier correction and feature engineering, and then analyzed using machine learning models `(Random Forest, XGBoost)` for classification and deep learning models `(LSTM, TSMixer)` for pollutant concentration forecasting. Hyperparameter tuning and explainable AI techniques like `SHAP` and `LIME` are used to improve model performance and interpretability. The system is deployed in a real-time environment, with a web application for visualizing air quality data and mobile-based alerts to keep users informed of air quality changes.

**🔧 Project Consist of these steps: 📝** <br>
**Data & preprocessing**
1: Sources: OpenWeather API (10-day rolling ingestion) + Afghanistan NEPA historical stations.
Cleaning: outlier removal with RobustScaler; missing values imputed via KNN and custom FTLRI method.

2: Feature engineering: rolling statistics, lag features (windowed historic features), weather & location clustering (K-means) to handle regional behavior.
Stationarity checks and distribution transforms applied for time-series suitability.

**Models & validation**
1: Classification: Random Forest for discrete AQ categories; metrics: accuracy, confusion matrix (report per-class), precision/recall for imbalanced classes. (Reported accuracy: 99.96 — include validation split & CV details.)

2: Regression: TSMixer for multi-horizon forecasting (1,3,6,24,48,72h); metrics: MAE = 0.07, MSE = 0.02, R² = 0.98 on hold-out/rolling test set.
Robust evaluation using rolling window backtesting to simulate real-time forecasting.

**Advanced & deployment**
PPO reinforcement learning agent prototyped to simulate rare/extreme conditions (forest fires, heavy humidity) not well represented in training data — reward function based on health index reduction and mitigation costs.
Backend: Django REST API serving forecasts; integrations: Twilio (alerts), OpenAI (personalized recommendations), client-side JS + location API.
`Next steps`: containerize with Docker, add CI/CD, monitoring (model drift alerts), and cloud deployment (GCP/AWS). 

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
--- 

### 2. Download and Install Dependencies Manually 📥

Alternatively, you can download the project as a ZIP file and install the dependencies manually:  
  1. Click the **Code** button on GitHub and select **Download ZIP**.  
  2. Extract the ZIP file to your desired location.  
  3. Open a terminal or command prompt and navigate to the extracted folder.  
  4. (Optional) Create and activate a virtual environment:  
  #### Navigate into the project directory
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
--- 

### 3. Set up API Keys 🔑
Before running the server, you need to configure your API keys in the .env file. This file can be found in the `predict/MLAutomation` directory.<br>
You will need three API keys:
- **OpenAI API Key**
- **OpenWeather API Key**
- **TimeZone API Key** <br>
You can obtain the necessary API keys from the following websites:<br>
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
