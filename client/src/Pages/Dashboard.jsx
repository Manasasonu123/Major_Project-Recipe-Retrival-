import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Home from "../Components/Home";
import About from "../Components/About";
import Prediction from "../Components/Prediction";
import { useContext } from "react";
import { userContext } from "../../context/userContext";
import IndianRecipe from "./IndianRecipe";
import NonIndianRecipe from "./NonIndianRecipe";

function Dashboard() {
  const { user } = useContext(userContext);
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Greet the user if logged in  */}

       {/* {!!user && user.fullName && (
          <h2 className="text-center text-xl mt-4">Hi {user.fullName}!</h2>
        )}  */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home id="banner" />
                <About id="about" />
                <Prediction id="prediction" />
                {/* <Contact id="contact" /> */}
              </>
            }
          />
          <Route path="/indian/*" element={<IndianRecipe />} />
          <Route path="/nonindian" element={<NonIndianRecipe />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;

// import React, { useState, useContext } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Navbar from "../Components/Navbar";
// import Home from "../Components/Home";
// import About from "../Components/About";
// import Prediction from "../Components/Prediction";
// import { userContext } from "../../context/userContext";

// function Dashboard() {
//   const { user } = useContext(userContext);
//   const [foodType, setFoodType] = useState(""); // State to store selected food type
//   const navigate = useNavigate(); // Hook to navigate between routes

//   // Handle change when selecting food type and navigate to the corresponding route
//   const handleFoodTypeChange = (event) => {
//     const selectedType = event.target.value;
//     setFoodType(selectedType);

//     // Navigate to the corresponding route based on the selected food type
//     if (selectedType === "Indian Food") {
//       navigate("/Indian");
//     } else if (selectedType === "Non-Indian Food") {
//       navigate("/Non-Indian");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="pt-16">
//         {/* Greet the user if logged in */}
//         {!!user && user.fullName && (
//           <h2 className="text-center text-xl mt-4">Hi {user.fullName}!</h2>
//         )}

//         {/* Dropdown for selecting food type */}
//         <div className="text-center mt-4">
//           <label htmlFor="foodType" className="mr-2 text-lg">Type:</label>
//           <select
//             id="foodType"
//             value={foodType}
//             onChange={handleFoodTypeChange}
//             className="border border-gray-300 rounded-md p-2"
//           >
//             <option value="">Select Type</option>
//             <option value="Indian Food">Indian Food</option>
//             <option value="Non-Indian Food">Non-Indian Food</option>
//           </select>
//         </div>

//         {/* Define routes for "/", "/Indian", and "/Non-Indian" */}
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <>
//                 <Home id="banner" />
//                 <About id="about" />
//                 <Prediction id="prediction" />
//                 <h3 className="text-center text-xl mb-4">Original Content</h3>
//               </>
//             }
//           />
//           <Route
//             path="/Indian"
//             element={
//               <>
//                 <Home id="banner" />
//                 <About id="about" />
//                 <Prediction id="prediction" />
//                 <h3 className="text-center text-xl mb-4">Indian Food Selected</h3>
//               </>
//             }
//           />
//           <Route
//             path="/Non-Indian"
//             element={
//               <>
//                 <Home id="banner" />
//                 <About id="about" />
//                 <Prediction id="prediction" />
//                 <h3 className="text-center text-xl mb-4">Non-Indian Food Selected</h3>
//               </>
//             }
//           />
//         </Routes>
//       </div>
//     </>
//   );
// }

// export default Dashboard;
