import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCard = (course) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user is saved in localStorage
  const userId = user?.userId;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);

  // Check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
        return decoded.exp * 1000 > Date.now(); // Check token expiry
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return false;
  };

  // Frontend: Add to Cart Function
  const addToCart = async (userId, courseId) => {
    setLoading(true); // Set loading state to true when the request is initiated
    try {
        
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/add`,
        { courseId }
      );
      setLoading(false); // Set loading state to false when the response is received
      return response.data;
    } catch (error) {
      setLoading(false); // Set loading state to false if an error occurs
      console.error("Error adding to cart:", error.response?.data || error.message);
      throw error.response?.data || { message: "An error occurred" };
    }
  };

  // Handle adding a course to the cart
  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert("Please sign in to add items to your cart.");
      navigate("/signin");
      return;
    }

    try {
      
      const response = await addToCart(userId, course._id);
      alert(response.message || "Course added to your cart successfully!");
    } catch (error) {
      if (error?.message === "Course is already in your cart") {
        alert("This course is already in your cart.");
      } else {
        alert(error?.message || "Failed to add course to cart.");
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.nameCourse}
        className="w-full h-36 object-cover"
      />

      {/* Course Title */}
      <Link
        to={isLoggedIn ? `/${userId}/courses/${course._id}` : `/courses/${course._id}`}
      >
        <p className="pt-2 mx-0.5 text-xl font-semibold text-center text-gray-800 hover:text-green-800 transition-colors duration-200 cursor-pointer">
          {course.nameCourse}
        </p>
      </Link>

      <div className="px-6 pb-2">
        {/* Author */}
        <p className="text-gray-600 mt-1 text-sm text-center">
          By: <span className="font-medium">{course.author}</span>
        </p>

        {/* Level and Category */}
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{course.category}</span>
          <span>Level: {course.level}</span>
        </div>

        {/* Price and Discount */}
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-800">${course.price}</p>
            <div className="flex items-center flex-col text-gray-600">
              <span className="mr-2 text-black">⭐ {course.rating}</span>
              <span className="text-sm">({course.numRatings} ratings)</span>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Discount:</span>{" "}
              <span className="font-bold text-black">{course.discount}%</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Enrollment:</span>{" "}
              <span className="font-bold text-black">
                {course.enrollmentCount}
              </span>
            </p>
          </div>
        </div>

        {/* Enroll and Add to Cart Buttons */}
        <div className="mt-3 flex gap-4">
          {/* Enroll Now Button */}
          <Link to={`/courses/${course._id}`} className="w-3/4">
            <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-900 transition-colors duration-200">
              Enroll Now
            </button>
          </Link>

          {/* Add to Cart Button */}
          <div className="w-1/4">
            <button
              className="w-full bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors duration-200"
              onClick={handleAddToCart}
              disabled={loading} // Disable button during loading
            >
              {loading ? "Adding..." : <FontAwesomeIcon icon={faCartShopping} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
