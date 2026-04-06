const mongoose = require("mongoose");

const rulesSectionSchema = new mongoose.Schema(
  {
    section_id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    points: [{ type: String, trim: true }],
    sort_order: { type: Number, default: 0 }
  },
  { _id: false }
);

const rulesPolicySchema = new mongoose.Schema(
  {
    singleton_key: { type: String, required: true, unique: true, default: "primary" },
    page_title: { type: String, required: true, trim: true },
    intro_text: { type: String, default: "", trim: true },
    sections: [rulesSectionSchema],
    last_updated_label: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RulesPolicy", rulesPolicySchema);
