import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";; 
import { useContext } from "react";

function RecipePredict() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [recipe_details, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select an image to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Make the POST request to the Flask API
      const response = await fetch("http://localhost:5000/predict-and-scrape", {
        method: "POST",
        body: formData,
      });

      // Parse the JSON response
      const result = await response.json();
      

      // Set the predicted label to display in frontend
      setPredictedLabel(result.predicted_label);
      setRecipeUrl(result.recipe_url);
      setInstructions(result.recipe_details);
      setRelatedFoods(result.related_foods);

       // Save the prediction to the backend with userId
       savePrediction(result.predicted_label, user.id); // Use user._id from UserContext
    } catch (error) {
      console.error("Error in prediction:", error);
    } finally {
      setLoading(false); // Set loading back to false when the request is done
    }
  };

   // Function to save prediction to Node.js backend
   const savePrediction = async (predictedLabel, userId) => {
    try {
      const response = await fetch('http://localhost:8000/users/add-prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, predictedLabel }),
      });

      const result = await response.json();
      if (result.error) {
        console.error(result.error);
      } else {
        console.log('Prediction saved:', result.predicted_food);
      }
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
  };



  

  return (
    
    <div className="flex flex-col items-center justify-center h-min-screen">
       {!!user && user.fullName && (
          <h2 className="text-center text-xl mt-4">Hi {user.fullName}</h2>
        )} 
      <h1 className="text-4xl font-bold mb-8">Food Recipie Generator</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-red-500 bg-opacity-70 p-6 rounded-3xl shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Upload Food Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Display image preview */}
        {imagePreview && ( // Display the selected image
          <div className="mb-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Selected Food"
              className="w-50 h-auto rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          className={`bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:shadow-outline ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </form>

      {predictedLabel && (
        <div className="flex flex-col mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="text-lg font-bold">Generated Food Name:</h2>
          <p className="text-xl">{predictedLabel}</p>
        </div>
      )}

      {recipeUrl && (
        <div className="flex flex-col mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <h2 className="text-lg font-bold">Recipe URL:</h2>
          <a
            href={recipeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {recipeUrl}
          </a>
        </div>
      )}

      {recipe_details && (
        <div className="flex flex-col mt-6 p-4 bg-red-500 bg-opacity-70 border border-red-400 rounded w-[1000px]">
          <h2 className="text-lg font-bold">Retrieved Recipe:</h2>

          {/* Check if recipe_details has 'ingredients' and 'method' */}
          {recipe_details.ingredients && (
            <div>
              <h3 className="font-bold mt-2">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {recipe_details.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {recipe_details.method && (
            <div>
              <h3 className="font-bold mt-2">Method:</h3>
              <ol>
                {recipe_details.method.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
      
      {predictedLabel && (
        <div>
          <h2>Predicted Food: {predictedLabel}</h2>
          {relatedFoods.length > 0 && (
            <div>
              <h3>Related Foods:</h3>
              <ul>
                {relatedFoods.map((food, index) => (
                  <li key={index}>
                    Recipe: {food.recipe_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* {recipe_details && (
        <div className="flex flex-col mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="text-lg font-bold">Instructions:</h2>
          <p className="text-xl">{recipe_details}</p>
        </div>
      )} */}

      <button
        onClick={() => navigate("/dashboard")} // Navigate to the Prediction component
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Back to Prediction
      </button>
    </div>
  );
}

export default RecipePredict;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function RecipePredict() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [predictedLabel, setPredictedLabel] = useState("");
//   const [recipeUrl, setRecipeUrl] = useState("");
//   const [recipeDetails, setRecipeDetails] = useState({});
//   const [relatedFoods, setRelatedFoods] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       alert("Please upload an image.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setPredictedLabel("");
//     setRecipeUrl("");
//     setRecipeDetails({});
//     setRelatedFoods([]);

//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     try {
//       const response = await axios.post("http://localhost:5000/predict-and-scrape", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const { predicted_label, recipe_url, recipe_details, related_foods } = response.data;

//       setPredictedLabel(predicted_label);
//       setRecipeUrl(recipe_url);
//       setRecipeDetails(recipe_details);
//       setRelatedFoods(related_foods);
//     } catch (error) {
//       setError("Error in prediction or fetching recipe details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Food Prediction and Recipe Finder</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} accept="image/*" />
//         {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />}
//         <button type="submit" disabled={loading}>
//           {loading ? "Predicting..." : "Submit"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {predictedLabel && (
//         <div>
//           <h3>Predicted Food: {predictedLabel}</h3>
//           {recipeUrl && (
//             <p>
//               Recipe URL: <a href={recipeUrl} target="_blank" rel="noopener noreferrer">{recipeUrl}</a>
//             </p>
//           )}
//           {recipeDetails.ingredients && (
//             <div>
//               <h4>Ingredients:</h4>
//               <ul>
//                 {recipeDetails.ingredients.map((ingredient, index) => (
//                   <li key={index}>{ingredient}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {recipeDetails.method && (
//             <div>
//               <h4>Method:</h4>
//               <ol>
//                 {recipeDetails.method.map((step, index) => (
//                   <li key={index}>{step}</li>
//                 ))}
//               </ol>
//             </div>
//           )}
//         </div>
//       )}

//       {relatedFoods.length > 0 && (
//         <div>
//           <h3>Related Foods:</h3>
//           <ul>
//             {relatedFoods.map((food, index) => (
//               <li key={index}>
//                 <p>{food.recipe_name}</p>
//                 {food.image_url && <img src={food.image_url} alt={food.recipe_name} style={{ width: "100px" }} />}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RecipePredict;
