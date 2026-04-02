const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
	seedAdmin,
	login,
	createAdmin,
	listAdmins,
	updateAdmin,
	deleteAdmin,
	transferOwnership
} = require("../controllers/adminController");

const router = express.Router();

router.post("/seed", asyncHandler(seedAdmin));
router.post("/login", asyncHandler(login));
router.get("/", requireAuth, requireAdmin, asyncHandler(listAdmins));
router.post("/", requireAuth, requireAdmin, asyncHandler(createAdmin));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(updateAdmin));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(deleteAdmin));
router.post("/:id/transfer-ownership", requireAuth, requireAdmin, asyncHandler(transferOwnership));

module.exports = router;
