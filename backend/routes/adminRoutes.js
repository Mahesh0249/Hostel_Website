const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { seedAdmin, login, createAdmin, listAdmins } = require("../controllers/adminController");

const router = express.Router();

router.post("/seed", asyncHandler(seedAdmin));
router.post("/login", asyncHandler(login));
router.get("/", requireAuth, requireAdmin, asyncHandler(listAdmins));
router.post("/", requireAuth, requireAdmin, asyncHandler(createAdmin));

module.exports = router;
