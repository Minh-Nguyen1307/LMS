import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const CourseDetailPage = () => {
  const { courseId } = useParams(); 
  const [courseDetails, setCourseDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
const [isLoggedIn, setIsLoggedIn] = useState(false);
 useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/getCourseById/${courseId}`
        );
        setCourseDetails(response.data.course);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

 

  return (
    <div className="mx-10">
      <div className="my-4">
        <p className="text-4xl font-medium">Course Detail</p>
      </div>
      <div>
        <nav aria-label="breadcrumb" className="text-lg my-5">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={isLoggedIn ? `/${userId}` : `/`}>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={isLoggedIn ? `/${userId}/courses` : `/courses`}>Courses</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {courseDetails.nameCourse}
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex justify-between gap-6">
      
       

      
        <div className="w-2/3 bg-gray-100 rounded-2xl p-6">
          <h1 className="text-6xl p-3 font-bold text-gray-800">
            {courseDetails.nameCourse}
          </h1>
          <div className="grid grid-cols-4 gap-6 mt-6 text-gray-600">
            
            <div className="col-span-1">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold text-left">By:</td>
                    <td className="text-left">{courseDetails.author}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-left">Category:</td>
                    <td className="text-left">{courseDetails.category}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-left">Level:</td>
                    <td className="text-left">{courseDetails.level}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          
            <div className="col-span-">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold text-left">Enrollment:</td>
                    <td className="text-left">{courseDetails.enrollmentCount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-left">Rating:</td>
                    <td className="text-left">{courseDetails.rating} ⭐</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-left">Number:</td>
                    <td className="text-left">{courseDetails.numRatings}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          
            <div className="col-span-2">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold text-left w-1/3">Certification:</td>
                    <td className="text-left">{courseDetails.certification ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="gap-4 w-1/6 border-2 p-3 mr-24 rounded-2xl">
          <img
            src={courseDetails.image}
            alt={courseDetails.nameCourse}
            className="w-full rounded-lg shadow-md"
          />
          <div className="flex justify-around items-center my-4">
            <p className="text-gray-600 mt-2">
              <span className="font-semibold text-3xl text-red-800">
                ${courseDetails.price}
              </span>
            </p>
            <p className="text-gray-600 mt-1">
              <span className="text-green-900 text-xl font-bold">
                {courseDetails.discount}% OFF
              </span>
            </p>
          </div>
          <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-900 transition-colors duration-200">
            Enroll Now
          </button>
          <button className="w-full mt-2 bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>

      
      <div className="mt-8 w-2/3">
        <h2 className="text-2xl font-bold text-gray-800 my-3">Introduction:</h2>
        <p>{courseDetails.introduction}</p>
      </div>

      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Reviews:</h2>
        {courseDetails.reviews && courseDetails.reviews.length > 0 ? (
          <div className="my-3">
            {courseDetails.reviews.map((review) => (
              <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow mt-4">
                <p className="text-gray-800 font-semibold">{review.user.name}</p>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
