import React from "react";

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
          <button className="bg-red-500 text-white h-[50px] px-4 rounded-lg hover:bg-red-600 transition duration-300">
            Generate Name
          </button>
        </div>

        <div
          id="right"
          className=" w-[400px] h-[500px] m-24 bg-red-500 bg-opacity-70  rounded-3xl p-16 grid justify-items-center "
        >
          <h1 className="text-3xl text-white font-bold my-12">
            Want to find the recipe of Food?
          </h1>
          <button className="bg-red-500 text-white h-[50px] px-4 rounded-lg hover:bg-red-600 transition duration-300">
            Generate Recipe
          </button>
        </div>
      </div>
    </section>
  );
}

export default Prediction;
