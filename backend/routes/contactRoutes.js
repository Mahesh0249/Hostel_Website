const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { createContactEnquiry, getContactEnquiries } = require("../controllers/contactController");

const router = express.Router();

router.post("/", asyncHandler(createContactEnquiry));
router.get("/", requireAuth, requireAdmin, asyncHandler(getContactEnquiries));

module.exports = router;
