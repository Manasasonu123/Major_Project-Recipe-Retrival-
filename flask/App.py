# from flask import Flask, request, jsonify
# import tensorflow as tf
# from tensorflow.keras.models import load_model
# from PIL import Image
# import numpy as np
# from flask_cors import CORS
# import logging

# app = Flask(__name__)
# CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # Restrict CORS to your frontend origin

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load the model (ensure the path is correct)
# try:
#     model = load_model('model.h5', compile=False)
#     logger.info("Model loaded successfully.")
# except Exception as e:
#     logger.error(f"Error loading model: {e}")
#     raise e

# # Define the class labels corresponding to the model's output
# class_labels = [
#     'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa',
#     'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'bisibelebath','boondi', 'butter_chicken',
#     'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka',
#     'chicken_tikka_masala', 'chikki','cupcakes', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
#     'donut','doodhpak', 'double_ka_meetha', 'dum_aloo','dumpling','french_fries','fried_rice', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun','idly', 'imarti',
#     'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta',
#     'kathi_roll','kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha', 'lyangcha', 'maach_jhol','macarons', 'makki_di_roti_sarson_da_saag',
#     'malapua','meduvadai', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma','noodles','omelette' ,'palak_paneer',
#     'pancake','paneer_butter_masala', 'phirni', 'pithe','pizza', 'poha', 'poori','poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri',
#     'ras_malai', 'rasgulla','samosa', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa',
#     'sohan_papdi', 'sutar_feni','tandoori_chicken', 'unni_appam','upma','vadapav'
# ]

# def preprocess_image(image):
#     try:
#         image = image.resize((224, 224))  # Resize to match the input size of the model
#         image = np.array(image) / 255.0   # Normalize pixel values
#         return np.expand_dims(image, axis=0)
#     except Exception as e:
#         logger.error(f"Error in preprocessing image: {e}")
#         return None

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         logger.warning("No image part in the request.")
#         return jsonify({'error': 'No image provided.'}), 400

#     file = request.files['image']

#     if file.filename == '':
#         logger.warning("No selected file.")
#         return jsonify({'error': 'No selected image.'}), 400

#     try:
#         image = Image.open(file).convert('RGB')  # Ensure image is in RGB format
#     except Exception as e:
#         logger.error(f"Error opening image: {e}")
#         return jsonify({'error': 'Invalid image file.'}), 400

#     processed_image = preprocess_image(image)
#     if processed_image is None:
#         return jsonify({'error': 'Error processing image.'}), 500

#     try:
#         # Predict the class of the image
#         prediction = model.predict(processed_image)
#         predicted_class = np.argmax(prediction, axis=-1)[0]  # Get the index of the highest probability

#         # Validate predicted_class index
#         if predicted_class >= len(class_labels):
#             logger.error(f"Predicted class index {predicted_class} out of range.")
#             return jsonify({'error': 'Prediction out of range.'}), 500

#         # Get the label corresponding to the predicted class index
#         predicted_label = class_labels[predicted_class-1]

#         # Log the predicted label
#         logger.info(f"Predicted label: {predicted_label}")

#         # Return the result as JSON
#         return jsonify({
#             'predicted_class': int(predicted_class),
#             'predicted_label': predicted_label
#         })
#     except Exception as e:
#         logger.error(f"Error during prediction: {e}")
#         return jsonify({'error': 'Prediction failed.'}), 500

# if __name__ == '__main__': 
#     app.run(debug=True, host='0.0.0.0')

###########################################################################################################################################################


# from flask import Flask, request, jsonify
# import tensorflow as tf
# from tensorflow.keras.models import load_model
# from PIL import Image
# import numpy as np
# from flask_cors import CORS

# import logging
# import requests
# from bs4 import BeautifulSoup

# app = Flask(__name__)
# # CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # Adjust for frontend origin
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load the model (ensure the path is correct)
# try:
#     model = load_model('model.h5', compile=False)
#     logger.info("Model loaded successfully.")
# except Exception as e:
#     logger.error(f"Error loading model: {e}")
#     raise e

