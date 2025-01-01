import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const Purchased = () => {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate(); // useNavigate hook for navigation

  const [courses, setCourses] = useState([]); // Store the purchased courses
  const [totalCourses, setTotalCourses] = useState(0); // Total number of purchased courses
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get token from local storage or cookies
        if (!token) {
          // Handle token not being present (redirect to login or show error)
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/purchased`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });

        setCourses(response.data.courses || []);
        setTotalCourses(response.data.totalCourses || 0);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    };

    fetchPurchasedCourses();
  }, [userId, currentPage]);

  // Redirect to the course details page when the "Learn Now" button is clicked
  const handleLearnNow = (courseId) => {
    navigate(`/course/${courseId}`); // Redirect to the course details page using navigate
  };

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="my-courses-page">
      <h1>My Purchased Courses</h1>
      <p>Total Courses Purchased: {totalCourses}</p>

      {courses.length === 0 ? (
        <p>You haven't purchased any courses yet.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.courseId} className="p-4 border-b border-gray-200">
              <h3 className="font-bold">{course.nameCourse}</h3>
              <p className="text-gray-700">{course.introduction}</p>
              <p className="text-gray-500">Category: {course.category}</p>
              <p className="text-gray-500">Level: {course.level}</p>

              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleLearnNow(course.courseId)} // Call handleLearnNow on button click
              >
                Learn Now
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="pagination mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-2 px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Purchased;
