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
        console.error("Error fetching PayPal access token:", error.message);
        throw new Error("Failed to get PayPal access token");
    }
};

// Controller to create a PayPal order
export const createOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch cart from database
        const cart = await CartModels.findOne({ userId });
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty or not found" });
        }

        // Get PayPal access token
        const accessToken = await getAccessToken();

        // Prepare purchase units
        const purchaseUnits = cart.cartItems.map((item) => ({
            name: item.courseId.name,
            quantity: item.quantity,
            unit_amount: {
                currency_code: "USD",
                value: item.PriceAfterDiscount.toFixed(2),
            },
            category: "DIGITAL_GOODS",
        }));

        // Prepare order data
        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: cart.totalPrice.toFixed(2),
                    },
                    items: purchaseUnits,
                },
            ],
        };

        // Create order with PayPal
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
            method: "post",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            data: orderData,
        });

        // Extract approval URL
        const approvalUrl = response.data.links.find((link) => link.rel === "approve").href;

        res.status(200).json({
            message: "Order created successfully",
            order: response.data,
            approvalUrl,
        });
    } catch (error) {
        console.error("Error creating PayPal order:", error.message);
        res.status(500).json({ error: "Failed to create order with PayPal" });
    }
};

// Controller to capture payment
export const capturePayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Get PayPal access token
        const accessToken = await getAccessToken();

        // Capture payment
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        res.status(200).json({
            message: "Payment captured successfully",
            payment: response.data,
        });
    } catch (error) {
        console.error("Error capturing PayPal payment:", error.message);
        res.status(500).json({ error: "Failed to capture payment" });
    }
};
