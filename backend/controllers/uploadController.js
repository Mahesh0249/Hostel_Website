const cloudinary = require("../config/cloudinary");
const AuditLog = require("../models/AuditLog");

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "image file is required" });
  }

  const folder = String(req.body.folder || "hostel-project/uploads").trim();
  const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder });

  await AuditLog.create({
    admin_id: req.user.id,
    action: "upload_image",
    target_type: "Upload",
    target_id: "",
    details: {
      folder,
      image_url: uploadResult.secure_url
    }
  });

  return res.status(201).json({ image_url: uploadResult.secure_url });
}

module.exports = {
  uploadImage
};
