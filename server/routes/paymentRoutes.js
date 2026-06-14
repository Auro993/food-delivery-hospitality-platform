const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// Debug: Check if environment variables are loaded
console.log('🔍 Checking Razorpay Environment Variables:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Present' : '❌ Missing');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Present' : '❌ Missing');

// Initialize Razorpay with your test keys
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message);
}

// Create Razorpay Order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    console.log(`📝 Creating Razorpay order for amount: ₹${amount}, orderId: ${orderId}`);

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${orderId}`,
      payment_capture: 1,
      notes: {
        orderId: orderId,
        userId: req.user.id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);

    // Save payment record
    const payment = new Payment({
      orderId: orderId,
      userId: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: "INR",
      status: "created",
    });
    await payment.save();
    console.log(`💾 Payment record saved for order: ${orderId}`);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.error?.description || 'Please check your Razorpay keys'
    });
  }
});

// Verify Payment
router.post("/verify-payment", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    console.log(`🔐 Verifying payment for order: ${orderId}`);
    console.log(`Razorpay Order ID: ${razorpay_order_id}`);
    console.log(`Razorpay Payment ID: ${razorpay_payment_id}`);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log(`Expected Signature: ${expectedSignature}`);
    console.log(`Received Signature: ${razorpay_signature}`);

    if (expectedSignature === razorpay_signature) {
      // Update payment record
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
          updatedAt: new Date(),
        }
      );

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        paymentMethod: "online",
        orderStatus: "confirmed",
      });

      console.log(`✅ Payment verified successfully for order: ${orderId}`);

      res.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      console.log(`❌ Invalid signature for order: ${orderId}`);
      
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed", updatedAt: new Date() }
      );
      
      res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get payment status
router.get("/status/:orderId", auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    res.json({
      success: true,
      status: payment?.status || "not_found",
      payment: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;