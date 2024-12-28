
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


export const signInUser = async (email, password, navigate, setErrorLogIn) => {
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/signInUser`,
      { email, password }
    );

    if (response.data.token) {
      const { token, user } = response.data;

      
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.getItem("userId", JSON.stringify(user));
      const userId = user.userId;
      
      user.role === "admin" ? navigate("/admin-dashboard/home") : window.location.href = `/${userId}`;
    } else {
      setErrorLogIn("Invalid credentials. Please try again.");
    }
  } catch (error) {
    setErrorLogIn(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }
};

const SignInForm = ({ formData, handleChange, handleForm, errorLogIn, loading }) => {
  return (
    <form onSubmit={handleForm} className="w-full max-w-md space-y-6">
      <div>
        <label htmlFor="email" className="text-gray-950 font-medium text-xl my-4">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email ID"
          className="border rounded-md w-full pl-4 h-9"
          onChange={handleChange}
          name="email"
          value={formData.email}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="text-gray-950 font-medium text-xl my-4">
          Password <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          autoComplete="off"
          className="border rounded-md w-full pl-4 h-9"
          onChange={handleChange}
          name="password"
          
          value={formData.password}
          required
        />
      </div>

      {errorLogIn && <p className="text-red-500 text-sm">{errorLogIn}</p>}

      <button type="submit" className="btn btn-dark mt-4 text-xl my-4 w-full">
        {loading ? "Signing In..." : "Sign In"}{" "}
        <FontAwesomeIcon icon={faArrowRight} className="h-4 mx-2" />
      </button>

      <div className="text-center">
        <a href="/forgot-password" className="text-blue-500">
          Forgot Password?
        </a>
      </div>

      <div className="mt-4">
        <button className="bg-gray-200 p-2 rounded w-full hover:bg-gray-300 flex items-center justify-center space-x-2">
          <span>Sign in with</span>
          <img src="1.png" alt="Signup with" className="w-24" />
        </button>
      </div>
    </form>
  );
};

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorLogIn, setErrorLogIn] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setErrorLogIn("");
    setLoading(true);
    try {
      await signInUser(formData.email, formData.password, navigate, setErrorLogIn);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const timeToExpire = (decoded.exp * 1000) - Date.now();

        
        const logoutTimeout = setTimeout(() => {
          alert("Out of time sign in, please sign in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/signin");
        }, timeToExpire);

        return () => clearTimeout(logoutTimeout); 
      } catch (error) {
        console.error("Error decoding token:", error);
        alert("Invalid session, please sign in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin");
      }
    }
  }, [navigate]);

  return (
    <div className="flex flex-col sm:flex-row no-gutters">
      <div className="flex flex-col items-center sm:w-2/3 md:w-1/2">
        <h3 className="text-4xl font-semibold text-gray-800 mt-24 mb-10">
          Sign in to your account
        </h3>
        <SignInForm
          formData={formData}
          handleChange={handleChange}
          handleForm={handleForm}
          errorLogIn={errorLogIn}
          loading={loading}
        />
      </div>
      <div className="hidden sm:block sm:w-1/3 md:w-1/2 p-0">
        <img src="signup.png" alt="Sign Up" className="h-[900px] w-full object-cover" />
      </div>
    </div>
  );
}
