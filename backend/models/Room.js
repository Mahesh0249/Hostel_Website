const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    type: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    available_beds: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
