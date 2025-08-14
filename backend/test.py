import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("API_KEY")

url = f"https://api.weatherstack.com/current?access_key={api_key}"

querystring = {"query":"New Delhi"}

response = requests.get(url, params=querystring)

print(response.json())
