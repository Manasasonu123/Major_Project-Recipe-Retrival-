import React, { useState } from "react";

function About() {
  const [selectedStep, setSelectedStep] = useState(1);

  const stepContent = {
    1: "Step 1: Upload a food image. This is the first step to predict the recipe, where you upload an image of the dish.",
    2: "Step 2: Image recognition is applied to analyze the uploaded food image and identify the ingredients.",
    3: "Step 3: Recipe prediction uses machine learning to predict possible recipes based on the recognized ingredients.",
    4: "Step 4: View the recipe, including ingredients and step-by-step cooking instructions.",
  };

  return (
    <section
      id="about"
      className="pt-16 flex justify-center items-center p-36 m-24 h-screen"
    >
      {/* Left Side: Steps */}
      <div className="bg-red-500 bg-opacity-30 shadow-lg rounded-3xl p-6 space flex flex-row w-[1500px]">
        <div className="w-1/2">
          <div className="">
            <h2 className="text-2xl font-bold mb-4">Steps</h2>
            <ul className="space-y-4">
              <li
                className={`cursor-pointer p-5 rounded-3xl ${
                  selectedStep === 1 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedStep(1)}
              >
                1. Upload Food Image
              </li>
              <li
                className={`cursor-pointer p-5 rounded-3xl ${
                  selectedStep === 2 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedStep(2)}
              >
                2. Image Recognition
              </li>
              <li
                className={`cursor-pointer p-5 rounded-3xl ${
                  selectedStep === 3 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedStep(3)}
              >
                3. Recipe Prediction
              </li>
              <li
                className={`cursor-pointer p-5 rounded-3xl ${
                  selectedStep === 4 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedStep(4)}
              >
                4. View Recipe
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-1/2 pl-12">
          <div className="">
            <h2 className="text-5xl font-bold my-16">
              Step {selectedStep} Details
            </h2>
            <p className="text-lg">{stepContent[selectedStep]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
