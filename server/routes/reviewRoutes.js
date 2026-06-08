const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const auth = require("../middleware/auth");

// =============================
// CREATE REVIEW (Only for delivered orders)
// =============================
router.post("/", auth, async (req, res) => {
  try {
    const { orderId, rating, title, comment, images } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      orderStatus: "Delivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not delivered yet",
      });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this order",
      });
    }

    const review = new Review({
      user: req.user.id,
      restaurant: order.restaurantId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
      isVerified: true,
    });

    await review.save();

    // Update restaurant average rating
    const allReviews = await Review.find({ restaurant: order.restaurantId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Restaurant.findByIdAndUpdate(order.restaurantId, {
      rating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
});

// =============================
// GET REVIEWS FOR A RESTAURANT
// =============================
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ restaurant: req.params.restaurantId });

    // Get rating distribution
    const ratingDistribution = {
      5: await Review.countDocuments({ restaurant: req.params.restaurantId, rating: 5 }),
      4: await Review.countDocuments({ restaurant: req.params.restaurantId, rating: 4 }),
      3: await Review.countDocuments({ restaurant: req.params.restaurantId, rating: 3 }),
      2: await Review.countDocuments({ restaurant: req.params.restaurantId, rating: 2 }),
      1: await Review.countDocuments({ restaurant: req.params.restaurantId, rating: 1 }),
    };

    res.json({
      success: true,
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      ratingDistribution,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
});

// =============================
// MARK REVIEW AS HELPFUL
// =============================
router.post("/:reviewId/helpful", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user already marked as helpful
    if (review.helpfulUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You already marked this review as helpful",
      });
    }

    review.helpful += 1;
    review.helpfulUsers.push(req.user.id);
    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
    });
  } catch (error) {
    console.error("Helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark as helpful",
    });
  }
});

// =============================
// RESTAURANT OWNER REPLY TO REVIEW
// =============================
router.post("/:reviewId/reply", auth, async (req, res) => {
  try {
    const { replyText } = req.body;
    
    // Check if user is restaurant owner
    const review = await Review.findById(req.params.reviewId).populate("restaurant");
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Verify ownership
    const restaurant = await Restaurant.findOne({
      _id: review.restaurant,
      ownerId: req.user.id,
    });

    if (!restaurant && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reply to this review",
      });
    }

    review.reply = {
      text: replyText,
      repliedAt: new Date(),
      repliedBy: req.user.id,
    };
    await review.save();

    res.json({
      success: true,
      message: "Reply added successfully",
      reply: review.reply,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
});

// =============================
// CHECK IF USER CAN REVIEW ORDER
// =============================
router.get("/can-review/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
      orderStatus: "Delivered",
    });

    if (!order) {
      return res.json({
        success: true,
        canReview: false,
        message: "Order not found or not delivered",
      });
    }

    const existingReview = await Review.findOne({ order: req.params.orderId });

    res.json({
      success: true,
      canReview: !existingReview,
      hasReviewed: !!existingReview,
    });
  } catch (error) {
    console.error("Check review error:", error);
    res.json({ success: true, canReview: false });
  }
});

module.exports = router;