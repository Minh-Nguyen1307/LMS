import axios from "axios";
import CartModels from "../Models/cartModels.js";
import PurchasedCoursesModel from "../Models/PurchasedCoursesModel.js";

// Function to get PayPal access token
export const getAccessToken = async () => {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_BASE_URL } = process.env;

    const response = await axios({
      url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      method: "post",
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET_KEY,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Unable to retrieve PayPal access token");
  }
};

// Create PayPal order
export const createOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch cart from the database
    const cart = await CartModels.findOne({ userId });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    const { cartItems, totalPrice } = cart;

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Create order payload
    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalPrice.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: totalPrice.toFixed(2),
                },
              },
            },
            items: cartItems.map((item) => ({
              name: item.nameCourse,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: "USD",
                value: item.PriceAfterDiscount.toFixed(2),
              },
            })),
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/complete-order?userId=${userId}`,
          cancel_url: `${process.env.BASE_URL}/cancel-order?userId=${userId}`,
          shipping_preference: "NO_SHIPPING",
          user_action: 'PAY_NOW',
          brand_name: 'LMS.io'

         
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approvalUrl = response.data.links.find((link) => link.rel === "approve")?.href;
    console.log("🚀 ~ createOrder ~ approvalUrl:", approvalUrl)
    

    res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    next(error);
  }
};

// Capture Payment
// 1. Validate required parameters
const validateParams = (userId, orderId, PayerID) => {
    if (!orderId || !userId || !PayerID) {
      throw new Error("Missing orderId, userId, or PayerID");
    }
  };
  
  // 2. Get PayPal Access Token
  const getPayPalAccessToken = async () => {
    try {
      const accessToken = await getAccessToken();  // Replace with your method to get PayPal access token
      return accessToken;
    } catch (error) {
      throw new Error("Failed to retrieve PayPal access token");
    }
  };
  
  // 3. Capture Payment using PayPal API
  const capturePaymentFromPayPal = async (orderId, PayerID, accessToken) => {
    try {
      const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,  // PayPal capture URL
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          payer_id: PayerID,  // Send PayerID in the request body
        },
      });
  
      if (response.data.status !== 'COMPLETED') {
        throw new Error("Payment was not completed successfully");
      }
  
      return response.data; // Return PayPal response data
    } catch (error) {
      throw new Error("Failed to capture PayPal payment");
    }
  };
  
  // 4. Handle Cart Operations: Save purchased courses and clear cart
  const handleCartAndSaveCourses = async (userId, cartData) => {
    try {
      // Retrieve cart data to save purchased courses
      const cart = cartData || await CartModels.findOne({ userId });
  
      if (!cart || cart.cartItems.length === 0) {
        throw new Error("Cart is empty or not found");
      }
  
      // Get list of purchased course IDs from cart
      const purchasedCourses = cart.cartItems.map(item => item.courseId);
  
      // Save purchased courses to the database
      const existingRecord = await PurchasedCoursesModel.findOne({ userId });
      if (existingRecord) {
        existingRecord.courses.push(...purchasedCourses);
        await existingRecord.save();
      } else {
        await PurchasedCoursesModel.create({ userId, courses: purchasedCourses });
      }
  
      // Clear cart after successful purchase
      await CartModels.findOneAndUpdate({ userId }, { cartItems: [] });
  
      return purchasedCourses;
    } catch (error) {
      throw new Error("Error handling cart or saving courses");
    }
  };
  
  // 5. Return Payment Details
  const getPaymentDetails = (response) => {
    const paymentDetails = {
      transactionId: response.purchase_units[0].payments.captures[0].id,
      amount: response.purchase_units[0].payments.captures[0].amount.value,
      payer: response.payer,
    };
    return paymentDetails;
  };
  
  // 6. Main Capture Payment Function
  export const capturePayment = async (req, res, next) => {
    try {
      const { userId, orderId, PayerID } = req.query;
  
      // Validate required parameters
      validateParams(userId, orderId, PayerID);
  
      // Get PayPal access token
      const accessToken = await getPayPalAccessToken();
  
      // Capture payment from PayPal
      const paypalResponse = await capturePaymentFromPayPal(orderId, PayerID, accessToken);
  
      // Handle cart and save purchased courses
      await handleCartAndSaveCourses(userId, null);
  
      // Return success response
      const paymentDetails = getPaymentDetails(paypalResponse);
      res.status(200).json({
        message: "Payment captured successfully and courses saved!",
        payment: paymentDetails,
        paypalResponse: paypalResponse,
      });
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      next(error);
    }
  };
  