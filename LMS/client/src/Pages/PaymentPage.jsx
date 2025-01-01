import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Sử dụng useNavigate thay vì useHistory

const PaymentSuccess = ({ userId, orderId, PayerID }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Khai báo navigate

  const handlePaymentCapture = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/capture-payment`,
        {
          params: {
            userId,
            orderId,
            PayerID,
          },
        }
      );

      if (response.data.message === "Payment captured and courses saved!") {
        // Nếu thanh toán thành công, chuyển hướng đến trang mới (ví dụ: trang 'My Courses')
        navigate("/my-courses");  // Thay thế history.push() bằng navigate()
      }
    } catch (error) {
      console.error("Error details:", error); 
      setError(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <button onClick={handlePaymentCapture}>
          Confirm Payment
        </button>
      )}
    </div>
  );
};

export default PaymentSuccess;
