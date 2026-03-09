const mongoose = require("mongoose");

const roomSnapshotSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    available_beds: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const hostelHistorySchema = new mongoose.Schema(
  {
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    previous_data: {
      name: String,
      slug: String,
      description: String,
      tagline: String,
      price_start: String,
      location: String,
      facilities: [String],
      hero_image_url: String,
      card_image_url: String,
      gallery_urls: [String],
      rooms: [roomSnapshotSchema]
    }
  },
  { timestamps: true, _id: false }
);

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    tagline: { type: String, default: "", trim: true },
    price_start: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    facilities: [{ type: String, trim: true }],
    hero_image_url: { type: String, default: "" },
    card_image_url: { type: String, default: "" },
    gallery_urls: [{ type: String, trim: true }],
    rooms: [roomSnapshotSchema],
    history: [hostelHistorySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
