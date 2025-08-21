import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env")

# Initialize the OpenAI client
OPENAI_API_KEY = os.getenv("openai_api_key")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_advice(user_name, air_quality, user_type, latitude, longitude):
    """
    Generate concise advice (7 items) for users or organizations based on air quality and user type.

    Args:
    - user_name (str): Name of the user (used for personalization).
    - air_quality_index (int): Numerical air quality index (1 to 5).
    - user_type (str): Type of user ("normal_user" or "organization").
    - location (str): Geographical location of the user.

    Returns:
    - str: Tailored advice for the user or organization.
    """

    # Define tasks and advice generation logic
    if user_type == "normal_user":
        task_description = (
            f"As a personal advisor, your task is to provide 7 concise and practical recommendations for {user_name} "
            f"based on the air quality in this specific {latitude}, {longitude} location, which is classified as {air_quality}. "
            "Focus on actionable advice for daily activities, health precautions, and outdoor exposure."
        )
    elif user_type == "organization":
        task_description = (
            f"As a policy advisor, your task is to generate 7 specific and actionable recommendations for a policymaking organization "
            f"regarding air quality management in this specific {latitude}, {longitude} location, where the air quality is classified as {air_quality}. "
            "Your advice should include strategies to improve air quality and address public health concerns."
        )
    else:
        return "Invalid user type specified."

    # Generate response using GPT
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful advisor specializing in air quality recommendations."},
                {"role": "user", "content": task_description}
            ],
        )
        # Extract the generated advice
        advice = response.choices[0].message
        return advice
    except Exception as e:
        return f"An error occurred while generating advice: {e}"




def clean_advice_output(advice_message):
    """
    Cleans and formats the AI-generated advice into a structured, numbered list.

    Args:
    - advice_message (str): The raw advice content from the AI response.

    Returns:
    - str: Cleaned and formatted advice.
    """
    # Extract the content from the response
    raw_content = advice_message.content
    
    # Split the content into lines and clean up unnecessary parts
    lines = raw_content.split("\n")
    cleaned_lines = []
    
    # Extract meaningful lines (ignoring empty lines or introductory text)
    for line in lines:
        line = line.strip()
        if line and line[0].isdigit() and '**' in line:
            # Remove the formatting like "**" and leading numbers
            cleaned_line = line.split(" ", 1)[-1].replace("**", "").strip()
            cleaned_lines.append(cleaned_line)
    # Join the cleaned lines into a structured output

    # formatted_advice = "\n".join([f"{i + 1}. {line}" for i, line in enumerate(cleaned_lines)])

    # return formatted_advice
    
    return cleaned_lines
