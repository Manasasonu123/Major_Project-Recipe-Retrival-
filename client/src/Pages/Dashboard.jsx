import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Home from "../Components/Home";
import About from "../Components/About";
import Prediction from "../Components/Prediction";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
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
