import requests
import io
import cv2
import numpy as np

img = np.zeros((100, 100, 3), dtype=np.uint8)
_, img_encoded = cv2.imencode('.png', img)

files = {'image': ('test.png', img_encoded.tobytes(), 'image/png')}
data = {'message': 'test message', 'password': 'testpass'}

try:
    response = requests.post('http://127.0.0.1:5000/api/encrypt', files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
