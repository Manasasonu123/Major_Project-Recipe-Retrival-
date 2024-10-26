// import React, { useContext, useEffect, useState } from 'react';
// import Navbar from "../Components/Navbar";
// import { userContext } from "../../context/userContext";

// function History() {
//     const { user } = useContext(userContext);
//     const [predictedFoods, setPredictedFoods] = useState([]);
//     const [expandedIndex, setExpandedIndex] = useState(null); // To track which food is expanded

//     const showPredictedFood = async (userId) => {
//         try {
//             const response = await fetch(`http://localhost:8000/users/show-prediction?userId=${userId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             const result = await response.json();
//             if (result.error) {
//                 console.error(result.error);
//             } else {
//                 console.log('Displayed:', result.predicted_value);
//                 setPredictedFoods(result.predicted_value); // Save the predicted food items in state
//             }
//         } catch (error) {
//             console.error('Error displaying prediction:', error);
//         }
//     };

//     // Using useEffect to call the function when the component mounts
//     useEffect(() => {
//         if (user && user.id) {
//             showPredictedFood(user.id); // Call the function only if user exists
//         }
//     }, [user]); // This ensures the effect runs only when `user` changes

//     // Function to toggle the expanded state for each food
//     // const toggleExpand = (index) => {
//     //     // Set the expandedIndex to null if the current one is expanded, or set it to the clicked index
//     //     setExpandedIndex(expandedIndex === index ? null : index);
//     // };
//     const toggleExpand = (index) => {
//         setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
//       };

//     const formatRecipe = (recipe) => {
//         // Remove "undefined" at the start if it exists
//         const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
//         // Split based on numbers followed by a dot, ensuring to maintain the format
//         const steps = cleanRecipe.split(/(?=\d+\.)/);
    
//         return steps.map((step, idx) => {
//             // Trim each step and capitalize the first letter after the number and period
//             const formattedStep = step.trim();
//             const capitalizedStep = formattedStep.replace(/(\d+\.)\s*(.*)/, (match, number, sentence) => {
//                 return number + ' ' + sentence.charAt(0).toUpperCase() + sentence.slice(1);
//             });
    
//             return (
//                 <p key={idx} className="mt-2">{capitalizedStep}</p>
//             );
//         });
//     };
//     // const formatRecipe = (recipe) => {
//     //     // Remove "undefined" at the start if it exists
//     //     const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
//     //     // Split based on numbers followed by a dot and a space, ensuring to maintain the format
//     //     const steps = cleanRecipe.split(/(?=\d+\.\s)/); // Split before digits followed by a dot and a space
    
//     //     return steps.map((step, idx) => {
//     //         // Trim each step, remove trailing commas, and ensure proper capitalization
//     //         const formattedStep = step.trim().replace(/,\s*$/, ''); // Remove trailing comma
//     //         const capitalizedStep = formattedStep.replace(/(\d+\.)\s*(.*)/, (match, number, sentence) => {
//     //             return number + ' ' + sentence.charAt(0).toUpperCase() + sentence.slice(1);
//     //         });
    
//     //         return (
//     //             <p key={idx} className="mt-2">{capitalizedStep}</p>
//     //         );
//     //     });
//     // };
    
    
    
    
  
    
    
    
    
    

//     return (
//         <>
//             <Navbar />
//             <div className="pt-16">
//                 {!!user && user.fullName && (
//                     <h2 className="text-center text-xl mt-4">Hi {user.fullName}!</h2>
//                 )}

//                 <div className="mt-8 mx-auto max-w-4xl px-4">
//                     <h3 className="text-2xl font-bold mb-4 text-center">Your Predicted Foods</h3>

//                     {predictedFoods.length > 0 ? (
//                         <ul className="space-y-4">
//                             {predictedFoods.map((food, index) => (
//                                 <li
//                                     key={index}
//                                     className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
//                                     onClick={() => toggleExpand(index)} // Toggle expand on click
//                                 >
//                                     <div className="text-lg font-semibold text-gray-700">
//                                         {food.food_name} {/* Display food name */}
//                                     </div>

//                                     {expandedIndex === index && (
//                                         <div className="mt-4 text-sm text-gray-600">
//                                             {/* Format and display the recipe */}
//                                             <p><strong>Recipe:</strong></p>
//                                             {formatRecipe(food.recipe)}
//                                         </div>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-center text-gray-500">No predictions found.</p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

