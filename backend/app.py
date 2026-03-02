from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import cv2
import numpy as np

from aes_cipher import AESCipher
from steganography import LSBSteganography

app = Flask(__name__)
# Enable CORS for the frontend React app running on a different port
CORS(app)

@app.route('/api/encrypt', methods=['POST'])
def encrypt():
    try:
        # Validate Request Let's extract the image, message, and password
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided.'}), 400
        
        file = request.files['image']
        message = request.form.get('message', '')
        password = request.form.get('password', '')

        if not message or not password:
            return jsonify({'error': 'Message and password are required.'}), 400

        # Read the file into OpenCV format
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image format.'}), 400

        # 1. Encrypt Message
        cipher = AESCipher(password)
        encrypted_bytes = cipher.encrypt(message)

        # 2. Hide Encrypted Bytes in Image
        steg = LSBSteganography()
        try:
            encoded_img = steg.encode(img, encrypted_bytes)
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400

        # 3. Return the image as PNG, avoiding compression loss
        is_success, buffer = cv2.imencode('.png', encoded_img)
        if not is_success:
            return jsonify({'error': 'Failed to encode final image.'}), 500
        
        byte_io = io.BytesIO(buffer)
        byte_io.seek(0)

        return send_file(
            byte_io,
            mimetype='image/png',
            as_attachment=True,
            download_name='encrypted-image.png'
        )

    except Exception as e:
        import traceback
        print(f"Encryption endpoint error: {traceback.format_exc()}")
        return jsonify({'error': 'An internal error occurred during encryption.'}), 500

@app.route('/api/decrypt', methods=['POST'])
def decrypt():
    try:
        # Validate Request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided.'}), 400
        
        file = request.files['image']
        password = request.form.get('password', '')

        if not password:
            return jsonify({'error': 'Password is required for decryption.'}), 400

        # Read the file into OpenCV format
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Invalid image format.'}), 400

        # 1. Extract Bytes from Image
        steg = LSBSteganography()
        try:
            encrypted_bytes = steg.decode(img)
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400

        # 2. Decrypt Bytes
        cipher = AESCipher(password)
        try:
            decrypted_message = cipher.decrypt(encrypted_bytes)
        except ValueError:
            return jsonify({'error': 'Decryption failed. Incorrect password or corrupted data.'}), 401
            
        return jsonify({'message': decrypted_message})

    except Exception as e:
        print(f"Decryption endpoint error: {str(e)}")
        return jsonify({'error': 'An internal error occurred during decryption.'}), 500

if __name__ == '__main__':
    # Run the server
    app.run(debug=True, port=5000)
