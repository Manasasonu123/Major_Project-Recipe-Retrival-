// userController.js

const UserModel = require('../models/user');

// Function to add a prediction to a user's predicted_food
const addPrediction = async (req, res) => {
    const { userId, predictedLabel } = req.body; // Expecting userId and predictedLabel in the request body

    
    if(!predictedLabel){
        return res.status(400).json({ message: 'predicted required.' }); 
    }
    if(!userId){
        return res.status(400).json({ message: 'User ID required.' }); 
    }
   
    
    if (!userId || !predictedLabel) {
        return res.status(400).json({ message: 'User ID and predicted label are required.' });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add the predicted label to the user's predicted_food array
        user.predicted_food.push(predictedLabel);
        await user.save();

        return res.status(200).json({ message: 'Prediction added successfully.', predicted_food: user.predicted_food });
    } catch (error) {
        console.error('Error adding prediction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { addPrediction };
