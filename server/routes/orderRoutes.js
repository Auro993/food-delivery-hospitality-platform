const express = require("express");

const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();


// =============================
// PLACE ORDER
// =============================
router.post("/place", async (req, res) => {

  try {

    const {
      userId,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    // FIND USER CART
    const cart = await Cart.findOne({
      user: userId,
    });

    // CHECK CART EXISTS
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // CHECK CART ITEMS
    if (cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // CREATE ORDER
    const order = new Order({
      user: userId,

      items: cart.items,

      totalPrice: cart.totalPrice,

      deliveryAddress,

      paymentMethod,
    });

    await order.save();

    // CLEAR CART AFTER ORDER
    cart.items = [];

    cart.totalPrice = 0;

    await cart.save();

    res.status(201).json({
      message: "Order Placed Successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =============================
// GET USER ORDERS
// =============================
router.get("/:userId", async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.params.userId,
    })
      .populate("items.menuItem");

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =============================
// UPDATE ORDER STATUS
// =============================
router.put("/status/:orderId", async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(

      req.params.orderId,

      {
        orderStatus: status,
      },

      {
        new: true,
      }
    );

    // CHECK ORDER EXISTS
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order Status Updated",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =============================
// GET SINGLE ORDER
// =============================
router.get("/single/:orderId", async (req, res) => {

  try {

    const order = await Order.findById(
      req.params.orderId
    )
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;