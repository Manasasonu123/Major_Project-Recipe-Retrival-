const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for predicted food items
const predictedFoodSchema = new Schema({
    food_name: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    }
});

// User schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    predicted_value: [predictedFoodSchema] // Array of predicted food objects
});

// Create the User model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
