from fastapi import FastAPI, responses, status, HTTPException
from pydantic import BaseModel


import os
import requests
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

api_key = os.getenv("API_KEY")

url = f"https://api.weatherstack.com/current?access_key={api_key}"

class weatherData(BaseModel):
    name: str

@app.post('/weather/', status_code=200)
async def handle_request(city_data: weatherData):
    try:
        query = {"query": f"{city_data.name}"}
        
        response = requests.get(url, params=query)
        if response:
            responses.status_code = status.HTTP_200_OK
            return response.json()
        else:
            raise HTTPException(status_code=404, detail='failed to fetch name')
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail='Unknown error')