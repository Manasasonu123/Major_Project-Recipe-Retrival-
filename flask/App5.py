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
from tensorflow.keras.applications import InceptionV3
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras import regularizers


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models = {}

class_names = {
    1: 'adhirasam',
    2: 'aloo baida',
    3: 'aloo chaat',
    4: 'aloo chokha',
    5: 'aloo gajar',
    6: 'aloo gobi',
    7: 'aloo kachori',
    8: 'aloo matar',
    9: 'aloo methi',
    10: 'aloo shimla mirch',
    11: 'aloo tikki',
    12: 'anarsa',
    13: 'apple crisp',
    14: 'apple pie',
    15: 'apricot chutney',
    16: 'ariselu',
    17: 'arugula salad',
    18: 'authentic jamaican curry chicken',
    19: 'baby back ribs',
    20: 'baked ziti',
    21: 'baklava',
    22: 'balsamic chicken',
    23: 'bandar laddu',
    24: 'basundi',
    25: 'beet salad',
    26: 'beetroot paratha',
    27: 'bhatura',
    28: 'bhindi masala',
    29: 'bibimbap',
    30: 'biryani',
    31: 'bisi bele bath',
    32: 'bisibelebath',
    33: 'bombay sandwich',
    34: 'boondi',
    35: 'brownie',
    36: 'burger',
    37: 'butter chicken',
    38: 'chak hao kheer',
    39: 'cham cham',
    40: 'chana masala',
    41: 'chapati',
    42: 'chhena kheeri',
    43: 'chicken chettinad',
    44: 'chicken curry',
    45: 'chicken razala',
    46: 'chicken tikka',
    47: 'chicken tikka_masala',
    48: 'chicken wings',
    49: 'chikki',
    50: 'chocolate burfi',
    51: 'chocolate cake',
    52: 'chow chow bath',
    53: 'churros',
    54: 'clam chowder',
    55: 'club sandwich',
    56: 'coconut chutney',
    57: 'corn soup',
    58: 'creme brulee',
    59: 'croissant',
    60: 'cup cakes',
    61: 'curry mussels',
    62: 'daal baati churma',
    63: 'daal puri',
    64: 'dal makhani',
    65: 'dal_tadka',
    66: 'deviled eggs',
    67: 'dharwad pedha',
    68: 'donuts',
    69: 'doodhpak',
    70: 'dosa',
    71: 'double ka meetha',
    72: 'dum aloo',
    73: 'dumplings',
    74: 'edamame',
    75: 'egg bhurji',
    76: 'egg roll',
    77: 'escargots',
    78: 'falafel',
    79: 'french fries',
    80: 'french onion soup',
    81: 'french toast',
    82: 'fried rice',
    83: 'frozen yogurt',
    84: 'gajar ka halva',
    85: 'garlic bread',
    86: 'gavvalu',
    87: 'ghever',
    88: 'gnocchi',
    89: 'goan fish curry',
    90: 'gobi 65',
    91: 'greek salad',
    92: 'green curry chicken_salad',
    93: 'grilled cheese sandwich',
    94: 'grilled salmon',
    95: 'guacamole',
    96: 'gulab jamun',
    97: 'hamburger',
    98: 'hot and sour soup',
    99: 'hot dog',
    100: 'huevos rancheros',
    101: 'hummus',
    102: 'ice cream',
    103: 'idly',
    104: 'imarti',
    105: 'jalebi',
    106: 'kachori',
    107: 'kadai egg',
    108: 'kadai paneer',
    109: 'kadhi pakoda',
    110: 'kajjikaya',
    111: 'kaju katli kaju barfi',
    112: 'kakinada khaja',
    113: 'kalakand',
    114: 'karela bharta',
    115: 'kathi roll',
    116: 'kofta',
    117: 'kulfi',
    118: 'kuzhi paniyaram',
    119: 'lasagna',
    120: 'lassi',
    121: 'ledikeni',
    122: 'litti chokha',
    123: 'lyangcha',
    124: 'maach jhol',
    125: 'macaroni and cheese',
    126: 'macarons',
    127: 'makki di roti sarson da saag',
    128: 'malabar parotta',
    129: 'malapua',
    130: 'mango lassi',
    131: 'masala tea chai',
    132: 'meduvadai',
    133: 'misi roti',
    134: 'miso soup',
    135: 'misti doi',
    136: 'modak',
    137: 'mussels',
    138: 'mysore pak',
    139: 'naan',
    140: 'nachos',
    141: 'navrattan korma',
    142: 'noodles',
    143: 'omelette',
    144: 'onion rings',
    145: 'oysters',
    146: 'pad thai',
    147: 'paella',
    148: 'palak paneer',
    149: 'pancakes',
    150: 'paneer butter masala',
    151: 'paneer kulcha',
    152: 'paneer pakora',
    153: 'panna cotta',
    154: 'pasta',
    155: 'pathiri',
    156: 'phirni',
    157: 'pho',
    158: 'pizza',
    159: 'poha',
    160: 'poori',
    161: 'poornalu',
    162: 'pootharekulu',
    163: 'pulled pork sandwich',
    164: 'qubani ka meetha',
    165: 'rabri',
    166: 'ragi mudde ragi sankati',
    167: 'ramen',
    168: 'ras malai',
    169: 'rasgulla',
    170: 'ravioli',
    171: 'red velvet cake',
    172: 'risotto',
    173: 'samosa',
    174: 'sandesh',
    175: 'sashimi',
    176: 'scallops',
    177: 'seaweed salad',
    178: 'shankarpali',
    179: 'shawarma',
    180: 'sheer korma',
    181: 'sheera',
    182: 'shrikhand',
    183: 'shrimp and grits',
    184: 'slow cooker lamb curry',
    185: 'sohan halwa',
    186: 'sohan papdi',
    187: 'sorpotel',
    188: 'spaghetti carbonara',
    189: 'spinach wrap',
    190: 'spring rolls',
    191: 'strawberry shortcake',
    192: 'stuffed mirchi mirapakaya bajji',
    193: 'surti undhiyu',
    194: 'sushi',
    195: 'sutar feni',
    196: 'tacos',
    197: 'tandoori chicken',
    198: 'tawa paneer',
    199: 'tiramisu',
    200: 'tomato uttapam',
    201: 'unni appam',
    202: 'upma',
    203: 'vada pav',
    204: 'waffles'
}

