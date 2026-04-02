const express = require("express");
const rateLimit = require("express-rate-limit");
const { asyncHandler } = require("../middleware/errorHandler");
const { getHostelDistance } = require("../controllers/distanceController");

const router = express.Router();

const distanceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many distance requests. Please wait a moment and try again." }
});

router.post("/hostel", distanceLimiter, asyncHandler(getHostelDistance));

module.exports = router;
