const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  getContactDetails,
  updateContactDetails,
  resetContactDetails
} = require("../controllers/contactDetailsController");

const router = express.Router();

router.get("/", asyncHandler(getContactDetails));
router.put("/", requireAuth, requireAdmin, asyncHandler(updateContactDetails));
router.post("/reset", requireAuth, requireAdmin, asyncHandler(resetContactDetails));

module.exports = router;