// export default History;

import React, { useContext, useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import { userContext } from "../../context/userContext";

function History() {
    const { user } = useContext(userContext);
    const [predictedFoods, setPredictedFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null); // To track which food is selected

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

    // Function to handle food selection
    const handleFoodSelect = (food) => {
        setSelectedFood(food); // Set the selected food
    };

    // const formatRecipe = (recipe) => {
    //     // Remove "undefined" at the start if it exists
    //     const cleanRecipe = recipe.replace(/^undefined\s*/, '');

    //     // Split based on numbers followed by a dot, ensuring to maintain the format
    //     const steps = cleanRecipe.split(/(?=\d+\.)/);

    //     return steps.map((step, idx) => {
    //         // Trim each step and capitalize the first letter after the number and period
    //         const formattedStep = step.trim();
    //         const capitalizedStep = formattedStep.replace(/(\d+\.)\s*(.*)/, (match, number, sentence) => {
    //             return number + ' ' + sentence.charAt(0).toUpperCase() + sentence.slice(1);
    //         });

    //         return (
    //             <p key={idx} className="mt-2">{capitalizedStep}</p>
    //         );
    //     });
    // };
    // const formatRecipe = (recipe) => {
    //     // Remove "undefined" at the start if it exists
    //     const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
    //     const steps = [];
    //     let currentStep = '';
    
    //     for (let i = 0; i < cleanRecipe.length; i++) {
    //         const char = cleanRecipe[i];
    
    //         // Check if the character is a digit
    //         if (/\d/.test(char)) {
    //             // Check if the previous character is also a digit
    //             if (currentStep.length > 0 && /\d/.test(currentStep[currentStep.length - 1])) {
    //                 currentStep += char; // Add the digit to the current step
    //             } else {
    //                 // If there's a current step, push it to the steps array
    //                 if (currentStep) {
    //                     steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //                 }
    //                 currentStep = char; // Start a new step with the current digit
    //             }
    
    //             // Check if the next character is a space (indicating the end of the step number)
    //             if (cleanRecipe[i + 1] === ' ') {
    //                 currentStep += ' '; // Add the space after the digit
    //                 i++; // Move to the next character (the start of the step text)
    //             }
    //         } else {
    //             currentStep += char; // Add the character to the current step
    //         }
    //     }
    
    //     // Push the last step if exists
    //     if (currentStep) {
    //         steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //     }
    
    //     return steps.map((step, idx) => (
    //         <p key={idx} className="mt-2">{step}</p>
    //     ));
    // };
    
    // const formatRecipe = (recipe) => {
    //     // Remove "undefined" at the start if it exists
    //     const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
    //     const steps = [];
    //     let currentStep = '';
    
    //     for (let i = 0; i < cleanRecipe.length; i++) {
    //         const char = cleanRecipe[i];
    
    //         // Check if the character is a digit
    //         if (/\d/.test(char)) {
    //             // Check if the previous character is also a digit
    //             if (currentStep.length > 0 && /\d/.test(currentStep[currentStep.length - 1])) {
    //                 currentStep += char; // Add the digit to the current step
    //             } else {
    //                 // If there's a current step, push it to the steps array
    //                 if (currentStep) {
    //                     steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //                 }
    //                 currentStep = char; // Start a new step with the current digit
    //             }
    
    //             // Check if the next character is a space (indicating the end of the step number)
    //             if (cleanRecipe[i + 1] === ' ') {
    //                 currentStep += ' '; // Add the space after the digit
    //                 i++; // Move to the next character (the start of the step text)
    //             }
    //         } else {
    //             // Check if the previous character was a space and the one before that was a period
    //             if (i > 1 && cleanRecipe[i - 1] === ' ' && cleanRecipe[i - 2] === '.') {
    //                 currentStep += char.toUpperCase(); // Capitalize the character
    //             } else {
    //                 currentStep += char; // Add the character to the current step
    //             }
    //         }
    //     }
    
    //     // Push the last step if exists
    //     if (currentStep) {
    //         steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //     }
    
    //     return steps.map((step, idx) => (
    //         <p key={idx} className="mt-2">{step}</p>
    //     ));
    // };
    // const formatRecipe = (recipe) => {
    //     // Remove "undefined" at the start if it exists
    //     const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
    //     const steps = [];
    //     let currentStep = '';
    
    //     for (let i = 0; i < cleanRecipe.length; i++) {
    //         const char = cleanRecipe[i];
    
    //         // Check if the character is a digit
    //         if (/\d/.test(char)) {
    //             // Check if the previous character is also a digit
    //             if (currentStep.length > 0 && /\d/.test(currentStep[currentStep.length - 1])) {
    //                 currentStep += char; // Add the digit to the current step
    //             } else {
    //                 // Only move to the next step if the digit is followed by a period ('.')
    //                 if (cleanRecipe[i + 1] === '.') {
    //                     // If there's a current step, push it to the steps array
    //                     if (currentStep) {
    //                         steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //                     }
    //                     currentStep = char; // Start a new step with the current digit
    //                 } else {
    //                     currentStep += char; // If no period, add digit to the current step
    //                 }
    //             }
    
    //             // Check if the next character is a space (indicating the end of the step number)
    //             if (cleanRecipe[i + 1] === ' ') {
    //                 currentStep += ' '; // Add the space after the digit
    //                 i++; // Move to the next character (the start of the step text)
    //             }
    //         } else {
    //             // Check if the previous character was a space and the one before that was a period
    //             if (i > 1 && cleanRecipe[i - 1] === ' ' && cleanRecipe[i - 2] === '.') {
    //                 currentStep += char.toUpperCase(); // Capitalize the character
    //             } else {
    //                 currentStep += char; // Add the character to the current step
    //             }
    //         }
    //     }
    
    //     // Push the last step if exists
    //     if (currentStep) {
    //         steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
    //     }
    
    //     return steps.map((step, idx) => (
    //         <p key={idx} className="mt-2">{step}</p>
    //     ));
    // };
    
    const formatRecipe = (recipe) => {
        // Remove "undefined" at the start if it exists
        const cleanRecipe = recipe.replace(/^undefined\s*/, '');
    
        const steps = [];
        let currentStep = '';
    
        for (let i = 0; i < cleanRecipe.length; i++) {
            const char = cleanRecipe[i];
    
            // Check if the character is a digit
            if (/\d/.test(char)) {
                // If the next character is a digit and the one after is a period
                if (/\d/.test(cleanRecipe[i + 1]) && cleanRecipe[i + 2] === '.') {
                    // Push current step to the steps array
                    if (currentStep) {
                        steps.push(currentStep.trim().replace(/,$/, ''));
                    }
                    currentStep = char; // Start new step with the current digit
                } 
                // // If the next character is a period
                else if (cleanRecipe[i + 1] === '.') {
                    // Push current step to the steps array
                    if (currentStep) {
                        steps.push(currentStep.trim().replace(/,$/, ''));
                    }
                    currentStep = char; // Start new step with the current digit
                } 
                // Otherwise, continue building the current step
                // else {
                //     currentStep += char;
                // }
            } else {
                // Check if the previous character was a space and the one before that was a period
                if (i > 1 && cleanRecipe[i - 1] === ' ' && cleanRecipe[i - 2] === '.') {
                    currentStep += char.toUpperCase(); // Capitalize the character
                } else {
                    currentStep += char; // Add the character to the current step
                }
            }
        }
    
        // Push the last step if exists
        if (currentStep) {
            steps.push(currentStep.trim().replace(/,$/, '')); // Remove trailing comma if exists
        }
    
        return steps.map((step, idx) => (
            <p key={idx} className="mt-2">{step}</p>
        ));
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

                    <ul className="grid grid-cols-3 gap-4">
                        {predictedFoods.map((food, index) => (
                            <li key={index} className="w-full">
                                <button
                                    className="bg-white shadow-lg rounded-lg w-38 h-30 p-3 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                                    onClick={() => handleFoodSelect(food)} // Select food on click
                                >
                                    {food.food_name} {/* Display food name as button */}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedFood && (
                        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Recipe for {selectedFood.food_name}
                            </h4>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Recipe:</strong></p>
                                {formatRecipe(selectedFood.recipe)}
                            </div>
                        </div>
                    )}

                    {predictedFoods.length === 0 && (
                        <p className="text-center text-gray-500">No predictions found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default History;

