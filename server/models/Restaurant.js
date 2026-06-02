const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    cuisine: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    deliveryTime: {
      type: String,
      default: "30 mins",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);