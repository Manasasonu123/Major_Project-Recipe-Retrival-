from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS
import logging
import requests
from bs4 import BeautifulSoup
from keras.models import Model
from keras.preprocessing.image import load_img, img_to_array
from keras.applications.vgg16 import preprocess_input
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the model (ensure the path is correct)
try:
    food_model = load_model('model.h5', compile=False)
    related_food_model = load_model('vgg16_modelfeatures.h5', compile=False)
    logger.info("Models loaded successfully.")
except Exception as e:
    logger.error(f"Error loading models: {e}")
    raise e

# Load the recipe embeddings and training names
recipe_embeddings = np.loadtxt('recipe_embds205.txt')
with open('training_names.txt', 'r') as f:
    training_names = [line.strip() for line in f]


# Define the class labels corresponding to the model's output
class_labels = [
    'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa',
    'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'bisibelebath', 'boondi', 'butter_chicken',
    'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka',
    'chicken_tikka_masala', 'chikki', 'cupcakes', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
    'donut', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'dumpling', 'french_fries', 'fried_rice', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun', 'idly', 'imarti',
    'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta',
    'kathi_roll', 'kofta', 'kuzhi_paniyaram', 'lassi', 'gulab jamun', 'litti_chokha', 'lyangcha', 'maach_jhol', 'macarons', 'makki_di_roti_sarson_da_saag',
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

# Web scraping function to search for a recipe on Hebbar's Kitchen website
def search_recipe(food_name):
    base_url = f'https://hebbarskitchen.com/?s={food_name}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }

    logger.info(f"Searching recipes from: {base_url}")

    try:
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()  # Raise an exception for failed requests

        soup = BeautifulSoup(response.content, 'html.parser')

        # Select the first recipe link from the search results
        first_recipe_link = soup.select_one('h3.entry-title a')

        if first_recipe_link and 'href' in first_recipe_link.attrs:
            recipe_url = first_recipe_link['href']
            logger.info(f"Found first recipe link: {recipe_url}")
            return recipe_url
        else:
            logger.warning(f"No recipes found for {food_name}.")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching the URL: {e}")
        return None

# Web scraping function to extract instructions from Hebbar's Kitchen recipe page
def scrape_recipe(recipe_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }

    try:
        response = requests.get(recipe_url, headers=headers)
        response.raise_for_status()  # Raise an exception for failed requests

        soup = BeautifulSoup(response.content, 'html.parser')

        # Scrape ingredients
        ingredients = []
        ingredient_sections = soup.select('div.wprm-recipe-ingredient-group')
        for section in ingredient_sections:
            group_name = section.select_one('h4.wprm-recipe-group-name')
            if group_name:
                ingredients.append(group_name.get_text(strip=True))
            ingredient_items = section.select('li.wprm-recipe-ingredient')
            for item in ingredient_items:
                amount = item.select_one('.wprm-recipe-ingredient-amount')
                unit = item.select_one('.wprm-recipe-ingredient-unit')
                name = item.select_one('.wprm-recipe-ingredient-name')
                ingredients.append(f"{amount.get_text(strip=True) if amount else ''} {unit.get_text(strip=True) if unit else ''} {name.get_text(strip=True)}")

        # Scrape instructions
        instructions = []
        instruction_items = soup.select('div.wprm-recipe-instruction-group ul li.wprm-recipe-instruction')
        for i, instruction in enumerate(instruction_items, start=1):
            instructions.append(f"{i}. {instruction.get_text(strip=True)}")

        return {
            'ingredients': ingredients,
            'method': instructions
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching the recipe URL: {e}")
        return None

#Web scraping function to search for a related food image

def search_food_image(food_name):
    # Set up Selenium with ChromeDriver
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run headless for background execution
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Provide the path to your ChromeDriver executable
    driver_service = Service('path_to_chromedriver')  # Update with your ChromeDriver path
    driver = webdriver.Chrome(service=driver_service, options=chrome_options)

    try:
        # Perform Google search and navigate to the Images tab
        search_url = f"https://www.google.com/search?tbm=isch&q={food_name}"
        driver.get(search_url)

        # Wait for the images to load
        time.sleep(2)

        # Get the first image result by locating the image elements
        image_elements = driver.find_elements(By.CSS_SELECTOR, 'img')

        if image_elements:
            first_image_url = image_elements[1].get_attribute('src')  # Skip the first one as it's the Google logo
            return first_image_url
        else:
            return "No image found."

    finally:
        driver.quit()


# Function to get related food names using cosine similarity
def get_related_food_names(image):
    img_array = preprocess_input(img_to_array(image.resize((224, 224))))
    img_array = np.expand_dims(img_array, axis=0)
    feat_extractor = Model(inputs=related_food_model.input, outputs=related_food_model.get_layer("fc2").output)
    test_features = feat_extractor.predict(img_array)[0]

    similarity_scores = []
    for ingr in recipe_embeddings:
        dot = np.dot(test_features, ingr)
        norma = np.linalg.norm(test_features)
        normb = np.linalg.norm(ingr)
        cos = dot / (norma * normb)
        similarity_scores.append(cos)

    top_recipe_idx = sorted(range(len(similarity_scores)), key=lambda idx: similarity_scores[idx], reverse=True)

    seen_recipes = set()
    unique_top_recipes = []
    for idx in top_recipe_idx:
        recipe_name = training_names[idx]
        base_recipe_name = recipe_name.split('/')[0]
        if base_recipe_name not in seen_recipes:
            seen_recipes.add(base_recipe_name)
            unique_top_recipes.append(base_recipe_name)
        if len(unique_top_recipes) >= 5:  # Limit to top 10 related foods
            break
    return unique_top_recipes


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
        prediction = food_model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=-1)[0]

        if predicted_class >= len(class_labels):
            logger.error(f"Predicted class index {predicted_class} out of range.")
            return jsonify({'error': 'Prediction out of range.'}), 500

        predicted_label = class_labels[predicted_class - 1]
        logger.info(f"Predicted label: {predicted_label}")

        # Perform web scraping for the recipe URL
        recipe_url = search_recipe(predicted_label)
        recipe_details = scrape_recipe(recipe_url) if recipe_url else {'recipe_url': 'No recipe found.'}

        # Get related food names and their images
        related_foods = get_related_food_names(image)
        related_food_list = []
        
        for food in related_foods:
            image_url = search_food_image(food)  # Get food image
            related_food_list.append({
                'recipe_name': food,
                'image_url': image_url
            })

        return jsonify({
            'predicted_class': int(predicted_class),
            'recipe_url': recipe_url,
            'predicted_label': predicted_label,
            'recipe_details': recipe_details,
            'related_foods': related_food_list
        })

    except Exception as e:
        logger.error(f"Error during prediction and scraping: {e}")
        return jsonify({'error': 'Prediction and scraping failed.'}), 500


if __name__ == '__main__':
    app.run(debug=True)