import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Welcome from "./Pages/Welcome";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import NamePrediction from "./Pages/NamePrediction";
import RecipePredict from "./Pages/RecipePredict";
import History from "./Pages/History"

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/recipepredict" element={<RecipePredict />} />
          <Route path="/namepredict" element={<NamePrediction />} />
          <Route path="/history" element={<History />}/> 
          
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
