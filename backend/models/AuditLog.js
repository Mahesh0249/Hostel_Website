const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    action: { type: String, required: true, trim: true },
    target_type: { type: String, required: true, trim: true },
    target_id: { type: String, default: "", trim: true },
    details: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
