import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import CoursesList from '../../Courses/CoursesList';

export default function TopCourses() {
  const [topCourses, setTopCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check login status and user ID
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!authToken);
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    // Fetch top courses
    const fetchTopCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/getTopCoursesByEnrollment`);
        
        // Log the response to check its structure
        console.log(response.data);  // This should show the full object including 'topCourses'
        
        if (response.data.success && Array.isArray(response.data.topCourses)) {
          setTopCourses(response.data.topCourses);  // Access topCourses from the response
        } else {
          console.error("Expected an array under 'topCourses', but got", response.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    

    fetchTopCourses();
  }, []);

  return (
    <div>
      <h4 className='text-4xl font-semibold text-gray-800 mx-10 mt-5 '>
        Top Courses
      </h4>
      <Link
        to={isLoggedIn ? `/${userId}/courses` : '/courses'}
        className="text-blue-800 text-right block mx-10 mt-2"
      >
        See all
      </Link>

      <div className='mx-10 my-5'>
        
        <CoursesList courses={topCourses} />
      </div>
    </div>
  );
}

