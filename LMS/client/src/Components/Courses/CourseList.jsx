import React from 'react';
import CourseCard from './CourseCard';


const CoursesList = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-10 border-2 p-5 rounded-lg">
      {courses.length === 0 ? (
        <div>No courses available.</div>
      ) : (
        courses.map((course) => <CourseCard key={course._id} course={course} />)
      )}
    </div>
  );
};

export default CoursesList;
