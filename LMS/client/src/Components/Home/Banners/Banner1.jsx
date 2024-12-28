import React from "react";

export default function Banner1() {
  return (
    <div className="h-[900px] mx-4 md:mx-10 flex justify-between items-center flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-3/5 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Unlock Your Potential
        </h2>
        <p className="text-base md:text-lg mb-4">
          Welcome to Byway, where learning knows no bounds. We believe that
          education is the key to personal and professional growth, and we're
          here to guide you on your journey to success. Whether you're a student,
          professional, or lifelong learner, our cutting-edge Learning Management
          System is designed to elevate your learning experience.
        </p>
        <button
          type="button"
          className="btn btn-success mt-4 p-2 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          Start your instructor journey
        </button>
      </div>

      <div className="w-full mt-5 md:w-1/3 lg:w-1/5 p-4 relative h-80 md:h-96  flex justify-center items-end rounded-full border-b-2 border-t-2 hover:scale-105 transition-all duration-300">
  <img
    src="banner1.png"
    alt="Banner Image"
    className="w-40 md:w-64 absolute rounded-full transition-transform duration-300"
  />
  <div className="bg-red-400 rounded-full w-40 md:w-64 h-40 md:h-64"></div>
</div>

<div className="w-full mt-5 md:w-2/5 lg:w-1/5 h-[500px] md:h-[600px]  flex flex-col justify-around items-center rounded-full border-b-2 border-t-2 space-y-4">
  <div className="bg-sky-500 rounded-full w-40 md:w-64 h-40 md:h-64 flex justify-center items-center hover:scale-105 transition-transform duration-300">
    <img
      src="banner11.png"
      alt="Banner Image 11"
      className="w-40 md:w-64 h-40 md:h-64 rounded-full"
    />
  </div>
  <div className="bg-yellow-500 rounded-full w-40 md:w-64 h-40 md:h-64 flex justify-center items-center hover:scale-105 transition-transform duration-300">
    <img
      src="banner12.png"
      alt="Banner Image 12"
      className="w-40 md:w-64 h-40 md:h-64 rounded-full"
    />
  </div>
</div>

    </div>
  );
}