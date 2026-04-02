const express = require("express");
const multer = require("multer");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  getGallery,
  uploadGalleryImage,
  deleteGalleryImage
} = require("../controllers/galleryController");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.get("/", asyncHandler(getGallery));
router.post("/", requireAuth, requireAdmin, upload.single("image"), asyncHandler(uploadGalleryImage));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(deleteGalleryImage));

module.exports = router;
