const ContactDetails = require("../models/ContactDetails");
const AuditLog = require("../models/AuditLog");

const defaultContactDetails = {
  phone: "+91 91214 30736",
  whatsapp: "919121430736",
  email: "enquiry@studentstays.local",
  address: "Locality, City, State",
  dashboard: {
    hero_tag: "Located near major colleges and student hubs.",
    hero_title: "Sai Praneeth & Elvy Student Stays",
    hero_subtitle: "Affordable and Comfortable Student Hostels Near College",
    hero_description: "Safe, clean, and budget friendly PG accommodation with WiFi, food, and reliable connectivity.",
    primary_cta_text: "View Hostels",
    primary_cta_href: "/hostels",
    secondary_cta_text: "Contact Us",
    secondary_cta_href: "/contact",
    services_heading: "Explore Our Services",
    services_subheading: "Use these quick links to access every part of the website.",
    feature_hostels_title: "Hostels",
    feature_hostels_desc: "Compare rooms, pricing, and details for all hostels.",
    feature_facilities_title: "Facilities",
    feature_facilities_desc: "Review services available across our properties.",
    feature_gallery_title: "Gallery",
    feature_gallery_desc: "See room interiors, common spaces, and exteriors.",
    feature_findus_title: "Find Us",
    feature_findus_desc: "Estimate distance and travel time from your location."
  }
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
  const { phone, whatsapp, email, address, dashboard } = req.body;

  if (!phone || !whatsapp || !email || !address) {
    return res.status(400).json({ message: "phone, whatsapp, email, and address are required" });
  }

  const record = await findOrCreateContactDetails();
  record.phone = String(phone).trim();
  record.whatsapp = String(whatsapp).trim().replace(/\D/g, "");
  record.email = String(email).trim();
  record.address = String(address).trim();

  const nextDashboard = dashboard && typeof dashboard === "object" ? dashboard : {};
  record.dashboard = {
    hero_tag: String(nextDashboard.hero_tag || defaultContactDetails.dashboard.hero_tag).trim(),
    hero_title: String(nextDashboard.hero_title || defaultContactDetails.dashboard.hero_title).trim(),
    hero_subtitle: String(nextDashboard.hero_subtitle || defaultContactDetails.dashboard.hero_subtitle).trim(),
    hero_description: String(nextDashboard.hero_description || defaultContactDetails.dashboard.hero_description).trim(),
    primary_cta_text: String(nextDashboard.primary_cta_text || defaultContactDetails.dashboard.primary_cta_text).trim(),
    primary_cta_href: String(nextDashboard.primary_cta_href || defaultContactDetails.dashboard.primary_cta_href).trim(),
    secondary_cta_text: String(nextDashboard.secondary_cta_text || defaultContactDetails.dashboard.secondary_cta_text).trim(),
    secondary_cta_href: String(nextDashboard.secondary_cta_href || defaultContactDetails.dashboard.secondary_cta_href).trim(),
    services_heading: String(nextDashboard.services_heading || defaultContactDetails.dashboard.services_heading).trim(),
    services_subheading: String(nextDashboard.services_subheading || defaultContactDetails.dashboard.services_subheading).trim(),
    feature_hostels_title: String(nextDashboard.feature_hostels_title || defaultContactDetails.dashboard.feature_hostels_title).trim(),
    feature_hostels_desc: String(nextDashboard.feature_hostels_desc || defaultContactDetails.dashboard.feature_hostels_desc).trim(),
    feature_facilities_title: String(nextDashboard.feature_facilities_title || defaultContactDetails.dashboard.feature_facilities_title).trim(),
    feature_facilities_desc: String(nextDashboard.feature_facilities_desc || defaultContactDetails.dashboard.feature_facilities_desc).trim(),
    feature_gallery_title: String(nextDashboard.feature_gallery_title || defaultContactDetails.dashboard.feature_gallery_title).trim(),
    feature_gallery_desc: String(nextDashboard.feature_gallery_desc || defaultContactDetails.dashboard.feature_gallery_desc).trim(),
    feature_findus_title: String(nextDashboard.feature_findus_title || defaultContactDetails.dashboard.feature_findus_title).trim(),
    feature_findus_desc: String(nextDashboard.feature_findus_desc || defaultContactDetails.dashboard.feature_findus_desc).trim()
  };
  await record.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "update_contact_details",
    target_type: "ContactDetails",
    target_id: String(record._id),
    details: {
      phone: record.phone,
      whatsapp: record.whatsapp,
      email: record.email,
      dashboard_updated: true
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
  record.dashboard = defaultContactDetails.dashboard;
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