# # Define the class labels corresponding to the model's output
# class_labels = [
#     'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa',
#     'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'bisibelebath', 'boondi', 'butter_chicken',
#     'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka',
#     'chicken_tikka_masala', 'chikki', 'cupcakes', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
#     'donut', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'dumpling', 'french_fries', 'fried_rice', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun', 'idly', 'imarti',
#     'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta',
#     'kathi_roll', 'kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha', 'lyangcha', 'maach_jhol', 'macarons', 'makki_di_roti_sarson_da_saag',
#     'malapua', 'meduvadai', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma', 'noodles', 'omelette', 'palak_paneer',
#     'pancake', 'paneer_butter_masala', 'phirni', 'pithe', 'pizza', 'poha', 'poori', 'poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri',
#     'ras_malai', 'rasgulla', 'samosa', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa',
#     'sohan_papdi', 'sutar_feni', 'tandoori_chicken', 'unni_appam', 'upma', 'vadapav'
# ]

# def preprocess_image(image):
#     try:
#         image = image.resize((224, 224))  # Resize to match the input size of the model
#         image = np.array(image) / 255.0   # Normalize pixel values
#         return np.expand_dims(image, axis=0)
#     except Exception as e:
#         logger.error(f"Error in preprocessing image: {e}")
#         return None

# # Route for predicting only the food name
# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         logger.warning("No image part in the request.")
#         return jsonify({'error': 'No image provided.'}), 400

#     file = request.files['image']

#     if file.filename == '':
#         logger.warning("No selected file.")
#         return jsonify({'error': 'No selected image.'}), 400

#     try:
#         image = Image.open(file).convert('RGB')  # Ensure image is in RGB format
#     except Exception as e:
#         logger.error(f"Error opening image: {e}")
#         return jsonify({'error': 'Invalid image file.'}), 400

#     processed_image = preprocess_image(image)
#     if processed_image is None:
#         return jsonify({'error': 'Error processing image.'}), 500

#     try:
#         # Predict the class of the image
#         prediction = model.predict(processed_image)
#         predicted_class = np.argmax(prediction, axis=-1)[0]  # Get the index of the highest probability

#         # Validate predicted_class index
#         if predicted_class >= len(class_labels):
#             logger.error(f"Predicted class index {predicted_class} out of range.")
#             return jsonify({'error': 'Prediction out of range.'}), 500

#         # Get the label corresponding to the predicted class index
#         predicted_label = class_labels[predicted_class-1]

#         # Log the predicted label
#         logger.info(f"Predicted label: {predicted_label}")

#         # Return the result as JSON
#         return jsonify({
#             'predicted_class': int(predicted_class),
#             'predicted_label': predicted_label
#         })
#     except Exception as e:
#         logger.error(f"Error during prediction: {e}")
#         return jsonify({'error': 'Prediction failed.'}), 500

# # Web scraping function to find the recipe URL
# def scrape_recipe(food_name):
#     base_url = f'https://www.indianhealthyrecipes.com/?s={food_name}'
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.101 Safari/537.36',
#         'Accept-Language': 'en-US,en;q=0.9',
#         'Accept-Encoding': 'gzip, deflate, br',
#         'Connection': 'keep-alive',
#         'Referer': 'https://www.indianhealthyrecipes.com/'
#     }

#     try:
#         response = requests.get(base_url, headers=headers)
#         response.raise_for_status()

#         soup = BeautifulSoup(response.content, 'html.parser')
#         first_recipe_link = soup.select_one('div#archive-container article.entry h2.entry-title a')

#         if first_recipe_link and 'href' in first_recipe_link.attrs:
#             recipe_url = first_recipe_link['href']
#             return recipe_url
#         else:
#             return None
#     except requests.exceptions.RequestException as e:
#         logger.error(f"Error fetching the URL: {e}")
#         return None

