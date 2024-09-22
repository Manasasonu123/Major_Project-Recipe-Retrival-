import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="flex flex-col items-center mt-60">
      <h1 className="text-6xl font-bold mb-8">
        Welcome to Food Recipe Prediction
      </h1>
      <p className="text-xl mb-24 text-center">
        Discover the ingredients and recipes from your favorite dishes with just
        an image.
      </p>
      <div className="flex space-x-16">
        <Link to="/login">
          <button className="bg-red-500 text-white h-[50px] w-24 px-4 rounded-lg hover:bg-red-600 transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-red-500 text-white h-[50px] w-24 px-4 rounded-lg hover:bg-red-600 transition duration-300">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
