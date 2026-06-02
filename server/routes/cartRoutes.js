const express = require("express");

const Cart = require("../models/Cart");
const Menu = require("../models/Menu");

const router = express.Router();


// ADD TO CART
router.post("/add", async (req, res) => {

  try {

    const {
      userId,
      menuItemId,
      quantity,
    } = req.body;

    // Find menu item
    const menuItem = await Menu.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    // Find existing cart
    let cart = await Cart.findOne({ user: userId });

    // Create new cart if not exists
    if (!cart) {

      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // Check existing item
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.menuItem.toString() === menuItemId
    );

    if (itemIndex > -1) {

      cart.items[itemIndex].quantity += quantity;

    } else {

      cart.items.push({
        menuItem: menuItemId,
        quantity,
      });
    }

    // Calculate total price
    let total = 0;

    for (const item of cart.items) {

      const food = await Menu.findById(item.menuItem);

      total += food.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// GET USER CART
router.get("/:userId", async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.params.userId,
    }).populate("items.menuItem");

    res.json(cart);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;