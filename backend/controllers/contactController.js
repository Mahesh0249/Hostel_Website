const ContactEnquiry = require("../models/ContactEnquiry");

async function createContactEnquiry(req, res) {
  const { hostel, name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ message: "name, phone, and message are required" });
  }

  const enquiry = await ContactEnquiry.create({
    hostel: String(hostel || "General Enquiry").trim(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    message: String(message).trim(),
    source: "website"
  });

  return res.status(201).json({
    message: "Enquiry received",
    enquiryId: enquiry._id
  });
}

async function getContactEnquiries(req, res) {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 }).limit(limit);
  return res.json(enquiries);
}

module.exports = {
  createContactEnquiry,
  getContactEnquiries
};
