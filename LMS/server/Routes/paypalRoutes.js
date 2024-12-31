// import express from "express";
// import axios from "axios";

// const paypalRoutes = express.Router();

// // Lấy Access Token từ PayPal
// const getAccessToken = async () => {
//     const response = await axios({
//         url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
//         method: "POST",
//         auth: {
//             username: process.env.PAYPAL_CLIENT_ID,
//             password: process.env.PAYPAL_SECRET_KEY,
//         },
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         data: "grant_type=client_credentials",
//     });
//     return response.data.access_token;
// };

// // API tạo đơn hàng
// paypalRoutes.post("/create-order/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { cartItems, totalPrice } = req.body;
//         console.log("cartItems:", cartItems);
//         console.log("totalPrice:", totalPrice);
        
//         const accessToken = await getAccessToken();

//         const response = await axios.post(
//             `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
//             {
//                 intent: "CAPTURE",
//                 purchase_units: [
//                     {
//                         amount: {
//                             currency_code: "USD",
//                             value: totalPrice.toFixed(2),
//                             breakdown: {
//                                 item_total: {
//                                     currency_code: "USD",
//                                     value: totalPrice.toFixed(2),
//                                 },
//                             },
//                         },
//                         items: cartItems.map((item) => ({
//                             name: item.nameCourse,
//                             quantity: item.quantity.toString(),
//                             unit_amount: {
//                                 currency_code: "USD",
//                                 value: item.PriceAfterDiscount.toFixed(2),
//                             },
//                         })),
//                     },
//                 ],
//                 application_context: {
//                     return_url: process.env.BASE_URL + '/complete-order',
//                     cancel_url: process.env.BASE_URL + '/cancel-order',
//                     shipping_preference: 'NO_SHIPPING',
//                     user_action:'PAY_NOW',
//                 brand_name:'manfra.io'
//                 },
//             },
            

//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             }
//         );

//         const approvalUrl = response.data.links.find((link) => link.rel === "approve").href;
//         console.log("🚀 ~ paypalRoutes.post ~ approvalUrl:", approvalUrl)
//         res.status(200).json({ approvalUrl });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create PayPal order" });
//     }
// });

// // API xử lý khi thanh toán hoàn tất
// paypalRoutes.post("/capture-order/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { orderId } = req.body;

//         const accessToken = await getAccessToken();

//         const captureResponse = await axios.post(
//             `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             }
//         );

//         // Xác minh đơn hàng đã được thanh toán
//         if (captureResponse.data.status === "COMPLETED") {
//             // Lưu khóa học đã mua vào cơ sở dữ liệu
//             const purchasedCourses = req.body.cartItems;

//             // Giả sử ta có một UserModel
//             const user = await UserModel.findById(userId);
//             user.purchasedCourses = [...user.purchasedCourses, ...purchasedCourses];
//             await user.save();

//             res.status(200).json({ message: "Thanh toán thành công!", purchasedCourses });
//         } else {
//             res.status(400).json({ error: "Thanh toán chưa hoàn tất!" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Không thể xử lý thanh toán!" });
//     }
// });

// export default paypalRoutes;
