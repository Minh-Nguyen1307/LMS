import axios from "axios";
import CartModels from "../Models/cartModels.js";
import PurchasedCoursesModel from "../Models/PurchasedCoursesModel.js";

// Utility function to get PayPal access token
export const getAccessToken = async () => {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_BASE_URL } = process.env;

    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET_KEY },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error retrieving PayPal access token:", error.response?.data || error.message);
    throw new Error("Unable to retrieve PayPal access token");
  }
};

// Function to create a PayPal order
export const createOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Retrieve cart for the user
    const cart = await CartModels.findOne({ userId });
    if (!cart || !cart.cartItems.length) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    const { cartItems, totalPrice } = cart;

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Create order on PayPal
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
                item_total: { currency_code: "USD", value: totalPrice.toFixed(2) },
              },
            },
            items: cartItems.map((item) => ({
              name: item.nameCourse,
              quantity: item.quantity.toString(),
              unit_amount: { currency_code: "USD", value: item.PriceAfterDiscount.toFixed(2) },
            })),
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/complete-order?userId=${userId}`,
          cancel_url: `${process.env.BASE_URL}/cancel-order?userId=${userId}`,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "LMS.io",
        },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Extract approval URL
    const approvalUrl = response.data.links.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) {
      return res.status(400).json({ message: "Approval URL not found" });
    }

    res.status(200).json({ approvalUrl });
  } catch (error) {
    next(error);
  }
};

// Function to capture payment
// Function to capture payment
export const capturePayment = async (req, res, next) => {
  try {
    const { userId, orderId, PayerID } = req.query;

    // Validate required parameters
    if (!orderId || !userId || !PayerID) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Check the order status before trying to capture
    const orderResponse = await axios.get(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the order has already been captured
    if (orderResponse.data.status === "COMPLETED") {
      return res.status(400).json({
        message: "This order has already been captured.",
        payment: orderResponse.data,
      });
    }

    // Proceed with capturing the payment if it hasn't been captured already
    const captureResponse = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (captureResponse.data.status !== "COMPLETED") {
      throw new Error("Payment not completed");
    }

    // Retrieve cart and purchased courses
    const cart = await CartModels.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const purchasedCourses = cart.cartItems.map((item) => item.courseId);

    const existingPurchased = await PurchasedCoursesModel.findOne({ userId });

    if (existingPurchased) {
      existingPurchased.courses.push(...purchasedCourses);
      await existingPurchased.save();
    } else {
      await PurchasedCoursesModel.create({ userId, courses: purchasedCourses });
    }

    await CartModels.findOneAndUpdate(
      { userId },
      { $set: { cartItems: [], totalPrice: 0 } }
    );

    const updatedPurchasedCourses = await PurchasedCoursesModel.findOne({ userId });

    // Return the response with success message
    res.status(200).json({
      message: "Payment captured and courses saved!",
      payment: captureResponse.data,
      purchasedCourses: updatedPurchasedCourses.courses,
    });
  } catch (error) {
    next(error);
  }
};
