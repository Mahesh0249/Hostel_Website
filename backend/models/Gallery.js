const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    hostel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", default: null },
    image_url: { type: String, required: true },
    alt_text: { type: String, default: "Hostel image", trim: true },
    is_main_gallery: { type: Boolean, default: false },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
