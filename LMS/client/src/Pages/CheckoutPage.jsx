import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutPage = ({ userId }) => {
  const [approvalUrl, setApprovalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the approval URL when the component is mounted
    const createOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/create-order/${userId}`);
        setApprovalUrl(response.data.approvalUrl);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response?.data?.message || 'Something went wrong');
      }
    };

    createOrder();
  }, [userId]);

  const handlePaymentRedirect = () => {
    if (approvalUrl) {
      // Redirect the user to PayPal for payment
      window.location.href = approvalUrl;
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {loading && <p>Loading PayPal payment options...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!loading && !errorMessage && approvalUrl && (
        <div>
          <button onClick={handlePaymentRedirect}>Proceed to PayPal</button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
