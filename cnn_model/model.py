import cv2
import numpy as np
import tensorflow as tf

model = tf.saved_model.load('cnn_model')

# Function to preprocess input image
def preprocess_image(image_path):
    img_size= (192,192,3)
    return np.asarray(cv2.resize(cv2.imread(image_path, cv2.IMREAD_COLOR), img_size[0:2])[:, :, ::-1])
    

# Example image path
image_path = 'herpes-type-1-primary-30.jpg'

# Define image size expected by the model
# img_size = (192,192)

# Preprocess the image
input_image = preprocess_image(image_path)

# Perform prediction
predictions = model(tf.constant(input_image[None, ...], dtype=tf.float32))

print(predictions)

# Load class names if needed
class_names = ['Acne', 'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions', 'Light Diseases and Disorders of Pigmentation', 'Ringworm, Warts Molluscum and other Viral Infections']
# Get the predicted class index
predicted_class_index = np.argmax(predictions)
print(predicted_class_index)
predicted_class_name = class_names[predicted_class_index]

print(f'Prediction: {predicted_class_name}')
