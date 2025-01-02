import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]); 
  const [totalCourses, setTotalCourses] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 

 
  useEffect(() => {
    if (!userId) {
      setError('User ID is missing.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/getUserById/${userId}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch purchased courses data
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/purchased`, {
          headers: {
            Authorization: `Bearer ${token}`, 
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


  const handleLearnNow = (courseId) => {
    navigate(`/course/${courseId}`);
  };


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg font-semibold text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 h-screen flex justify-between items-start p-6 ">
      <div className="w-full flex space-x-6">
        {/* Profile Section */}
        
        <div className="w-1/2 h-screen bg-white shadow-xl rounded-lg ">
          <div className="bg-gray-800 text-white p-6 mb-6 ">
            <h1 className="text-3xl font-bold text-center">My Profile</h1>
          </div>
          <div className="flex justify-center mb-6">
            <img
              src={user.avatar || '/b1.png'}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">{user.userName}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-md text-gray-500">
              <strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Purchased Courses Section */}
        <div className="w-1/2 bg-white shadow-xl rounded-lg pb-0">
        <div className="bg-gray-800 text-white p-6 mb-6">
            <h1 className="text-3xl font-bold text-center">My Purchased Courses</h1>
          </div>
          <p className="text-xl mb-6 px-6 py-4">Total Courses: {totalCourses}</p>

          {courses.length === 0 ? (
            <p className="text-center text-lg px-6 py-4">You haven't purchased any courses yet.</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.courseId} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-2xl">{course.nameCourse}</h3>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      onClick={() => handleLearnNow(course.courseId)}
                    >
                      Learn Now
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">{course.introduction}</p>
                  <p className="text-gray-500">Category: {course.category}</p>
                  <p className="text-gray-500">Level: {course.level}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="pagination mt-4 text-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-2 px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
