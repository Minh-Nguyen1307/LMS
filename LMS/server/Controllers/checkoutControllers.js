import axios from "axios";
import CartModels from "../Models/cartModels.js";
import PurchasedCoursesModel from "../Models/PurchasedCoursesModel.js";

// Function to get PayPal access token
const getAccessToken = async () => {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_BASE_URL } = process.env;
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_SECRET_KEY,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error("Unable to retrieve PayPal access token");
  }
};

// Create PayPal order
export const createOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await CartModels.findOne({ userId });
    if (!cart || !cart.cartItems.length) return res.status(400).json({ message: "Cart is empty or not found" });

    const { cartItems, totalPrice } = cart;
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: totalPrice.toFixed(2), breakdown: { item_total: { currency_code: "USD", value: totalPrice.toFixed(2) } } },
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

    const approvalUrl = response.data.links.find((link) => link.rel === "approve")?.href;
    res.status(200).json({ approvalUrl });
  } catch (error) {
    next(error);
  }
};

// Capture Payment
export const capturePayment = async (req, res, next) => {
    try {
      const { userId, orderId, PayerID } = req.query;
      if (!orderId || !userId || !PayerID) return next(new Error("Missing required parameters"));
  
      // Get PayPal access token
      const accessToken = await getAccessToken();
      const captureResponse = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
        { payer_id: PayerID },
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      );
  
      // Check if payment was successful
      if (captureResponse.data.status !== "COMPLETED") throw new Error("Payment not completed");
  
      // Get the cart associated with the user
      const cart = await CartModels.findOne({ userId });
      if (!cart) throw new Error("Cart not found");
  
      const purchasedCourses = cart.cartItems.map((item) => item.courseId); // Extract course IDs
  
      // Check if the user already has purchased courses
      const existingPurchased = await PurchasedCoursesModel.findOne({ userId });
  
      // If the user has already purchased a course, check for duplicates
      if (existingPurchased) {
        const existingCourseIds = existingPurchased.courses.map(course => course.toString());
        
        // Check if any of the purchased courses already exist in the user's purchased courses
        const duplicateCourses = purchasedCourses.filter(courseId => existingCourseIds.includes(courseId.toString()));
        
        if (duplicateCourses.length > 0) {
          // If there are duplicate courses, return an error message
          return res.status(400).json({
            message: "Some courses have already been purchased.",
            duplicateCourses: duplicateCourses
          });
        }
  
        // If no duplicates, add new courses to the list
        existingPurchased.courses.push(...purchasedCourses);
        await existingPurchased.save();
      } else {
        // If no previous purchase, create a new document for the user
        await PurchasedCoursesModel.create({ userId, courses: purchasedCourses });
      }
  
      // Clear the cart after successful purchase
      await CartModels.findOneAndUpdate({ userId }, { $set: { cartItems: [], totalPrice: 0 } });
  
      // Fetch the updated list of purchased courses
      const updatedPurchasedCourses = await PurchasedCoursesModel.findOne({ userId });
  
      // Respond with success message and the purchased courses
      res.status(200).json({
        message: "Payment captured and courses saved!",
        payment: captureResponse.data,
        purchasedCourses: updatedPurchasedCourses.courses, // Return the purchased courses
      });
    } catch (error) {
      next(error); // Handle errors
    }
  };
  
  


