const UserModel = require('../models/user');

// Function to add a prediction to a user's predicted_value
const addPrediction = async (req, res) => {
    const { userId, food_name, recipe } = req.body; // Expecting userId, food_name, ingredient, and recipe in the request body

    // Check if all required fields are provided
    if (!food_name ||  !recipe) {
        return res.status(400).json({ message: 'Food name, ingredient, and recipe are required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID required.' });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add the predicted food object to the user's predicted_value array
        user.predicted_value.push({
            food_name,   // Add food_name
            recipe       // Add recipe
        });

        // Save the updated user data
        await user.save();

        return res.status(200).json({ message: 'Prediction added successfully.', predicted_value: user.predicted_value });
    } catch (error) {
        console.error('Error adding prediction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Function to show predictions of a user
const showPrediction = async (req, res) => {
    const { userId } = req.query; // Extract userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'User ID required.' });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Retrieve the predicted_value array from the user document
        const predictedValue = user.predicted_value;

        // Return the predicted food details
        return res.status(200).json({ message: 'Success', predicted_value: predictedValue });
    } catch (error) {
        console.error('Error displaying foods:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { addPrediction, showPrediction };
