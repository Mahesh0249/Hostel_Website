const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  restoreLastVersion
} = require("../controllers/hostelController");

const router = express.Router();

router.get("/", asyncHandler(getAllHostels));
router.get("/:id", asyncHandler(getHostelById));

router.post("/", requireAuth, requireAdmin, asyncHandler(createHostel));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(updateHostel));
router.post("/:id/restore", requireAuth, requireAdmin, asyncHandler(restoreLastVersion));

module.exports = router;
