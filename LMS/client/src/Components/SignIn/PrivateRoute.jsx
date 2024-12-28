import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Tracks authorization state
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      // If no token, redirect to sign-in page
      navigate("/signin");
      setIsLoading(false);
      return;
    }

    try {
      // Decode the token to get the user role
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      // If the user is an admin, allow access to the dashboard
      if (userRole === "admin") {
        setIsAuthorized(true);
      } else {
        // If the user is not an admin, redirect to a forbidden page
        navigate("/forbidden");
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // If error decoding token, redirect to sign-in
      navigate("/signin");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  if (isLoading) {
    // While loading, return null or a loading spinner
    return null;
  }

  if (!isAuthorized) {
    // If not authorized, do not render the element
    return null;
  }

  // If the user is authorized, render the protected component (admin dashboard)
  return element;
};

export default PrivateRoute;
