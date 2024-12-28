import express from 'express';
import { capturePayment } from '../Controllers/checkoutControllers.js';
import { createOrder } from '../Controllers/checkoutControllers.js';

const paypalRouters = express.Router();

paypalRouters.post('/create-order/:userId', createOrder);
paypalRouters.post('/capture-payment/:orderId', capturePayment);

export default paypalRouters;