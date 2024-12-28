import React from "react";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export default function Appendix() {
  return (
    <div className='m-20'>
      {/* First Section */}
      <div className='flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0'>
        <div className='w-80 md:w-1/2 flex justify-center'>
          <img src='banner41.png' alt='' className='w-full md:w-96' />
        </div>
        <div className='w-full md:w-1/2 text-center md:text-right'>
          <h3 className='text-3xl font-semibold'>Become an Instructor</h3>
          <p className='my-4'>
            Instructors from around the world teach millions of students on
            Byway. We provide the tools and skills to teach what you love.
          </p>
          <Link to='/courses'>
            <button type='button' className='btn btn-success p-2'>
              Register Now{" "}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </Link>
        </div>
      </div>

      {/* Second Section */}
      <div className='flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 mt-16'>
        <div className='w-full md:w-1/2 text-center md:text-left'>
          <h3 className='text-3xl font-semibold'>
            Transform your life through education
          </h3>
          <p className='my-4'>
            Learners around the world are launching new careers, advancing in
            their fields, and enriching their lives.
          </p>
          <Link to='/courses'>
            <button type='button' className='btn btn-warning p-2'>
              Checkout Courses <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </Link>
        </div>
        <div className='w-full md:w-1/2 flex justify-center'>
          <img src='banner51.png' alt='' className='w-3/4 md:w-96' />
        </div>
      </div>
    </div>
  );
}
