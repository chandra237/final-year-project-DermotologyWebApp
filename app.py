from flask import Flask, request, jsonify
import cv2
import os
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth


app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK with your service account credentials
cred = credentials.Certificate("serviceAccountKey.json")  # Path to your service account key file
firebase_admin.initialize_app(cred)

# Load your machine learning model
saved_model_dir = 'cnn_model'
model = tf.saved_model.load(saved_model_dir)

# Define a function to process the image using the loaded model
def process_image(image):
    img_size= (192,192,3)
    return np.asarray(cv2.resize(cv2.imread(image, cv2.IMREAD_COLOR), img_size[0:2])[:, :, ::-1])

# Define a route to handle image uploads
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    
    # Save the image temporarily
    image_path = 'temp_image.jpg'
    image_file.save(image_path)
    
    # Process the image using the loaded model
    input_image = process_image(image_path)
    predictions = model(tf.constant(input_image[None, ...], dtype=tf.float32))

    # Load class names if needed
    class_names = ['Acne', 'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions', 'Light Diseases and Disorders of Pigmentation', 'Ringworm', 'Warts Molluscum and other Viral Infections']
    # Get the predicted class index
    predicted_class_index = np.argmax(predictions)
    print(predicted_class_index)
    result = class_names[predicted_class_index]
    
    # Remove the temporary image file
    os.remove(image_path)
    
    return jsonify({'prediction': result}), 200

@app.route('/get_user_ids', methods=['GET'])
def get_user_ids():
    try:
        # Retrieve all user records from Firebase Authentication
        user_records = auth.list_users()
        user_ids = [user.uid for user in user_records.users]
        return jsonify({'user_ids': user_ids}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