# Load the recipe embeddings and training names
recipe_embeddings = np.loadtxt('recipe_embds205.txt')
with open('training_names.txt', 'r') as f:
    training_names = [line.strip() for line in f]

# Define dataset and model parameters
img_width, img_height = 200, 200


def load_inception_model():
    # Load and modify the InceptionV3 model
    inception = InceptionV3(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))
    layer = inception.output
    layer = GlobalAveragePooling2D()(layer)
    layer = Dense(128, activation='relu')(layer)
    layer = Dropout(0.3)(layer)

    # Output layer for 205 classes
    predictions = Dense(205, kernel_regularizer=regularizers.l2(0.005), activation='softmax')(layer)

    # Create the model
    model = Model(inputs=inception.input, outputs=predictions)

    # Load the best weights from the checkpoint
    model.load_weights('best_weights_205attempt5class.weights.h5')
    
    return model


def preprocess_image(image):
    try:
        image = image.resize((200, 200))  # Resize to match the input size of the model
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

# Function to get related food names using cosine similarity
def get_related_food_names(image):
    related_food_model=models['related_food']
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
    logger.info(f"top related recipes: {unique_top_recipes}")
    return unique_top_recipes

def get_recipe_images(recipe_names):
    images = []
    for recipe in recipe_names:
        # Format the recipe name for search
        query = recipe.replace("_", "+")
        url = f"https://hebbarskitchen.com/?s={query}"  # Example website
        
        # logger.info(f"Scraping URL: {url}")  # Add this print to debug

        try:
        # Scraping logic
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Assuming images are inside an 'img' tag (you can customize this based on the actual site)
            img_tag = soup.find('span', class_='entry-thumb td-thumb-css')  # Replace with the specific tag/class from the site you're scraping
            # logger.info(f"Scraped tag: {img_tag}")

            if img_tag and 'background-image' in img_tag.get('style', ''):
                # Extracting the URL from the 'background-image' style attribute
                style_attr = img_tag['style']
                img_url = style_attr.split('url(')[-1].split(')')[0].strip('"')
                images.append(img_url)
                # logger.info(f"Found image URL: {img_url}")
            else:
                # If no image found, append a default image URL
                images.append("https://via.placeholder.com/150")  # Replace with a default placeholder image URL
        except Exception as e:
            logger.error(f"Error fetching image for {recipe}: {e}")
            images.append("https://via.placeholder.com/150")
    logger.info(f"Final images list: {images}")
    return images  # Return the list of image URLs


