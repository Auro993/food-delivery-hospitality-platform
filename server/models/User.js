const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,  // This already creates an index
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "restaurant", "courier", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// REMOVE THIS LINE - it's causing the duplicate index warning
// userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);