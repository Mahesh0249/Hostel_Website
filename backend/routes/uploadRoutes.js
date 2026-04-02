const express = require("express");
const multer = require("multer");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.post("/image", requireAuth, requireAdmin, upload.single("image"), asyncHandler(uploadImage));

module.exports = router;
