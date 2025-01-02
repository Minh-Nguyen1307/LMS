import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export default function Side() {
  const navigate = useNavigate();
  const location = useLocation();
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const { userId } = useParams();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);
  
  const userAvatar = localStorage.getItem("userAvatar") || '/b1.png';

 
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-between p-6 w-full">
      
      <div>
        <div className="w-full mb-10">
          <Link to={isLoggedIn ? `/${userId}` : `/`}>
            <img src="/Logo.png" alt="Logo of Byway" className="w-32 mx-auto" />
          </Link>
        </div>

        
        <div className="my-10 px-4">
          <Link
              to={`/${userId}/profile/home`}><h1
            className="text-3xl text-white font-bold mb-4 block text-center"
          >
            My Profile
          </h1>
          </Link>
        </div>

      
        <ul className="space-y-4">
          <li>
            <Link
              to={`/${userId}/profile/introduction`}
              className={`block px-4 py-2 rounded-lg text-xl ${
                location.pathname === "/profile/introduction"
                  ? "bg-white text-black font-bold"
                  : "text-white hover:font-bold hover:text-black"
              }`}
            >
              <FontAwesomeIcon icon={faBookOpenReader} className="mr-3 text-xl" />
              Update Profile Information
            </Link>
          </li>
          <li>
            <Link
              to={`/${userId}/profile/purchased`}
              className={`block px-4 py-2 rounded-lg text-xl ${
                location.pathname === "/profile/courses"
                  ? "bg-white text-black font-bold"
                  : "text-white hover:font-bold hover:text-black"
              }`}
            >
              <FontAwesomeIcon icon={faBookOpenReader} className="mr-3" />
              Courses
            </Link>
          </li>
        </ul>
      </div>

      
      <div className="flex flex-col items-center space-y-3">
        
        <div className="w-12 h-12 rounded-full overflow-hidden border cursor-pointer">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div
          className="text-white hover:font-extrabold cursor-pointer text-2xl"
          onClick={handleSignOut}
        >
          Sign Out
        </div>
      </div>
    </div>
  );
}
