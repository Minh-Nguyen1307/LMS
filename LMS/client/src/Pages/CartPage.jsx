import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";

const CartPage = () => {
  const [cartCourses, setCartCourses] = useState([]);
  const [error, setError] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0); 
  const { userId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);

  // Fetch Cart Data
  const fetchCart = async () => {
    if (!userId) {
      setError("User ID not found.");
      return;
    }
   

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/getAllCoursesInCart/${userId}`
      );
      const cartItems = response.data.cartItems || [];
      setCartCourses(cartItems);
      setDiscountedPrice(response.data.totalPrice || 0);
      
      // Calculate total discount
      const discount = cartItems.reduce(
        (acc, course) => acc + (course.PriceBeforeDiscount - course.PriceAfterDiscount),
        0
      );
      setTotalDiscount(discount);
    } catch (error) {
      setError("Error fetching cart. Please try again later.");
      console.error("Error fetching cart:", error.message);
    }
  };

  // Remove Course from Cart
  const removeFromCart = async (courseId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/users/removeFromCart/${userId}`, { data: { courseId }} // Send only the _id
      );
      setCartCourses(response.data.cartItems);
      setDiscountedPrice(response.data.totalPrice);
      window.location.reload();
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      setError("Error removing course from cart. Please try again.");
    }
  };
  
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/create-order/${userId}`,{ userId }
      );
      const data = response?.data;
  
      if (response.status === 200 && data?.approvalUrl) {
       
        window.location.href = data.approvalUrl;
      } else {
        alert("Error initiating payment: " + (data?.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Cart is empty or not found!");
    }
  };

  
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  return (
    <div className="mx-10">
      <div className="my-4">
        <p className="text-4xl font-medium">My Cart</p>
      </div>

      <div>
        <nav aria-label="breadcrumb" className="text-lg my-5">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={isLoggedIn ? `/${userId}` : `/`}>Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              My Cart
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full flex justify-between mb-5">
        <div className="w-2/3 pr-4">
          {error && <p className="text-red-600">{error}</p>}

          {cartCourses.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
            {cartCourses.map((course, index) => (
              <li
                key={`${course.courseId}-${index}`} 
                className="mb-2 p-6 border-b rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-2/3"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 w-full">
                    <p className="text-lg text-gray-500">
                      <span className="font-semibold">{index + 1}</span>
                    </p>
                    <img
                      src={course.image}
                      alt={course.nameCourse}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div>
                    <Link to={`/${userId}/courses/${course.courseId}`}><p className="text-xl font-semibold text-gray-900">
                        {course.nameCourse}
                      </p></Link>
                      <p className="text-sm text-gray-600">
                        By: <span className="font-medium">{course.author}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Level: <span className="font-medium">{course.level}</span>
                      </p>
                    </div>
                  </div>
          
                  <div className="text-right w-2/3">
                    <button
                      className="text-red-600 hover:text-red-800 ml-2 mb-2 "
                      onClick={() => removeFromCart(course.courseId)}
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-5" />
                    </button>
                    <p className="text-xl font-bold text-gray-800 line-through">
                      ${course.PriceBeforeDiscount.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      {course.discount}%
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      ${course.PriceAfterDiscount}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          )}
        </div>

        <div className="w-1/3 pl-4 mr-40 mb-20">
          <h1 className="text-3xl font-bold mb-5">Order Details</h1>
          <div>
            <table className="table w-full border-none">
              <tbody>
                <tr>
                  <th scope="row">Items</th>
                  <td>{cartCourses.length}</td>
                </tr>
                
                <tr>
                  <th scope="row" className="text-2xl !text-red-600">
                    Total
                  </th>
                  <td className="!text-red-700 font-bold text-xl">
                    ${discountedPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Link
            to={{
              pathname: `/${userId}/cart`,
              state: { cartCourses, discountedPrice },
            }}
          >
            <button className="btn btn-dark w-2/3 mt-5" type="submit" onClick={handlePayment}>
              Check out
              <FontAwesomeIcon icon={faArrowRight} className="h-4 mx-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
