import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const loginUser = (e) => {
    e.preventDefault();
    axios.get("");
  };

  return (
    <div className="h-screen flex justify-start login-background">
      <div className="w-[400px] my-20 ml-60 p-8 flex flex-col justify-items-center rounded-3xl bg-gray-400">
        <h1 className="text-5xl font-bold mb-[115px]">
          Hello,
          <br />
          Welcome Back
        </h1>
        <form onSubmit={loginUser}>
          <div className="pb-6 flex justify-center">
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="w-18 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Username"
            />
          </div>
          <div className="pb-6 flex justify-center">
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-18 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="ml-14 w-[210px] bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
          >
            Login
          </button>
          <div className=" ml-16 pt-6 place-self-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-700 hover:text-orange-600 hover:underline"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
