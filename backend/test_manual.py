import traceback
import io
import cv2
import numpy as np
from app import app, encrypt

with app.test_request_context('/api/encrypt', method='POST', data={'message': 'test message', 'password': 'password'}, content_type='multipart/form-data'):
    from flask import request
    # Create dummy image
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    _, buf = cv2.imencode('.png', img)
    # Mocking the werkzeug FileStorage object is annoying, so let's just use request.environ
    from werkzeug.datastructures import FileStorage
    
    request.files.add('image', FileStorage(stream=io.BytesIO(buf.tobytes()), filename='test.png', content_type='image/png'))
    try:
        encrypt()
    except Exception as e:
        import traceback
        print(traceback.format_exc())
