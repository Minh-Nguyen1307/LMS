import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Update() {
  const { courseId } = useParams();
   // Correctly destructure courseId from useParams
  const [courseData, setCourseData] = useState({
    nameCourse: "",
    price: "",
    category: "",
    rating: "",
    numRatings: "",
    image: null,
    author: "",
    level: "Beginner", // Default value set to "Beginner"
    introduction: "",
    discount: "",
    enrollmentCount: 0, // Default value set to 0
    certification: false, // Default value set to false
    timestamp: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch course details by ID
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admins/getCourseById/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const course = response.data.course; // Extract course from response
        setCourseData({
          nameCourse: course.nameCourse || "",
          price: course.price || "",
          category: course.category || "",
          rating: course.rating || "",
          numRatings: course.numRatings || "",
          image: null, // Image is not directly editable in form
          author: course.author || "",
          level: course.level || "Beginner",
          introduction: course.introduction || "",
          discount: course.discount || "",
          enrollmentCount: course.enrollmentCount || 0,
          certification: course.certification || false,
          timestamp: new Date(course.updatedAt), // Use the updated timestamp
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        alert("Failed to fetch course details.");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change for the image
  const handleFileChange = (e) => {
    setCourseData((prevData) => ({
      ...prevData,
      image: e.target.files[0], // Store the selected file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append course data to FormData
    for (const key in courseData) {
      if (key === "image") {
        if (courseData[key]) formData.append(key, courseData[key]);
      } else {
        formData.append(key, courseData[key]);
      }
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admins/updateCourseById/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Course updated successfully!");
        window.location.reload(); // Reload the page after successful update
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course.");
    }
  };

  // Render loading state if data is being fetched
  if (isLoading) {
    return <div className="text-center mt-20 text-2xl">Loading course details...</div>;
  }

  // Render form
  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mx-32 py-5 bg-white shadow-md rounded-md p-3 h-screen overflow-y-auto"
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">Update Course</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
          <input
            type="text"
            name="nameCourse"
            value={courseData.nameCourse}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
          <input
            type="text"
            name="author"
            value={courseData.author}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course price"
            required
          />
        </div>
        {/* Add additional form fields as needed */}
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="w-1/2 text-2xl py-2 mt-6 bg-gray-800 text-white font-medium rounded-md shadow-md hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Course
        </button>
      </div>
    </form>
  );
}

export default Update;
