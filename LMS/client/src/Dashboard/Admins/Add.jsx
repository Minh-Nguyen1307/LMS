import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Add() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admins/signUpAdmin`,
        { userName, email, password, secretKey }
      );

      setSuccess(response.data.message);
      setUserName("");
      setEmail("");
      setPassword("");
      setSecretKey("");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Management</h1>
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Admin</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="userName">
              User Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password types
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded pr-10" // Add padding-right to create space for the icon
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-[20px] top-[50px] transform -translate-y-1/2 text-blue-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="secretKey">
              Secret Key (Required)
            </label>
            <input
              type="text"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-green-800 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
              
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
