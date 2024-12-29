import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    rating: "",
    certification: false,
    search: "",
    sortBy: "",
    page: 1,
    limit: 10, // Default limit
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
  });

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      // Get the token from localStorage or your preferred storage
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admins/getCoursesByAdmin`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      // Check if pagination data exists
      setCourses(response.data.courses || []);

      // Set pagination data or defaults
      if (response.data.pagination) {
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalCourses: response.data.pagination.totalCourses,
        });
      } else {
        console.warn("Pagination data is missing in response");
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalCourses: response.data.courses?.length || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  // Fetch courses when filters or page change
  useEffect(() => {
    fetchCourses();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
      page: 1, // Reset to page 1 when filters change
    }));
  };

  // Handle pagination change
  const handlePagination = (page) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
    }));
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setFilters((prevFilters) => ({
      ...prevFilters,
      limit: newLimit,
      page: 1, // Reset to page 1 when limit changes
    }));
  };

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">Course Management</h1>
        <div className="flex justify-end w-9/12">
          <Link to="upload">
            <button className="btn btn-success">Add Course</button>
          </Link>
          <Link to="edit" className="ml-10">
            <button className="btn btn-success">Update Course</button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">Select Category</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
        </select>

        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="number"
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
          className="border p-2"
          placeholder="Min Rating"
        />

        <label className="flex items-center">
          <input
            type="checkbox"
            name="certification"
            checked={filters.certification}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Certification
        </label>

        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="border p-2"
          placeholder="Search by course name"
        />

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">Sort By</option>
          <option value="price">Price (Low to High)</option>
          <option value="-price">Price (High to Low)</option>
          <option value="rating">Rating</option>
          <option value="new">New Courses</option>
          <option value="enrollmentCount">Enrollment Count</option>
        </select>

        <select
          name="limit"
          value={filters.limit}
          onChange={handleLimitChange}
          className="border p-2"
        >
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="flex justify-start my-6">
        <button
          onClick={() => handlePagination(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {pagination.currentPage} / {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePagination(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Next
        </button>
      </div>
      <span className="mb-4"> Total Courses: {pagination.totalCourses}</span>
      {/* Table Section */}
      <table className="min-w-full mt-4 table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Course Name</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Author</th>
            <th className="border border-gray-300 px-4 py-2">Price $</th>
            <th className="border border-gray-300 px-4 py-2">Discount %</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">
              Enrollment Count
            </th>
            <th className="border border-gray-300 px-4 py-2">Lessons</th>
            <th className="border border-gray-300 px-4 py-2">
              Created At
            </th>{" "}
            {/* Added column */}
            <th className="border border-gray-300 px-4 py-2">
              Updated At
            </th>{" "}
            {/* Added column */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-2 py-1">
                  {course.nameCourse}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.category}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.author}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.price}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.discount}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.rating}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {course.enrollmentCount}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <button
                    onClick={() =>
                      alert(`More details for ${course.nameCourse}`)
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Lessons
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {new Date(course.createdAt).toLocaleString()}
                </td>{" "}
                {/* Display Created At */}
                <td className="border border-gray-300 px-2 py-1">
                  {new Date(course.updatedAt).toLocaleString()}
                </td>{" "}
                {/* Display Updated At */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No courses available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
