import requests

files = {'image': open('birdeye.jpeg', 'rb')}
response = requests.post('http://localhost:8000/predict_tea_disease', files=files)

print(response.json())