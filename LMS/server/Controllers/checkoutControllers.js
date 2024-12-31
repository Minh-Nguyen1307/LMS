import axios from "axios";
import CartModels from "../Models/cartModels.js";

// Function to get PayPal access token
const getAccessToken = async () => {
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
          return_url: `${process.env.BASE_URL}/complete-order`,
          cancel_url: `${process.env.BASE_URL}/cancel-order`,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "manfra.io",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approvalUrl = response.data.links.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) throw new Error("Approval URL not found in PayPal response");

    res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    next(error);
  }
};

// Capture Payment
export const capturePayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;


    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Capture payment
    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({
      message: "Payment captured successfully",
      payment: response.data,
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    next(error);
  }
};
