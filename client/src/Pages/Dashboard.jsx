import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Home from "../Components/Home";
import About from "../Components/About";
import Prediction from "../Components/Prediction";
import { useContext } from "react";
import { userContext } from "../../context/userContext";

function Dashboard() {
  const { user } = useContext(userContext);
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Greet the user if logged in */}

        {/* {!!user && user.fullName && (
          <h2 className="text-center text-xl mt-4">Hi {user.fullName}!</h2>
        )} */}
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
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;
