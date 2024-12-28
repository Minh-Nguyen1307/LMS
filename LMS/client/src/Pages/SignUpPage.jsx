import React from "react";

import { Link } from "react-router-dom";
import SignUpForm from "../Components/SignUp/SignUpForm";


export default function SignUpPage() {
  return (
    <div className="row no-gutters mx-0">
      <div className="flex flex-col items-center sm:w-2/3 md:w-1/2">
        <div className="text-4xl font-semibold text-gray-800 my-16">
          Create Your Account
        </div>
        <SignUpForm />
        <div className="mt-4 w-[500px]">
          <button className="bg-gray-200 p-2 rounded w-full hover:bg-gray-300 flex items-center justify-center space-x-2">
            <span>Sign up with</span>
            <img src="1.png" alt="Signup with" className="w-24" />
          </button>
        </div>
        <div className="mt-2">
          Already have an account?{" "}
          <Link to="/signin">
            <button>
              <span className="text-xl font-medium hover:text-red-800">
                Sign in
              </span>
            </button>
          </Link>
        </div>
      </div>

      <div className="hidden sm:block sm:w-1/3 md:w-1/2 p-0">
        <img
          src="b1.png"
          alt="Sign Up"
          className="h-[900px] w-full object-cover"
        />
      </div>
    </div>
  );
}

