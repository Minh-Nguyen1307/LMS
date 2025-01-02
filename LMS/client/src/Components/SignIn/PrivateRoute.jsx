import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      
      navigate("/signin");
      setIsLoading(false);
      return;
    }

    try {
      
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

     
      if (userRole === "admin") {
        setIsAuthorized(true);
      } else {
        
        navigate("/forbidden");
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      
      navigate("/signin");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  if (isLoading) {
   
    return null;
  }

  if (!isAuthorized) {
   
    return null;
  }

  
  return element;
};

export default PrivateRoute;
