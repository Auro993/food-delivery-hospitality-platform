const express = require("express");

const Restaurant = require("../models/Restaurant");

const router = express.Router();


// GET ALL RESTAURANTS
router.get("/", async (req, res) => {

  try {

    const restaurants = await Restaurant.find();

    res.json(restaurants);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// CREATE RESTAURANT
router.post("/create", async (req, res) => {

  try {

    const {
      name,
      cuisine,
      address,
      image,
      rating,
      deliveryTime,
      longitude,
      latitude,
    } = req.body;

    const restaurant = new Restaurant({
      name,
      cuisine,
      address,
      image,
      rating,
      deliveryTime,

      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      },
    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant Created Successfully",
      restaurant,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
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

    res.json(restaurants);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;