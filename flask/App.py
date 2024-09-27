from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # Restrict CORS to your frontend origin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the model (ensure the path is correct)
try:
    model = load_model('model.h5', compile=False)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise e

# Define the class labels corresponding to the model's output
class_labels = [
    'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa',
    'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'bisibelebath','boondi', 'butter_chicken',
    'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka',
    'chicken_tikka_masala', 'chikki','cupcakes', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
    'donut','doodhpak', 'double_ka_meetha', 'dum_aloo','dumpling','french_fries','fried_rice', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun','idly', 'imarti',
    'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta',
    'kathi_roll','kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha', 'lyangcha', 'maach_jhol','macarons', 'makki_di_roti_sarson_da_saag',
    'malapua','meduvadai', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma','noodles','omelette' ,'palak_paneer',
    'pancake','paneer_butter_masala', 'phirni', 'pithe','pizza', 'poha', 'poori','poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri',
    'ras_malai', 'rasgulla','samosa', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa',
    'sohan_papdi', 'sutar_feni','tandoori_chicken', 'unni_appam','upma','vadapav'
]

def preprocess_image(image):
    try:
        image = image.resize((224, 224))  # Resize to match the input size of the model
        image = np.array(image) / 255.0   # Normalize pixel values
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logger.error(f"Error in preprocessing image: {e}")
        return None

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        logger.warning("No image part in the request.")
        return jsonify({'error': 'No image provided.'}), 400

    file = request.files['image']

    if file.filename == '':
        logger.warning("No selected file.")
        return jsonify({'error': 'No selected image.'}), 400

    try:
        image = Image.open(file).convert('RGB')  # Ensure image is in RGB format
    except Exception as e:
        logger.error(f"Error opening image: {e}")
        return jsonify({'error': 'Invalid image file.'}), 400

    processed_image = preprocess_image(image)
    if processed_image is None:
        return jsonify({'error': 'Error processing image.'}), 500

    try:
        # Predict the class of the image
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=-1)[0]  # Get the index of the highest probability

        # Validate predicted_class index
        if predicted_class >= len(class_labels):
            logger.error(f"Predicted class index {predicted_class} out of range.")
            return jsonify({'error': 'Prediction out of range.'}), 500

        # Get the label corresponding to the predicted class index
        predicted_label = class_labels[predicted_class-1]

        # Log the predicted label
        logger.info(f"Predicted label: {predicted_label}")

        # Return the result as JSON
        return jsonify({
            'predicted_class': int(predicted_class),
            'predicted_label': predicted_label
        })
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({'error': 'Prediction failed.'}), 500

if __name__ == '__main__': 
    app.run(debug=True, host='0.0.0.0')
