import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CompleteOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const capturePayment = async () => {
      const userId = searchParams.get("userId");
      const orderId = searchParams.get("token");
      const PayerID = searchParams.get("PayerID");

      if (!userId || !orderId || !PayerID) {
        setError("Missing payment details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.VITE_API_BASE_URL}/users/capture-payment`,
          null,
          {
            params: { userId, orderId, PayerID },
          }
        );


        setSuccess(true);
        console.log("Payment captured successfully:", response.data);
      } catch (err) {
        console.error("Error capturing payment:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Payment capture failed.");
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [searchParams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="payment-success-container text-center p-6">
      {success && (
        <div>
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <p className="mt-4 text-gray-700">Your courses have been purchased successfully.</p>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            onClick={() => navigate("/profile")}
          >
            Learn Now
          </button>
        </div>
      )}
    </div>
  );
};

export default CompleteOrder;
