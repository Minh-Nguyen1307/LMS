import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link, useParams } from "react-router-dom";
import Filter from "../Components/Courses/Filter";
import CoursesList from "../Components/Courses/CoursesList";

const CoursesPage = () => {
  const { userId } = useParams();
  const [courses, setCourses] = useState([]);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState({
    category: "",
    level: "",
    sortBy: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
 useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/getCourses`, {
            params: {
              ...filter, 
              page: pagination.currentPage,
              limit: 10, 
            },
          }
        );
        setCourses(response.data.courses);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [filter, pagination.currentPage]);

 
  const filteredCourses = courses.filter((course) => {
    if (filter.category && course.category !== filter.category) return false;
    if (filter.level && course.level !== filter.level) return false;
    return true;
  });

  const sortedCourses = filteredCourses.sort((a, b) => {
    if (filter.sortBy === "price") {
      return a.price - b.price;
    } else if (filter.sortBy === "-price") {
      return b.price - a.price;
    } else if (filter.sortBy === "rating") {
      return b.rating - a.rating; 
    } else if (filter.sortBy === "numRatings") {
      return b.numRatings - a.numRatings;
    } else if (filter.sortBy === "discount") {
      return b.discount - a.discount;
    } else if (filter.sortBy === "new") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (filter.sortBy === "enrollment") {
      return b.enrollmentCount - a.enrollmentCount;
    }
    return 0;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const resetFilter = () => {
    setFilter({
      category: "",
      level: "",
      sortBy: "",
    });
  };

 
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return; 
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPage: newPage,
    }));
  };

  return (
    <div className="mx-10">
      <div>
      <div className="my-4">
          <p className="text-4xl font-medium">All Courses</p>
        </div>
        <div>
          <nav aria-label="breadcrumb" className="text-lg my-5">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
              <Link to={isLoggedIn ? `/${userId}` : `/`}>Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Courses
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="flex justify-around items-start">
        <div className="w-1/6 pr-5">
         
          <Filter
            filter={filter}
            handleFilterChange={handleFilterChange}
            resetFilter={resetFilter}
          />
        </div>
        <div className="w-5/6">
          
          <CoursesList  courses={sortedCourses} />
          
        
          <div className="flex justify-center items-center space-x-4 my-6">

  <button
    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
    onClick={() => handlePageChange(pagination.currentPage - 1)}
    disabled={pagination.currentPage === 1}
  >
    Previous
  </button>

  
  <div className="text-lg">
    <p>{pagination.currentPage}/{pagination.totalPages}</p>
  </div>

 
 

  
  <button
    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
    onClick={() => handlePageChange(pagination.currentPage + 1)}
    disabled={pagination.currentPage === pagination.totalPages}
  >
    Next
  </button>
</div>


        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
