import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCartPlus, faHeart,  faMagnifyingGlass,} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useTokenExpiration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const timeToExpire = decoded.exp * 1000 - Date.now();

        if (timeToExpire > 0) {
          // Set timeout to log out the user once the token expires
          const logoutTimeout = setTimeout(() => {
            alert("Out of time, please sign in again.");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/signin");
            window.location.reload("/signin");
          }, timeToExpire);
          console.log(timeToExpire);
          return () => clearTimeout(logoutTimeout); // Cleanup timeout on unmount
        } else {
          // Token already expired, log out immediately
          alert("Session expired, please sign in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        alert("Invalid session, please sign in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin");
      }
    } else {
      navigate(); // If no token, navigate to sign-in
    }
  }, [navigate]);
};
export default function Header() {
  useTokenExpiration();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking local storage or context
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserId(user.userId);
        setUserAvatar(user.avatar || "");
      }
    }
  }, []);

  useEffect(() => {
    // Close the dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (!event.target.closest(".avatar-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Searching for:", e.target.value);
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/signin");
    // Optionally reload the page to reset state
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate(`/${userId}/profile`);
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-10 flex justify-between items-center h-20">
        {/* Logo Section */}
        <div>
        <Link to={isLoggedIn ? `/${userId}` : "/"} className="text-2xl">
            <img src="/Logo1.png" alt="Logo of Byway" className="w-32" />
          </Link>
        </div>

        {/* Courses Link */}
        <div>
        <Link to={isLoggedIn ? `/${userId}/courses` : "/courses"} className="text-2xl">
            Courses
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-1/2">
          <form className="border border-black rounded-lg flex justify-start">
            <button type="button" className="flex items-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="ml-2 text-2xl"
              />
            </button>
            <input
              type="search"
              placeholder="Search Courses"
              className="w-11/12 border-none focus:outline-none p-2 bg-slate-50"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>

        {/* User Section: Conditionally render based on logged in status */}
        <div className="flex justify-between items-center ">
          {isLoggedIn ? (
            <div className="flex items-center space-x-8 w-full justify-end">
              {/* Wishlist */}
              <Link to={`/${userId}/wishlist`}>
                <FontAwesomeIcon icon={faHeart} className="text-3xl" />
              </Link>

              {/* Cart */}
              <Link to={`/${userId}/cart`}>
                <FontAwesomeIcon icon={faCartPlus} className="text-3xl" />
              </Link>

              {/* Notifications */}
              <Link to={`/${userId}/notification`}>
                <FontAwesomeIcon icon={faBell} className="text-3xl" />
              </Link>

              {/* Avatar with Dropdown */}
              <div className="relative avatar-dropdown">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={userAvatar || "/b1.png"}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg border">
                    <button
                      className="w-full text-left p-2 hover:bg-gray-200"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left p-2 hover:bg-gray-200"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4 w-full justify-end">
              <Link to="/signin">
                <button className="border border-gray-300 p-2">Sign in</button>
              </Link>
              <Link to="/signup">
                <button className="border bg-emerald-800 text-white p-2">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
