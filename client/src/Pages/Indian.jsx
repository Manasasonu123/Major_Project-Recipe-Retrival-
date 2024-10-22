import React from 'react';
import { Link } from "react-scroll";

function Indian() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* <h1>Indian Food</h1>
      <p>Display Indian food recipes here.</p> */}
      <div
          id="right"
          className=" w-[400px] h-[500px] m-24 bg-red-500 bg-opacity-70 rounded-3xl p-16 grid justify-items-center "
        >
          <h1 className="text-3xl text-white font-bold my-12">
            Want to find the recipe of Indian-Food?
          </h1>
          <Link to="/recipepredict">
            <button className="bg-red-500 text-white h-[50px] px-4 rounded-lg hover:bg-red-600 transition duration-300">
              Generate Recipe
            </button>
          </Link>
        </div>
    </div>
  );
}

export default Indian;
