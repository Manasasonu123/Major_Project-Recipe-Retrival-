import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Prediction from "./Components/Prediction";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
