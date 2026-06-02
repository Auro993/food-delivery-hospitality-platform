const express = require("express");

const Menu = require("../models/Menu");

const router = express.Router();


// CREATE MENU ITEM
router.post("/create", async (req, res) => {

  try {

    const {
      restaurant,
      name,
      description,
      price,
      category,
      image,
    } = req.body;

    const menuItem = new Menu({
      restaurant,
      name,
      description,
      price,
      category,
      image,
    });

    await menuItem.save();

    res.status(201).json({
      message: "Menu Item Created",
      menuItem,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// GET ALL MENU ITEMS
router.get("/", async (req, res) => {

  try {

    const menuItems = await Menu.find()
      .populate("restaurant");

    res.json(menuItems);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;