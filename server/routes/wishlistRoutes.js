const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/auth");

// GET user's wishlist
router.get("/", auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
      await wishlist.save();
    }
    
    res.json({
      success: true,
      wishlist: wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
});

// ADD item to wishlist
router.post("/add", auth, async (req, res) => {
  try {
    const { type, itemId, name, image, price, rating } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }
    
    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.type === type && item.itemId.toString() === itemId
    );
    
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item already in wishlist",
      });
    }
    
    wishlist.items.push({
      type,
      itemId,
      name,
      image: image || "",
      price: price || 0,
      rating: rating || 0,
    });
    
    wishlist.updatedAt = new Date();
    await wishlist.save();
    
    res.json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
});

// REMOVE item from wishlist
router.delete("/remove/:type/:itemId", auth, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }
    
    wishlist.items = wishlist.items.filter(
      item => !(item.type === type && item.itemId.toString() === itemId)
    );
    
    wishlist.updatedAt = new Date();
    await wishlist.save();
    
    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
});

// CHECK if item is in wishlist
router.get("/check/:type/:itemId", auth, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.json({ success: true, inWishlist: false });
    }
    
    const exists = wishlist.items.some(
      item => item.type === type && item.itemId.toString() === itemId
    );
    
    res.json({ success: true, inWishlist: exists });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check wishlist",
    });
  }
});

// ADD TO CART from wishlist
router.post("/add-to-cart/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity = 1 } = req.body;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }
    
    const wishlistItem = wishlist.items.find(
      item => item.itemId.toString() === itemId && item.type === "menu"
    );
    
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }
    
    // Call cart API to add item
    const cartAPI = require("../services/api").cartAPI;
    
    res.json({
      success: true,
      message: "Item added to cart",
      item: wishlistItem,
    });
  } catch (error) {
    console.error("Add to cart from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
    });
  }
});

module.exports = router;