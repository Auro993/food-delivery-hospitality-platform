const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const auth = require("../middleware/auth");

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find().populate("restaurantId");
    res.json({ success: true, menu: menuItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET single menu item by ID - ADD THIS ROUTE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id).populate("restaurantId");
    
    if (!menuItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }
    
    res.json({ 
      success: true, 
      menuItem: menuItem 
    });
  } catch (error) {
    console.error("Get menu item error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
});

// GET menu items for specific restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const menuItems = await Menu.find({ restaurantId: req.params.restaurantId });
    res.json({ success: true, menu: menuItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// CREATE menu item
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurantId,
      isVegetarian,
      isAvailable,
      image
    } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Name, price and restaurantId are required"
      });
    }

    const menuItem = new Menu({
      name,
      description: description || "",
      price: Number(price),
      category: category || "Uncategorized",
      restaurantId,
      isVegetarian: isVegetarian || false,
      isAvailable: isAvailable !== false,
      image: image || ""
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu Item Created Successfully",
      menuItem
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});

// UPDATE menu item
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const menuItem = await Menu.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }
    
    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem
    });
    
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});

// DELETE menu item
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const menuItem = await Menu.findByIdAndDelete(id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }
    
    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});

module.exports = router;