# # Web scraping function to extract instructions from the recipe page
# def scrape_individual_recipe(recipe_url):
#     try:
#         response = requests.get(recipe_url)
#         response.raise_for_status()

#         soup = BeautifulSoup(response.content, 'html.parser')

#         # Find the section of the recipe that contains the 'Photo Guide' to 'Related Recipes'
#         # You may need to adjust the selectors based on the actual HTML structure
#         photo_guide = soup.find(text=re.compile("Photo Guide"))
#         related_recipes = soup.find(text=re.compile("Related Recipes"))

#         if photo_guide and related_recipes:
#             # Extract the text between the two sections
#             instructions = []
#             current = photo_guide.find_next()
#             while current and current != related_recipes:
#                 instructions.append(current.get_text(strip=True))
#                 current = current.find_next()

#             return "\n".join(instructions)  # Return as a single string
#         else:
#             return "No instructions found."
#     except requests.exceptions.RequestException as e:
#         logger.error(f"Error fetching the recipe page: {e}")
#         return "Error fetching the recipe page."

# # Route for prediction and web scraping
# @app.route('/predict-and-scrape', methods=['POST'])
# def predict_and_scrape():
#     if 'image' not in request.files:
#         logger.warning("No image part in the request.")
#         return jsonify({'error': 'No image provided.'}), 400

#     file = request.files['image']

#     if file.filename == '':
#         logger.warning("No selected file.")
#         return jsonify({'error': 'No selected image.'}), 400

#     try:
#         image = Image.open(file).convert('RGB')  # Ensure image is in RGB format
#     except Exception as e:
#         logger.error(f"Error opening image: {e}")
#         return jsonify({'error': 'Invalid image file.'}), 400

#     processed_image = preprocess_image(image)
#     if processed_image is None:
#         return jsonify({'error': 'Error processing image.'}), 500

#     try:
#         # Predict the class of the image
#         prediction = model.predict(processed_image)
#         predicted_class = np.argmax(prediction, axis=-1)[0]

#         if predicted_class >= len(class_labels):
#             logger.error(f"Predicted class index {predicted_class} out of range.")
#             return jsonify({'error': 'Prediction out of range.'}), 500

#         predicted_label = class_labels[predicted_class-1]
#         logger.info(f"Predicted label: {predicted_label}")

#         # Perform web scraping using the predicted label
#         recipe_url = scrape_recipe(predicted_label)

#         if recipe_url:
#             # Call the function to scrape the specific instructions
#             instructions = scrape_individual_recipe(recipe_url)
#             return jsonify({
#                 'predicted_class': int(predicted_class),
#                 'predicted_label': predicted_label,
#                 'recipe_url': recipe_url,
#                 'instructions': instructions
#             })
#         else:
#             return jsonify({
#                 'predicted_class': int(predicted_class),
#                 'predicted_label': predicted_label,
#                 'recipe_url': 'No recipe found.'
#             })
#     except Exception as e:
#         logger.error(f"Error during prediction and scraping: {e}")
#         return jsonify({'error': 'Prediction and scraping failed.'}), 500

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS

import logging
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

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
    'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'bisibelebath', 'boondi', 'butter_chicken',
    'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka',
    'chicken_tikka_masala', 'chikki', 'cupcakes', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
    'donut', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'dumpling', 'french_fries', 'fried_rice', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun', 'idly', 'imarti',
    'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta',
    'kathi_roll', 'kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha', 'lyangcha', 'maach_jhol', 'macarons', 'makki_di_roti_sarson_da_saag',
    'malapua', 'meduvadai', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma', 'noodles', 'omelette', 'palak_paneer',
    'pancake', 'paneer_butter_masala', 'phirni', 'pithe', 'pizza', 'poha', 'poori', 'poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri',
    'ras_malai', 'rasgulla', 'samosa', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa',
    'sohan_papdi', 'sutar_feni', 'tandoori_chicken', 'unni_appam', 'upma', 'vadapav'
]

