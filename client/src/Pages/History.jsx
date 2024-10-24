import React, { useContext, useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import { userContext } from "../../context/userContext";

function History() {
    const { user } = useContext(userContext);
    const [predictedFoods, setPredictedFoods] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null); // To track which food is expanded

    const showPredictedFood = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/users/show-prediction?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            if (result.error) {
                console.error(result.error);
            } else {
                console.log('Displayed:', result.predicted_value);
                setPredictedFoods(result.predicted_value); // Save the predicted food items in state
            }
        } catch (error) {
            console.error('Error displaying prediction:', error);
        }
    };

    // Using useEffect to call the function when the component mounts
    useEffect(() => {
        if (user && user.id) {
            showPredictedFood(user.id); // Call the function only if user exists
        }
    }, [user]); // This ensures the effect runs only when `user` changes

    // Function to toggle the expanded state for each food
    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index); // Toggle the expanded state
    };

    return (
        <>
            <Navbar />
            <div className="pt-16">
                {!!user && user.fullName && (
                    <h2 className="text-center text-xl mt-4">Hi {user.fullName}!</h2>
                )}

                <div className="mt-8 mx-auto max-w-4xl px-4">
                    <h3 className="text-2xl font-bold mb-4 text-center">Your Predicted Foods</h3>

                    {predictedFoods.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {predictedFoods.map((food, index) => (
                                <li
                                    key={index}
                                    className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                                    onClick={() => toggleExpand(index)} // Toggle expand on click
                                >
                                    <div className="text-lg font-semibold text-gray-700">
                                        {food.food_name} {/* Display food name */}
                                    </div>

                                    {expandedIndex === index && (
                                        <div className="mt-4 text-sm text-gray-600">
                                            {/* Show ingredient and recipe when clicked */}
                                            {/* <p><strong>Ingredients:</strong> {food.ingredient}</p> */}
                                            <p className="mt-2"><strong>Recipe:</strong> {food.recipe}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">No predictions found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default History;
