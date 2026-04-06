const mongoose = require("mongoose");

const contactDetailsSchema = new mongoose.Schema(
  {
    singleton_key: { type: String, required: true, unique: true, default: "primary" },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    dashboard: {
      hero_tag: { type: String, default: "", trim: true },
      hero_title: { type: String, default: "", trim: true },
      hero_subtitle: { type: String, default: "", trim: true },
      hero_description: { type: String, default: "", trim: true },
      primary_cta_text: { type: String, default: "", trim: true },
      primary_cta_href: { type: String, default: "", trim: true },
      secondary_cta_text: { type: String, default: "", trim: true },
      secondary_cta_href: { type: String, default: "", trim: true },
      services_heading: { type: String, default: "", trim: true },
      services_subheading: { type: String, default: "", trim: true },
      feature_hostels_title: { type: String, default: "", trim: true },
      feature_hostels_desc: { type: String, default: "", trim: true },
      feature_facilities_title: { type: String, default: "", trim: true },
      feature_facilities_desc: { type: String, default: "", trim: true },
      feature_gallery_title: { type: String, default: "", trim: true },
      feature_gallery_desc: { type: String, default: "", trim: true },
      feature_findus_title: { type: String, default: "", trim: true },
      feature_findus_desc: { type: String, default: "", trim: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactDetails", contactDetailsSchema);