# Route for predicting only the food name
@app.route('/predict', methods=['POST'])
def predict():
    model = models['inception']

    if 'image' not in request.files:
        logger.warning("No image part in the request.")
        return jsonify({'error': 'No image provided.'}), 400

    file = request.files['image']

    if file.filename == '':
        logger.warning("No selected file.")
        return jsonify({'error': 'No selected image.'}), 400

    try:
        image = Image.open(file).convert('RGB')  # Ensure image is in RGB format
        image = image.resize((img_width, img_height))  # Resize the image to match input shape
        image_array = np.array(image) / 255.0  # Normalize image
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    except Exception as e:
        logger.error(f"Error opening image: {e}")
        return jsonify({'error': 'Invalid image file.'}), 400

    processed_image = preprocess_image(image)
    if processed_image is None:
        return jsonify({'error': 'Error processing image.'}), 500

    try:
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=-1)[0]  # Get the index of the highest probability
        predicted_label = class_names.get(predicted_class, "Unknown class")
        logger.info(f"Predicted label: {predicted_label}")

        return jsonify({
            'predicted_class': int(predicted_class),
            'predicted_label': predicted_label
        })
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({'error': 'Prediction failed.'}), 500




# Route for predicting and scraping recipes
@app.route('/predict-and-scrape', methods=['POST'])
def predict_and_scrape():

    model = models['inception']

    if 'image' not in request.files:
        logger.warning("No image part in the request.")
        return jsonify({'error': 'No image provided.'}), 400
    
    file = request.files['image']

    if file.filename == '':
        logger.warning("No selected file.")
        return jsonify({'error': 'No selected image.'}), 400
    
    try:
        image = Image.open(file).convert('RGB')
        image = image.resize((img_width, img_height))  # Resize the image to match input shape
        image_array = np.array(image) / 255.0  # Normalize image
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
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
        predicted_label = class_names.get(predicted_class, "Unknown class")
        logger.info(f"Predicted label: {predicted_label}")

        # Perform web scraping using the predicted label
        recipe_url = search_recipe(predicted_label)

        if recipe_url:
            # Call the function to scrape the specific recipe
            recipe_details = scrape_recipe(recipe_url)

            # return jsonify({
            #     'predicted_class': int(predicted_class),
            #     'predicted_label': predicted_label,
            #     'recipe_url': recipe_url,
            #     'recipe_details': recipe_details
            # })
        else:
            recipe_details = {'recipe_url': 'No recipe found.'}
            # return jsonify({
            #     'predicted_class': int(predicted_class),
            #     'predicted_label': predicted_label,
            #     'recipe_url': 'No recipe found.'
            # })

        # Get related food names with similarity scores
        related_foods = get_related_food_names(image)

        # Prepare response with the related food names and their similarity scores
        if related_foods:
            related_food_list = [{'recipe_name': recipe} for recipe in related_foods]
        else:
            related_food_list = []
        
        # logger.info(f"top related recipes: {related_foods}")

        related_photo_url = get_recipe_images(related_foods)

        # logger.info(f"Final images list: {related_photo_url}")


        # logger.info(related_photo_url)
        return jsonify({
            'predicted_class': int(predicted_class),
            'recipe_url': recipe_url,
            'predicted_label': predicted_label,
            'recipe_details': recipe_details,
            'related_foods': related_food_list,
            #'related_photo_url':related_photo_url
        })
    except Exception as e:
        logger.error(f"Error during prediction and scraping: {e}")
        return jsonify({'error': 'Prediction and scraping failed.'}), 500

if __name__ == '__main__':
    # Load models once when the app starts
    models['inception'] = load_inception_model()
    models['related_food'] = load_model('vgg16_modelfeatures.h5', compile=False)
    app.run(debug=True)


