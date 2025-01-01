import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CompleteOrder = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("token"); // Order ID from PayPal
  const payerId = queryParams.get("PayerID"); // Payer ID for validation

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage
    const userIdFromStorage = JSON.parse(localStorage.getItem("userId"));
    setUserId(userIdFromStorage);
  }, []);

  useEffect(() => {
    const capturePayment = async () => {
      // Check if orderId, payerId, and userId are all available before proceeding
      if (!orderId || !payerId || !userId) {
        alert("Required data (orderId, PayerID, userId) is missing.");
        return;
      }

      try {
        // Send the payment details to the backend, including orderId, payerId, and userId as query params
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/capture-payment?userId=${userId}&orderId=${orderId}&PayerID=${payerId}`
        );
        console.log("Payment successful:", response.data);
        alert("Payment successful! The course has been saved to your account.");
        window.location.href = "/my-courses"; // Redirect to the courses page
      } catch (error) {
        console.error("Error processing payment:", error);
        alert("Payment processing failed. Please try again.");
      }
    };

    // Proceed with payment if orderId, payerId, and userId exist
    if (orderId && payerId && userId) {
      capturePayment();
    }
  }, [orderId, payerId, userId]); // Dependencies include the orderId, payerId, and userId

  return (
    <div>
      <h1>Completing your payment...</h1>
      <p>Please wait while we process your transaction.</p>
    </div>
  );
};

export default CompleteOrder;
