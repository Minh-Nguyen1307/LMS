import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import Button from "./Button";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Password validation function
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasSpecialChar && isLongEnough;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { userName, email, password, confirmPassword } = formData;

    // Validation checks
    if (!userName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must contain an uppercase letter, a lowercase letter, a special character, and be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Proceed with user registration (email is checked by backend)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/signUpUser`,
        { userName, email, password }
      );

      // Success message if registration is successful
      setSuccess(response.data.message);
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      // Check if the email already exists (from the backend)
      if (err.response?.data?.message === "Email already exists.") {
        setError("Email already exists. Please choose a different email.");
        
      } else {
        // Handle other errors
        setError(
          err.response?.data?.message ||
            "Unable to process your request. Please try again later."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-col justify-around h-[600px] w-[500px]">
      {/* UserName Input */}
      <FormInput
        label="User Name"
        name="userName"
        type="text"
        placeholder="User Name"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      
      {/* Email Input */}
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      {/* Password Input */}
      <FormInput
        label="Password"
        name="password"
        type="password"
        autoComplete="off"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      {/* Confirm Password Input */}
      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      {/* Submit Button */}
      <Button type="submit">Create Account</Button>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Success Message */}
      {success && <div className="text-green-500 mb-4">{success}</div>}
    </form>
  );
}
