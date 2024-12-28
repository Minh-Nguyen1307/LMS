import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div className="bg-gray-900 flex flex-col md:flex-row justify-around items-center p-6 md:h-96">
        <div className="mx-10 flex flex-col md:flex-row justify-center items-start  text-white space-y-8 md:space-y-0 w-full">
          
          {/* First Section - Logo and Description */}
          <div className="w-full md:w-1/3">
            <Link to="/" className="flex justify-center">
              <img src="/Logo.png" alt="Logo of Byway" className="mb-4" />
            </Link>
            <div className="font-thin text-center">
            <p>
              Empowering learners through accessible and engaging online education.
            </p>
            <p>
              Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences.
            </p>
            </div>
          </div>

          {/* Second Section - Get Help */}
          <div className="w-full flex justify-center items-center flex-col md:w-1/4">
            <p className="text-2xl font-semibold text-white my-2 ">Get Help</p>
            <div className="font-thin ">
            <p >Contact Us</p>
            <p > Latest Articles</p>
            <p >FAQ</p>
            </div>
          </div>

          {/* Third Section - Programs */}
          <div className="w-full flex justify-center items-center flex-col md:w-1/4">
            <p className="text-2xl font-semibold text-white my-2">Programs</p>
            <div className="font-thin ">
            <p>Art & Design</p>
            <p>Business</p>
            <p>IT & Software</p>
            <p>Languages</p>
            <p>Programming</p>
            </div>
          </div>

          {/* Fourth Section - Contact Us */}
          <div className="w-full flex justify-center items-center flex-col md:w-1/4">
            <p className="text-2xl font-semibold text-white my-2">Contact Us</p>
            <div className="font-thin">
            <p>Address: 123 Main Street, Anytown, CA12345</p>
            <p>Tel: +(123)456-7890</p>
            <p>Mail: bywayedu@webkul.in</p>
            </div>
            <span>
              <img src="/Social.png" alt="Social icons" className="my-2" />
            </span>
            
          </div>
        </div>
      </div>
    </div>
  );
}
