import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setConfirmPassword(e.target.value);

    if (data.password !== e.target.value) {
      setError("Password do not match");
    } else {
      setError("");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { fullName, userName, email, password } = data;
    try {
      const { data } = await axios.post("/register", {
        fullName,
        userName,
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Login Successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex justify-start signup-background">
      <div className="w-[420px] h-[600px] my-10 ml-60 p-8 flex flex-col justify-items-center rounded-3xl bg-gray-400">
        <h1 className="text-5xl font-bold mb-9">
          Hello,
          <br />
          Welcome
        </h1>
        <form onSubmit={registerUser}>
          <div className="pb-6 flex justify-center">
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Fullname"
              required
            />
          </div>
          <div className="pb-6 flex justify-center">
            <input
              type="text"
              value={data.userName}
              onChange={(e) => setData({ ...data, userName: e.target.value })}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Username"
              required
            />
          </div>
          <div className="pb-6 flex justify-center">
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Email"
            />
          </div>
          <div className="pb-6 flex justify-center">
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Password"
              required
            />
          </div>
          <div className="pb-2 flex justify-center">
            <input
              type="password"
              value={confirmPassword}
              onChange={handleChanges}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-400"
              placeholder="Confirm Password"
              required
            />
          </div>
          <p className="ml-14 text-red-700 text-m mb-2">{error}</p>

          <button
            type="submit"
            className=" ml-20 w-[210px] bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
          >
            Register
          </button>
          <div className="pt-4 ml-20">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-700 hover:text-orange-600 hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
