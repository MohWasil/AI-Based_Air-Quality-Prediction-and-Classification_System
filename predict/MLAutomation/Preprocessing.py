import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.impute import KNNImputer
import joblib
import pickle
from keras.models import load_model
from stable_baselines3 import PPO
import threading
from sklearn.linear_model import LinearRegression
import math


"""
    This Python file is designed to be used for preprocessing steps.
    This is an automation process to handle raw data and make it ready for predictions.
    So to achieve this, we seperate the process using a single class with many functions.
    preprocess function is the most important function and all other functions are called inside that.
"""

class Preprocessing:
    def __init__(self, data):
        self.data = data

    # Starting the Preprocess steps        
    def preprocess(self):
        # first of all EDA process is required
        self.eda()
        
        # checking for missing values and fill them with appropriate methods
        missing = self.data.isna().sum() # missing feature values
        for key, val in missing.items():
            if val > 0:
                self.clean(key, 0)   

        # calling feature Engineering functions
        classification_data, regression_data, remaining_features = self.feature_engineering()
        
        # Calling models and the models are going to predict the output
        result = self.models(classification_data, regression_data, remaining_features)
        
        # Storing the result of classifications and regression and feature importance information        
        classification_result = []
        feature_importance = []
        predictions = []
        features = ['co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10']
        hourly_pred = ['1H', '3H', '6H', '24H', '48H', '72H']
        
        def metrics(value):
            if value == 1:
                return 'Good'
            elif value == 2:
                return 'Fair'
            elif value == 3:
                return 'Moderate'
            elif value == 4:
                return 'Abnormal'
            elif value == 5:
                return 'Dangerous'
            else:
                return 'Not recognized'
            
        for key, val in result.items():
            if key == "classification_result":
                for row in val:
                    for metric in range(len(row)):
                        if metric == 0 and row[metric] == 1:
                            classification_result.append("Good")
                        
                        elif metric == 1 and row[metric] == 1:
                            classification_result.append("Fair")

                        elif metric == 2 and row[metric] == 1:
                            classification_result.append("Moderate")
                        elif metric == 3 and row[metric] == 1:
                            classification_result.append("Abnormal")
                        elif metric == 4 and row[metric] == 1:
                            classification_result.append("Dangerous")

            elif key == "feature_importance":
                feature_importance.append(zip(features, val))
                                
            elif key == "Prediction":
                for index in range(len(classification_result)):
                    temp = []
                    for metric in range(len(val[index])):
                        temp.append(metrics(math.ceil(val[index][metric])))

                    predictions.append(zip(hourly_pred, temp))
        
        feature_impor_res = []
        predic_res = []
        for x in feature_importance:
            feature_impor_res.append([*x])        
        
        for x in predictions:
            predic_res.append([*x]) 
        
        # Returning the result of classification, prediction and feature importance as tuples
        return classification_result, feature_impor_res, predic_res
 
 
          
    # Simple EDA checkup                 
    def eda(self):
        # Function to check and align column names with the expected format
        def check_and_align_columns(dataset, expected_columns):
            # Get the current column names from the dataset
            current_columns = list(dataset.columns)

            # Check if all expected columns are present
            missing_columns = [col for col in expected_columns if col not in current_columns]
            extra_columns = [col for col in current_columns if col not in expected_columns]
            
            if missing_columns:
                for col in missing_columns:
                    self.data = self.clean(col, 1)
            
            # Reorder the dataset to match the expected column order
            aligned_dataset = dataset[expected_columns + extra_columns]

            return aligned_dataset

        # Expected columns based on your model
        expected_columns = ['country', 'state', 'latitude', 'longitude', 'aqi', 
                            'co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3', 'local_time']
        
        self.data = check_and_align_columns(self.data, expected_columns)


        if self.data.duplicated().sum() > 0:
            self.data.drop_duplicates(inplace=True)
        
        
        # Time to handle date & make it standard
        def standardize_local_time(dataset, column='local_time'):
            # Identify rows with non-standard date formats
            needs_conversion = ~dataset[column].str.match(r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$', na=False)

            # Convert non-standard dates to a standard datetime format
            dataset.loc[needs_conversion, column] = pd.to_datetime(
                dataset.loc[needs_conversion, column],
                errors='coerce',  # Coerce invalid formats to NaT
                dayfirst=True     # Assume day-first format if ambiguous
            )

            # Add missing time details for valid converted dates
            dataset.loc[needs_conversion, column] = dataset.loc[needs_conversion, column].apply(
                lambda x: x.replace(hour=0, minute=0, second=0) if not pd.isnull(x) else x
            )
            
            return dataset

        self.data = standardize_local_time(self.data, column='local_time')


    # Data Cleaning Section    
    def clean(self, feature, flag):
        
        # checking if the data type of feature is object then fill with the mode
        if self.data[feature].dtype == 'object':
            self.data[feature].fillna(self.data[feature].mode(), inplace=True)
            
        # Checking flag, if the flag is one mean that there is a missing feature in data
        if flag == 1:
            # finding indices of null values
            index = self.data[feature].loc[self.data[feature].isna()]
            states = self.data.loc[index]['state']  # locking states of missing values
            for state in states: # checking each state
                # Non missing values of state which has null values
                non_missing_values = self.data[(self.data['state'] == state) & self.data[feature].notnull().all(axis=1)]
                # missing values of that state
                missing_values = self.data[(self.data['state'] == state) & self.data[feature].isnull().any(axis=1)]
                # Selecting important or main features of aqi
                features = [col for col in self.data.columns if col not in [feature, state,'longitude', 'latitude', 'country', 'local_time', 'aqi']]
                models = {}
                # training the model on non missing values
                X_train = non_missing_values[features].dropna()
                y_train = non_missing_values.loc[X_train.index, feature]
                model = LinearRegression()
                model.fit(X_train, y_train)
                models[feature] = model

                # Step 3: Predicting and filling missing values based on non missing values learned on
                
                X_test = missing_values[features].fillna(missing_values[features].mean())
                predictions = models[feature].predict(X_test)
                self.data.loc[X_test.index, feature] = predictions

                return self.data

        else:
            # Identify columns with null values
            knn_columns = self.data.columns[self.data.isna().mean() > 0]
            if 'mark' in knn_columns:
                self.data['mark'] = self.data['mark'].fillna(0)
            else:
                if not knn_columns.empty:
                    # Separate the columns with null values
                    knn_data = self.data[knn_columns]
                    
                    # Separate rows with null values
                    null_data = knn_data[knn_data.isnull().any(axis=1)]  # Rows with at least one null value
                    
                    if not null_data.empty:
                        # Apply KNN imputation only on rows with null values
                        knn_imputer = KNNImputer(n_neighbors=3)
                        imputed_data = pd.DataFrame(knn_imputer.fit_transform(knn_data), columns=knn_columns)
                        
                        # Update only the rows with null values in the original data
                        self.data.loc[null_data.index, knn_columns] = imputed_data
        
        
    # Feature Engineering Section    
    def feature_engineering(self):
        
        
        def transformation_and_scaler_pipeline(data):
            # Load the saved pipeline
            pipeline = joblib.load('predict\MLAutomation\preprocessing_pipeline.sav')

            # List of features to exclude from transformation
            drop = ['country', 'state', 'longitude', 'latitude', 'local_time', 'aqi', 'mark']

            # Separate unwanted features
            dropped_features = data[drop]
            features_to_transform = data.drop(drop, axis=1)

            # Apply the loaded pipeline
            transformed_features = pd.DataFrame(
                pipeline.transform(features_to_transform),
                columns=features_to_transform.columns
            )

            # Combine transformed and untouched features
            final_data = pd.concat([dropped_features.reset_index(drop=True), transformed_features], axis=1)


            return final_data
        
        if 'id' in self.data.columns:
            self.data = self.data.drop('id', axis=1)
        self.data = transformation_and_scaler_pipeline(self.data)


        # Add features for year, month, day, hour, and minute
        def add_time_features(dataset):
            dataset['local_time'] = pd.to_datetime(dataset['local_time'], errors='coerce')

            # Extract and add features
            dataset['year'] = dataset['local_time'].dt.year
            dataset['month'] = dataset['local_time'].dt.month
            dataset['day'] = dataset['local_time'].dt.day
            dataset['hour'] = dataset['local_time'].dt.hour
            dataset['dayofweek'] = dataset['local_time'].dt.dayofweek

            dataset.drop('local_time', axis=1, inplace=True)
            return dataset

        self.data = add_time_features(self.data)


        def clustring(dataset):
            with open ("predict\MLAutomation\kmeans_model (1).pkl", 'rb') as file:
                cluster_model = joblib.load(file)
            
            with open ("predict/MLAutomation/cluster-scaler.sav", 'rb') as f:
                scaler = joblib.load(f)    
                
            dataset[['latitude', 'longitude']] = scaler.transform(dataset[['latitude', 'longitude']])
            dataset['region_id'] = cluster_model.predict(dataset[['latitude', 'longitude']])

            dataset.drop(['latitude', 'longitude'], axis=1, inplace=True)
            dataset.drop(['country', 'state', 'no', 'nh3'], axis=1, inplace=True)
            return dataset
        
        self.data = clustring(self.data)



        def create_lag_and_rolling_features(df, num_cols, time_cols, lags, rolling_windows):
            # Initialize DataFrames for lagged and rolling features
            lagged_features = pd.DataFrame()
            rolling_features = pd.DataFrame()
            
            # Create lag and rolling features for each numeric column
            for col in num_cols:
                # Lag features
                for lag in lags:
                    lagged_features[f"{col}_lag_{lag}"] = df[col].shift(lag)
                
                # Rolling features
                for window in rolling_windows:
                    rolling_features[f"{col}_roll_mean_{window}"] = df[col].rolling(window=window).mean()
                    rolling_features[f"{col}_roll_std_{window}"] = df[col].rolling(window=window).std()
            
            # Combine lag and rolling features
            combined_features = pd.concat([lagged_features, rolling_features], axis=1)
            
            # Combine with original time features
            final_df = pd.concat([df[time_cols + num_cols], combined_features], axis=1)
            
            # Fill missing values from lag and rolling operations using forward fill                    
            final_df.fillna(method='ffill', inplace=True)
            
            # final_df.fillna(method='bfill', inplace=True)
            # Drop remaining NaNs (e.g., at the start of the dataset where no lag/rolling data exists)
            # final_df.dropna(inplace=True)
            
            # Reset index for a clean dataset
            final_df.reset_index(drop=True, inplace=True)
            
            return final_df


        # Parameters
        num_cols = ['co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'aqi']
        time_cols = ['year', 'month', 'day', 'hour', 'dayofweek', 'region_id', 'mark']
        lags = [1, 3, 6, 24, 48, 72]
        rolling_windows = [3, 6, 24]

        # Call the function
        self.data = create_lag_and_rolling_features(self.data, num_cols, time_cols, lags, rolling_windows)

    

        def impute_missing_values(dataset, knn_threshold=0.3, lag_hours=1, rolling_window=3):
            """
            Impute missing values using KNN, lag-based, and rolling mean approaches,
            with robustness for small datasets.
            
            Parameters:
            - dataset (pd.DataFrame): Input dataset with missing values.
            - knn_threshold (float): Maximum percentage of missing values for KNN imputation.
            - lag_hours (int): Time lag in hours for lag-based imputation.
            - rolling_window (int): Window size for rolling mean imputation.
            
            Returns:
            - dataset (pd.DataFrame): Dataset with missing values imputed.
            """
            # 1. KNN Imputation
            knn_columns = dataset.columns[dataset.isna().mean() < knn_threshold]  # Columns with < threshold missing
            if not knn_columns.empty:
                knn_data = dataset[knn_columns]
                knn_imputer = KNNImputer(n_neighbors=5)
                knn_imputed_data = pd.DataFrame(knn_imputer.fit_transform(knn_data), columns=knn_columns)
                dataset[knn_columns] = knn_imputed_data

            # 2. Lag-Based Imputation
            lag_columns = [col for col in dataset.columns if "lag" in col and dataset[col].isna().sum() > 0]
            for col in lag_columns:
                dataset[col] = dataset[col].fillna(dataset[col].shift(lag_hours))
                dataset[col] = dataset[col].fillna(method='bfill')  # Fallback if shift doesn't fill values

            # 3. Rolling Mean Imputation
            rolling_columns = [col for col in dataset.columns if "rolling" in col and dataset[col].isna().sum() > 0]
            for col in rolling_columns:
                adjusted_window = min(rolling_window, len(dataset))  # Dynamically adjust window size for small datasets
                dataset[col] = dataset[col].fillna(dataset[col].rolling(window=adjusted_window, min_periods=1).sum())
            
            # 4. Handle 'aqi_lag_*h' Columns
            shift_columns = [col for col in dataset.columns if col.startswith('aqi_lag_')]
            for col in shift_columns:
                if dataset[col].isna().sum() > 0:
                    dataset[col] = dataset[col].fillna(dataset['aqi'])  # Use column mean as fallback
                dataset[col] = dataset[col].round().clip(lower=1, upper=5).astype(int)  # Round and constrain
 

            # 5. Final Check for Any Remaining Missing Values     
            # Selecting missing features
            def fill_missing_values(dataset, method="both"):
                """
                Fill missing values in a dataset using forward fill and backward fill methods.

                Parameters:
                - dataset (pd.DataFrame): Dataset with missing values.
                - method (str): Method for filling missing values. 
                Options: "forward" (only forward fill), "backward" (only backward fill), "both" (default: forward followed by backward).

                Returns:
                - pd.DataFrame: Dataset with missing values filled.
                """
                if method == "forward":
                    # Apply forward fill
                    dataset.fillna(method="ffill", inplace=True)
                elif method == "backward":
                    # Apply backward fill
                    dataset.fillna(method="bfill", inplace=True)
                elif method == "both":
                    # Apply forward fill first, then backward fill for any remaining NaNs
                    dataset.fillna(method="ffill", inplace=True)
                    dataset.fillna(method="bfill", inplace=True)
                else:
                    raise ValueError("Invalid method. Use 'forward', 'backward', or 'both'.")
                
                return dataset

            dataset = fill_missing_values(dataset, method="both")
            
            
            dataset = dataset[dataset['mark'] == 1]
            dataset.drop('mark', axis=1, inplace=True)
            return dataset

        # Example usage in the pipeline
        self.data = impute_missing_values(self.data)


        # Feature Selection section for classification and regression
        def select_features_for_tasks(dataset):

            # Classification features
            classification_features = ['co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10']

            # Regression features used during training
            regression_features = ['year', 'month', 'day', 'hour', 'dayofweek', 'region_id', 'co', 'no2',
       'o3', 'so2', 'pm2_5', 'pm10', 'co_lag_1', 'co_lag_3', 'co_lag_6',
       'co_lag_24', 'co_lag_48', 'co_lag_72', 'no2_lag_1', 'no2_lag_3',
       'no2_lag_6', 'no2_lag_24', 'no2_lag_48', 'no2_lag_72', 'o3_lag_1',
       'o3_lag_3', 'o3_lag_6', 'o3_lag_24', 'o3_lag_48', 'o3_lag_72',
       'so2_lag_1', 'so2_lag_3', 'so2_lag_6', 'so2_lag_24', 'so2_lag_48',
       'so2_lag_72', 'pm2_5_lag_1', 'pm2_5_lag_3', 'pm2_5_lag_6',
       'pm2_5_lag_24', 'pm2_5_lag_48', 'pm2_5_lag_72', 'pm10_lag_1',
       'pm10_lag_3', 'pm10_lag_6', 'pm10_lag_24', 'pm10_lag_48', 'pm10_lag_72',
       'co_roll_mean_3', 'co_roll_std_3', 'co_roll_mean_6',
       'co_roll_std_6', 'co_roll_mean_24', 'co_roll_std_24', 'no2_roll_mean_3',
       'no2_roll_std_3', 'no2_roll_mean_6', 'no2_roll_std_6',
       'no2_roll_mean_24', 'no2_roll_std_24', 'o3_roll_mean_3',
       'o3_roll_std_3', 'o3_roll_mean_6', 'o3_roll_std_6', 'o3_roll_mean_24',
       'o3_roll_std_24', 'so2_roll_mean_3', 'so2_roll_std_3',
       'so2_roll_mean_6', 'so2_roll_std_6', 'so2_roll_mean_24',
       'so2_roll_std_24', 'pm2_5_roll_mean_3', 'pm2_5_roll_std_3',
       'pm2_5_roll_mean_6', 'pm2_5_roll_std_6', 'pm2_5_roll_mean_24',
       'pm2_5_roll_std_24', 'pm10_roll_mean_3', 'pm10_roll_std_3',
       'pm10_roll_mean_6', 'pm10_roll_std_6', 'pm10_roll_mean_24',
       'pm10_roll_std_24', 'aqi_roll_mean_3', 'aqi_roll_std_3',
       'aqi_roll_mean_6', 'aqi_roll_std_6', 'aqi_roll_mean_24',
       'aqi_roll_std_24']
            # Separate datasets
            classification_data = dataset[classification_features]
            regression_data = dataset[regression_features]

            # Identify remaining features
            remaining_features = [
                col for col in dataset.columns 
                if col not in regression_features and col not in ['no', 'nh3', 'aqi', 'aqi_lag_1', 'aqi_lag_3', 'aqi_lag_6', 'aqi_lag_24', 'aqi_lag_48', 'aqi_lag_72']
            ]

            return classification_data, regression_data, remaining_features or ['No remaining features']

        # Apply the function
        classification_data, regression_data, remaining_features = select_features_for_tasks(self.data)
                
        
        return classification_data, regression_data, remaining_features


    # Model prediction functions
    def models(self, classification_data, regression_data, remaining_features):

        # Example models and RL placeholder
        classification_model = joblib.load("predict/MLAutomation/rf_final_model.joblib")
        regression_model = load_model("predict/MLAutomation/txmixer_model.keras")
        rl_model = PPO.load("predict/MLAutomation/ppo_air_quality_model (2).pt")

        # Placeholder for feature importance computation
        def compute_feature_importance(model):
            return model.feature_importances_

        # Classification function
        def classification_task(classification_data, result_dict):
            try:
                classification_result = classification_model.predict(classification_data)
                feature_importance = compute_feature_importance(classification_model)
                result_dict["classification"] = classification_result
                result_dict["classification_feature_importance"] = feature_importance
            except Exception as e:
                result_dict["classification_error"] = str(e)

        # Regression function
        def regression_task(regression_data, result_dict):
            try:
                regression_result = regression_model.predict(regression_data)
                result_dict["regression"] = regression_result
            except Exception as e:
                result_dict["regression_error"] = str(e)


        def rl_task(regression_result, external_features, result_dict):
            try:
                # Ensure external_features is handled (use zeros if not provided)
                if 'No remaining features' in external_features:
                    external_features = np.zeros((1, 6))  # Adjust size based on your requirement
                
                # Flatten external_features to 1D
                if external_features.ndim > 1:
                    external_features = external_features[0]
                
                # Ensure external_features matches the required size
                external_features = np.pad(
                    external_features, (0, 11 - external_features.shape[0]),
                    'constant'
                ) if external_features.shape[0] < 11 else external_features[:11]

                # Iterate over regression_result in batches of 11
                batch_size = 11
                adjusted_predictions = []
                num_batches = len(regression_result) // batch_size + int(len(regression_result) % batch_size != 0)

                for i in range(num_batches):
                    # Extract the batch
                    start_idx = i * batch_size
                    end_idx = min(start_idx + batch_size, len(regression_result))
                    regression_batch = regression_result[start_idx:end_idx]

                    # If the batch is smaller than 11, pad it
                    if len(regression_batch) < 11:
                        regression_batch = np.pad(
                            regression_batch, ((0, 11 - len(regression_batch)), (0, 0)), 'constant'
                        )

                    # Combine regression batch with external_features
                    rl_input = np.concatenate([regression_batch.flatten(), external_features])

                    # Ensure rl_input matches expected size (11,)
                    if rl_input.shape[0] > 11:
                        rl_input = rl_input[:11]
                    elif rl_input.shape[0] < 11:
                        rl_input = np.pad(rl_input, (0, 11 - rl_input.shape[0]), 'constant')

                    # Predict using the RL model
                    action, _ = rl_model.predict(rl_input)
                    adjusted_predictions.append(regression_batch + action)

                # Save RL results
                result_dict["rl"] = np.concatenate(adjusted_predictions)
            except Exception as e:
                result_dict["rl_error"] = str(e)


        # Main function to execute tasks in parallel
        def run_parallel_pipeline(classification_data, regression_data, external_features=None):
            result_dict = {}

            # Threads for parallel execution
            classification_thread = threading.Thread(
                target=classification_task, args=(classification_data, result_dict)
            )
            regression_thread = threading.Thread(
                target=regression_task, args=(regression_data, result_dict)
            )

            # Start threads
            classification_thread.start()
            regression_thread.start()

            # Wait for threads to finish
            classification_thread.join()
            regression_thread.join()

            # Pass regression output and external features to RL model if no errors occurred
            if "regression" in result_dict:
                rl_task(result_dict["regression"], external_features, result_dict)

            # Output result to frontend
            res = output_to_frontend(result_dict)

            return res

        # Function to send results to the frontend
        def output_to_frontend(result_dict):
            # Extract results
            classification_result = result_dict.get("classification", "No classification result")
            feature_importance = result_dict.get("classification_feature_importance", [])
            regression_result = result_dict.get("regression", "No regression result")
            rl_result = result_dict.get("rl", "No RL result")


            # Send the results to the frontend
            frontend_data = {
                "classification_result": classification_result,
                "feature_importance": feature_importance,
                "Prediction": rl_result,
            }
            return frontend_data

        result = run_parallel_pipeline(classification_data, regression_data, remaining_features)

        return result



if __name__ == '__main__':
    # data = pd.read_csv("./test.csv")
    # obj = Preprocessing(data)
    # obj.preprocess()
    pass



