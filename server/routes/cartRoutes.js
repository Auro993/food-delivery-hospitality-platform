const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");

// Helper to get user ID from token
const getUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

// GET cart
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
      await cart.save();
    }
    
    res.json({ items: cart.items || [], totalPrice: cart.totalPrice || 0 });
  } catch (error) {
    console.error("GET cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD to cart
router.post("/add", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const { menuItemId, name, price, quantity, image, restaurantId, restaurantName, specialInstructions } = req.body;
    
    console.log("Add to cart request:", { userId, menuItemId, name, price, quantity, restaurantId });
    
    // Validation
    if (!menuItemId || !name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: menuItemId, name, price" 
      });
    }
    
    // Find existing cart
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }
    
    const itemTotal = price * (quantity || 1);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.menuItemId === menuItemId);
    
    if (existingItemIndex !== -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += (quantity || 1);
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItemId,
        name,
        price,
        quantity: quantity || 1,
        image: image || "",
        restaurantId: restaurantId || "",
        restaurantName: restaurantName || "",
        totalPrice: itemTotal
      });
    }
    
    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    await cart.save();
    
    res.json({ 
      success: true,
      items: cart.items, 
      totalPrice: cart.totalPrice 
    });
    
  } catch (error) {
    console.error("POST add to cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE quantity
router.put("/update/:itemId", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * quantity;
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    await cart.save();
    
    res.json({ items: cart.items, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("UPDATE cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// REMOVE item
router.delete("/remove/:itemId", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();
    
    res.json({ items: cart.items, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("DELETE cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CLEAR cart
router.delete("/clear", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    await Cart.findOneAndDelete({ user: userId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("CLEAR cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;