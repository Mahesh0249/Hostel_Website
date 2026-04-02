const cloudinary = require("../config/cloudinary");
const Gallery = require("../models/Gallery");
const AuditLog = require("../models/AuditLog");

async function getGallery(_req, res) {
  const images = await Gallery.find().sort({ createdAt: -1 });
  return res.json(images);
}

async function uploadGalleryImage(req, res) {
  let imageUrl = String(req.body.image_url || "").trim();

  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "hostel-project/gallery"
    });
    imageUrl = uploadResult.secure_url;
  }

  if (!imageUrl) {
    return res.status(400).json({ message: "image file or image_url is required" });
  }

  const image = await Gallery.create({
    hostel_id: req.body.hostel_id || null,
    image_url: imageUrl,
    alt_text: String(req.body.alt_text || "Hostel image").trim(),
    is_main_gallery: String(req.body.is_main_gallery || "false") === "true",
    uploaded_by: req.user.id
  });

  await AuditLog.create({
    admin_id: req.user.id,
    action: "upload_gallery_image",
    target_type: "Gallery",
    target_id: String(image._id),
    details: { image_url: image.image_url }
  });

  return res.status(201).json(image);
}

async function deleteGalleryImage(req, res) {
  const { id } = req.params;
  const image = await Gallery.findById(id);

  if (!image) {
    return res.status(404).json({ message: "Gallery image not found" });
  }

  await image.deleteOne();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "delete_gallery_image",
    target_type: "Gallery",
    target_id: String(id),
    details: { image_url: image.image_url }
  });

  return res.json({ message: "Gallery image deleted" });
}

module.exports = {
  getGallery,
  uploadGalleryImage,
  deleteGalleryImage
};
