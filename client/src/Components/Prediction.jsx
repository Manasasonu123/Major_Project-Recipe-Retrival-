import React from "react";
import { Link } from "react-router-dom";

function Prediction() {
  return (
    <section className="pt-16" id="prediction" style={{ height: "100vh" }}>
      <div className="flex flex-row justify-evenly">
        <div
          id="left"
          className="w-[400px] h-[500px] m-24 bg-red-500 bg-opacity-70  rounded-3xl p-16 grid justify-items-center "
        >
          <h1 className="text-3xl text-white font-bold my-12">
            Want to find the name of Food?
          </h1>
          <Link to="/namepredict">
            <button className="bg-red-600 text-white h-[50px] px-4 rounded-lg hover:bg-red-700 transition duration-300">
              Generate Name
            </button>
          </Link>
        </div>

        <div
          id="right"
          className=" w-[400px] h-[500px] m-24 bg-red-500 bg-opacity-70 rounded-3xl p-16 grid justify-items-center "
        >
          <h1 className="text-3xl text-white font-bold my-12">
            Want to find the recipe of Food?
          </h1>
          <Link to="/recipepredict">
            <button className="bg-red-600 text-white h-[50px] px-4 rounded-lg hover:bg-red-700 transition duration-300">
              Generate Recipe
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Prediction;
