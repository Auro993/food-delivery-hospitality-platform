const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

// =============================
// PLACE ORDER
// =============================
router.post("/", auth, async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    } = req.body;

    console.log("=== ORDER REQUEST RECEIVED ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("User ID:", req.user.id);

    // Validate required fields
    if (!restaurantId) {
      console.log("Missing: restaurantId");
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required"
      });
    }

    if (!items || items.length === 0) {
      console.log("Missing: items or items empty");
      return res.status(400).json({
        success: false,
        message: "No items in order"
      });
    }

    if (!totalAmount && totalAmount !== 0) {
      console.log("Missing: totalAmount");
      return res.status(400).json({
        success: false,
        message: "Total amount is required"
      });
    }

    if (!deliveryAddress) {
      console.log("Missing: deliveryAddress");
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    // Format delivery address
    let addressString = "";
    if (typeof deliveryAddress === 'string') {
      addressString = deliveryAddress;
    } else if (typeof deliveryAddress === 'object') {
      addressString = `${deliveryAddress.address || ''}, ${deliveryAddress.city || ''} - ${deliveryAddress.pincode || ''}`;
    }

    if (!addressString) {
      addressString = "Address not provided";
    }

    // Format items for order
    const formattedItems = items.map(item => ({
      menuItem: item.menuItemId,
      name: item.name || "Food Item",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      totalPrice: (Number(item.price) || 0) * (Number(item.quantity) || 1)
    }));

    // Create new order
    const order = new Order({
      user: req.user.id,
      restaurantId: restaurantId,
      items: formattedItems,
      totalPrice: Number(totalAmount),
      deliveryAddress: addressString,
      paymentMethod: paymentMethod === "cod" ? "COD" : "ONLINE",
      orderStatus: "Placed"
    });

    await order.save();
    console.log("Order saved successfully! Order ID:", order._id);

    // Clear user's cart after order placed
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order: order
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});

// =============================
// GET USER ORDERS
// =============================
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("restaurantId", "name image");
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

// =============================
// GET ORDER BY ID
// =============================
router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.menuItem")
      .populate("user", "name email phone")
      .populate("restaurantId", "name image address phone");
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
});

// =============================
// GET RESTAURANT ORDERS (for owner)
// =============================
router.get("/restaurant/orders", auth, async (req, res) => {
  try {
    const Restaurant = require("../models/Restaurant");
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    
    if (!restaurant) {
      return res.json({
        success: true,
        orders: []
      });
    }
    
    const orders = await Order.find({ restaurantId: restaurant._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

// =============================
// UPDATE ORDER STATUS
// =============================
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const statusMap = {
      "pending": "Placed",
      "confirmed": "Preparing",
      "preparing": "Preparing",
      "out-for-delivery": "Out for Delivery",
      "delivered": "Delivered"
    };
    
    const orderStatus = statusMap[status] || status;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order Status Updated",
      order: order
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
});

module.exports = router;