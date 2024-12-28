import React from "react";

export default function Banner3() {
  return (
    <div className="h-[900px] mx-4 md:mx-10 flex justify-between items-center flex-col md:flex-row">
    
      <div className="w-full md:w-3/5 px-4 mb-8 md:mb-0">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Unlock Your Potential
        </h2>
        <p className="text-base md:text-lg mb-4">
          Byway is more than just a Learning Management System—it's your
          partner in growth and development. We offer a wide range of courses
          and interactive tools that cater to various learning styles and needs,
          helping you unlock opportunities for success in your academic,
          professional, and personal life. Embrace a limitless learning
          experience with Byway.
        </p>
        <button
          type="button"
          className="btn btn-warning mt-4 p-2 rounded-md hover:bg-yellow-600 transition-colors duration-300"
        >
          Start your instructor journey
        </button>
      </div>

   
      <div className="w-full md:w-2/5 p-4 relative flex justify-center items-center">
  <div className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] h-[400px] sm:h-[500px] md:h-[600px] flex justify-center items-center hover:scale-105 transition-transform duration-300">
    <img
      src="banner33.png"
      alt="Banner Image 33"
      className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] absolute object-cover transition-transform duration-300"
    />
    <img
      src="banner3.png"
      alt="Banner Image 3"
      className="w-40 sm:w-64 md:w-96 absolute rounded-full transition-transform duration-300"
    />
  </div>

  <img
    src="banner31.png"
    alt="Banner Image 31"
    className="w-16 sm:w-24 md:w-32 lg:w-40 absolute bottom-0 left-0 hover:scale-105 transition-transform duration-300"
  />
  <img
    src="banner31.png"
    alt="Banner Image 31"
    className="w-16 sm:w-24 md:w-32 lg:w-40 absolute top-0 right-0 hover:scale-105 transition-transform duration-300"
  />
</div>


    </div>
  );
}
