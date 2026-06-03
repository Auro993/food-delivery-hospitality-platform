const express = require("express");
const Restaurant = require("../models/Restaurant");
const auth = require("../middleware/auth");

const router = express.Router();

// GET ALL RESTAURANTS
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({
      success: true,
      restaurants: restaurants
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// GET SINGLE RESTAURANT
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }
    res.json({
      success: true,
      restaurant: restaurant
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// CREATE RESTAURANT (Change from /create to /)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is restaurant owner
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners can create restaurants"
      });
    }

    const {
      name,
      cuisines,
      address,
      image,
      rating,
      deliveryTime,
      phone,
      description
    } = req.body;

    const restaurant = new Restaurant({
      name,
      description: description || "",
      cuisines: cuisines || [],
      address: {
        street: address?.street || "",
        city: address?.city || "",
        area: address?.area || "",
        pincode: address?.pincode || ""
      },
      image: image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      rating: rating || 4.0,
      deliveryTime: deliveryTime || "30-40",
      phone: phone || "",
      ownerId: req.user.id,
      isOpen: true
    });

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant Created Successfully",
      restaurant: restaurant
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});

// GET NEARBY RESTAURANTS
router.get("/nearby", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 5000,
        },
      },
    });

    res.json({
      success: true,
      restaurants: restaurants
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// UPDATE RESTAURANT
router.put("/:id", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }
    
    // Check if user owns this restaurant
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({
      success: true,
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;