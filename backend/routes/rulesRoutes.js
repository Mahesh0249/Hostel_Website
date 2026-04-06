const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  getRulesPolicy,
  updateRulesPolicy,
  resetRulesPolicy
} = require("../controllers/rulesController");

const router = express.Router();

router.get("/", asyncHandler(getRulesPolicy));
router.put("/", requireAuth, requireAdmin, asyncHandler(updateRulesPolicy));
router.post("/reset", requireAuth, requireAdmin, asyncHandler(resetRulesPolicy));

module.exports = router;
