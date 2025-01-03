import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CompleteOrder = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('token');
  const payerID = searchParams.get('PayerID');

  useEffect(() => {
    const capturePayment = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/capture-payment?userId=${userId}&orderId=${orderId}&PayerID=${payerID}`);
        setPaymentStatus('Payment captured successfully!');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response?.data?.message || 'Something went wrong');
      }
    };

    if (userId && orderId && payerID) {
      capturePayment();
    }
  }, [userId, orderId, payerID]);

  return (
    <div className="complete-order-container text-center font-bold text-3xl text-green-900">
      <h2 classname=''>Complete Order</h2>
      {loading && <p>Processing your payment...</p>}
      {paymentStatus && <p>{paymentStatus}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default CompleteOrder;
