const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema(
  {
    hostel: { type: String, default: "General Enquiry", trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
