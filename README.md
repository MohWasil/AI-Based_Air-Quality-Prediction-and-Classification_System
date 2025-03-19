# AI Driven Air-Quality-Prediction-and-Classification monitor system.
The proposed real-time air quality prediction system follows a structured pipeline integrating data acquisition, preprocessing, model selection, and deployment. Historical and real-time air quality data are collected from the NEPA and OpenWeather API, undergoing preprocessing techniques such as outlier correction, feature engineering, and time-series transformations. Machine learning models (Random Forest, XGBoost) are employed for classification, while deep learning models (LSTM, TSMixer) are used for pollutant concentration forecasting. Hyperparameter tuning and explainable AI techniques (SHAP, LIME) enhance model interpretability and performance evaluation. Finally, the system is deployed in a real-time environment, integrating web applications and mobile-based alerts, ensuring timely air quality updates for decision-makers and the public.

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
 
