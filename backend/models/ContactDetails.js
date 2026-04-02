const mongoose = require("mongoose");

const contactDetailsSchema = new mongoose.Schema(
  {
    singleton_key: { type: String, required: true, unique: true, default: "primary" },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactDetails", contactDetailsSchema);