def preprocess_image(image):
    try:
        image = image.resize((224, 224))  # Resize to match the input size of the model
        image = np.array(image) / 255.0   # Normalize pixel values
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logger.error(f"Error in preprocessing image: {e}")
        return None

# Route for predicting only the food name
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
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=-1)[0]  # Get the index of the highest probability

        if predicted_class >= len(class_labels):
            logger.error(f"Predicted class index {predicted_class} out of range.")
            return jsonify({'error': 'Prediction out of range.'}), 500

        predicted_label = class_labels[predicted_class-1]
        logger.info(f"Predicted label: {predicted_label}")

        return jsonify({
            'predicted_class': int(predicted_class),
            'predicted_label': predicted_label
        })
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({'error': 'Prediction failed.'}), 500

# Web scraping function to search for a recipe on Sanjeev Kapoor's website
def search_recipe(recipe_name):
    search_url = f"https://www.sanjeevkapoor.com/search?title={recipe_name}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the first search result
        first_result = soup.find('div', class_='life_title').find('a')
        if first_result:
            recipe_url = "https://www.sanjeevkapoor.com" + first_result['href']
            return recipe_url
        else:
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching the URL: {e}")
        return None

# Web scraping function to extract instructions from Sanjeev Kapoor's recipe page
def scrape_recipe(recipe_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    try:
        response = requests.get(recipe_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract recipe name
        #recipe_name = soup.find('h1').get_text() if soup.find('h1') else "Recipe name not found"

        # Extract ingredients
        ingredients_section = soup.find('h2', string='Ingredients')

        # If it's not found, try to find the section with 'Ingredient'
        if not ingredients_section:
            ingredients_section = soup.find('h2', string='Ingredient')
        ingredients_list = []
        if ingredients_section:
            ingredients = ingredients_section.find_next('ul').find_all('li')
            ingredients_list = [ingredient.get_text() for ingredient in ingredients]

        # Extract method
        method_section = soup.find('h2', text='Method')
        method_steps = []
        if method_section:
            steps = method_section.find_next('ol').find_all('li')
            method_steps = [step.get_text() for step in steps]

        return {
            #'recipe_name': recipe_name,
            'ingredients': ingredients_list,
            'method': method_steps
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching the recipe page: {e}")
        return "Error fetching the recipe page."

# Route for prediction and web scraping
@app.route('/predict-and-scrape', methods=['POST'])
def predict_and_scrape():
    if 'image' not in request.files:
        logger.warning("No image part in the request.")
        return jsonify({'error': 'No image provided.'}), 400

    file = request.files['image']

    if file.filename == '':
        logger.warning("No selected file.")
        return jsonify({'error': 'No selected image.'}), 400

    try:
        image = Image.open(file).convert('RGB')
    except Exception as e:
        logger.error(f"Error opening image: {e}")
        return jsonify({'error': 'Invalid image file.'}), 400

    processed_image = preprocess_image(image)
    if processed_image is None:
        return jsonify({'error': 'Error processing image.'}), 500

    try:
        # Predict the class of the image
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=-1)[0]

        if predicted_class >= len(class_labels):
            logger.error(f"Predicted class index {predicted_class} out of range.")
            return jsonify({'error': 'Prediction out of range.'}), 500

        predicted_label = class_labels[predicted_class-1]
        logger.info(f"Predicted label: {predicted_label}")

        # Perform web scraping using the predicted label
        recipe_url = search_recipe(predicted_label)

        if recipe_url:
            # Call the function to scrape the specific recipe
            recipe_details = scrape_recipe(recipe_url)
            return jsonify({
                'predicted_class': int(predicted_class),
                'predicted_label': predicted_label,
                'recipe_url': recipe_url,
                'recipe_details': recipe_details
            })
        else:
            return jsonify({
                'predicted_class': int(predicted_class),
                'predicted_label': predicted_label,
                'recipe_url': 'No recipe found.'
            })
    except Exception as e:
        logger.error(f"Error during prediction and scraping: {e}")
        return jsonify({'error': 'Prediction and scraping failed.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
