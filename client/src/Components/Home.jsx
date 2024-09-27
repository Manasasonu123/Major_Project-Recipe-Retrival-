import React from "react";
import { Link } from "react-scroll";
import { userContext } from "../../context/userContext";
import { useContext } from "react";

function Home() {
  const { user } = useContext(userContext);

  return (
    <section
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      id="banner"
      style={{ backgroundImage: "url('/images/bg4.jpg')" }}
    >
      <div className="absolute top-4 left-16 p-8 text-red-600">
        {!!user && user.fullName && (
          <h1 className="text-center text-4xl font-bold mt-4">
            Hi {user.fullName}!
          </h1>
        )}
      </div>

      <div className="absolute inset-0 bg-red bg-opacity-40 flex flex-col justify-center text-center p-8">
        <h1 className="text-5xl font-bold mb-24">
          Automated Recipe Retrieval Through Food Image{" "}
        </h1>

        {/* <p className="mb-8">
          Upload a food image to predict ingredients and recipes.
        </p> */}
        <div className="flex justify-center space-x-4">
          <Link
            to="prediction"
            smooth={true}
            duration={500}
            className="bg-red-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-red-600"
          >
            Get Started
          </Link>

          <Link
            to="about"
            smooth={true}
            duration={500}
            offset={-64}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
