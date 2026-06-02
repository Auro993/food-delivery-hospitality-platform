const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
      ],

      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);