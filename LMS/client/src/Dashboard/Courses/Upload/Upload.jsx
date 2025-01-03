import React, { useState } from "react";
import axios from "axios";

function Upload() {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setCourseData((prevData) => ({
      ...prevData,
      image: e.target.files[0], // Store the selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all course data to formData, including the image file
    for (const key in courseData) {
      if (key === "image") {
        formData.append(key, courseData[key]);
      } else if (Array.isArray(courseData[key])) {
        // If there are nested objects like chapters, handle them accordingly
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admins/createCourse`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Course uploaded successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mx-32 py-5 bg-white shadow-md rounded-md p-3 h-screen overflow-y-auto"
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Upload Course
      </h2>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author Name
          </label>
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
        {/* Course Name */}

        {/* Author Name */}

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
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

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            value={courseData.discount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter discount percentage"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            value={courseData.rating}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter rating (1-5)"
            required
          />
        </div>

        {/* Number of Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Ratings
          </label>
          <input
            type="number"
            name="numRatings"
            value={courseData.numRatings}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of ratings"
            required
          />
        </div>

        {/* Image */}
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course category"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Enrollment Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enrollment Count
          </label>
          <input
            type="number"
            name="enrollmentCount"
            value={courseData.enrollmentCount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter enrollment count"
          />
        </div>
      </div>
      <div className="flex justify-between my-2">
        <div className="w-5/6 mr-10">
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-1/6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certification
          </label>
          <input
            type="checkbox"
            name="certification"
            checked={courseData.certification}
            onChange={() =>
              setCourseData((prevData) => ({
                ...prevData,
                certification: !prevData.certification,
              }))
            }
            className="w-4 h-4"
          />
        </div>
      </div>
      <div>
        <label className="block text-xl font-medium text-gray-700 my-3">
          Introduction
        </label>
        <textarea
          name="introduction"
          value={courseData.introduction}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter introduction"
          rows="5" // Set the number of rows for height
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="w-1/2 text-2xl py-2 mt-6 bg-gray-800 text-white font-medium rounded-md shadow-md hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Course
        </button>
      </div>
    </form>
  );
}

export default Upload;
