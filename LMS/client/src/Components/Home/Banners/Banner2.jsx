import React from "react";

export default function Banner2() {
  return (
    <div className="h-[900px] mx-4 md:mx-10 flex justify-between items-center flex-col md:flex-row">
  
      <div className="w-full md:w-3/5 px-4 mb-8 md:mb-0">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Unlock Your Potential
        </h2>
        <p className="text-base md:text-lg mb-4">
          At Byway, we empower you to reach your full potential through
          accessible and engaging education. Our platform provides you with the
          tools and resources you need to excel, whether you're pursuing new
          skills, enhancing your professional qualifications, or simply
          nurturing a passion for lifelong learning. Join us and take the first
          step towards your brightest future.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-4 p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Start your instructor journey
        </button>
      </div>

     
      <div className="w-full md:w-2/5 p-4 relative h-[600px] flex justify-center items-center">
        <div className="bg-sky-400 rounded-3xl w-96 h-[483px] flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img
            src="banner2.png"
            alt="Main Banner"
            className="w-96 absolute rounded-full transition-all duration-300"
          />
        </div>

        <img
          src="banner21.png"
          alt="Banner Image 21"
          className="w-25 absolute bottom-0 left-0 hover:scale-105 transition-transform duration-300"
        />
        <img
          src="banner22.png"
          alt="Banner Image 22"
          className="w-25 absolute top-0 left-0 hover:scale-105 transition-transform duration-300"
        />
        <img
          src="banner23.png"
          alt="Banner Image 23"
          className="w-25 absolute top-0 right-0 hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
