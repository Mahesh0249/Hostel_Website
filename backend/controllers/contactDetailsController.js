const ContactDetails = require("../models/ContactDetails");
const AuditLog = require("../models/AuditLog");

const defaultContactDetails = {
  phone: "+91 91214 30736",
  whatsapp: "919121430736",
  email: "enquiry@studentstays.local",
  address: "Locality, City, State"
};

async function findOrCreateContactDetails() {
  const existing = await ContactDetails.findOne({ singleton_key: "primary" });
  if (existing) {
    return existing;
  }

  return ContactDetails.create({
    singleton_key: "primary",
    ...defaultContactDetails
  });
}

async function getContactDetails(_req, res) {
  const record = await findOrCreateContactDetails();
  return res.json(record);
}

async function updateContactDetails(req, res) {
  const { phone, whatsapp, email, address } = req.body;

  if (!phone || !whatsapp || !email || !address) {
    return res.status(400).json({ message: "phone, whatsapp, email, and address are required" });
  }

  const record = await findOrCreateContactDetails();
  record.phone = String(phone).trim();
  record.whatsapp = String(whatsapp).trim().replace(/\D/g, "");
  record.email = String(email).trim();
  record.address = String(address).trim();
  await record.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "update_contact_details",
    target_type: "ContactDetails",
    target_id: String(record._id),
    details: {
      phone: record.phone,
      whatsapp: record.whatsapp,
      email: record.email
    }
  });

  return res.json(record);
}

async function resetContactDetails(req, res) {
  const record = await findOrCreateContactDetails();
  record.phone = defaultContactDetails.phone;
  record.whatsapp = defaultContactDetails.whatsapp;
  record.email = defaultContactDetails.email;
  record.address = defaultContactDetails.address;
  await record.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "reset_contact_details",
    target_type: "ContactDetails",
    target_id: String(record._id),
    details: { reset: true }
  });

  return res.json(record);
}

module.exports = {
  defaultContactDetails,
  getContactDetails,
  updateContactDetails,
  resetContactDetails
};
