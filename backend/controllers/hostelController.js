const Hostel = require("../models/Hostel");
const AuditLog = require("../models/AuditLog");

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validateHostelBody(body) {
  if (!body.name || !body.description || !body.price_start) {
    return "name, description, and price_start are required";
  }
  return null;
}

async function getAllHostels(_req, res) {
  const hostels = await Hostel.find().sort({ createdAt: 1 });
  return res.json(hostels);
}

async function getHostelById(req, res) {
  const { id } = req.params;
  const hostel = await Hostel.findById(id);

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found" });
  }

  return res.json(hostel);
}

async function createHostel(req, res) {
  const error = validateHostelBody(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const payload = {
    name: req.body.name.trim(),
    slug: req.body.slug ? toSlug(req.body.slug) : toSlug(req.body.name),
    description: req.body.description.trim(),
    tagline: String(req.body.tagline || "").trim(),
    price_start: String(req.body.price_start || "").trim(),
    location: String(req.body.location || "").trim(),
    facilities: Array.isArray(req.body.facilities) ? req.body.facilities : [],
    hero_image_url: String(req.body.hero_image_url || "").trim(),
    card_image_url: String(req.body.card_image_url || "").trim(),
    gallery_urls: Array.isArray(req.body.gallery_urls) ? req.body.gallery_urls : [],
    rooms: Array.isArray(req.body.rooms) ? req.body.rooms : []
  };

  const exists = await Hostel.findOne({ slug: payload.slug });
  if (exists) {
    return res.status(409).json({ message: "Hostel slug already exists" });
  }

  const hostel = await Hostel.create(payload);

  await AuditLog.create({
    admin_id: req.user.id,
    action: "create_hostel",
    target_type: "Hostel",
    target_id: String(hostel._id),
    details: { name: hostel.name }
  });

  return res.status(201).json(hostel);
}

async function updateHostel(req, res) {
  const { id } = req.params;
  const hostel = await Hostel.findById(id);

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found" });
  }

  hostel.history.push({
    updated_by: req.user.id,
    previous_data: {
      name: hostel.name,
      slug: hostel.slug,
      description: hostel.description,
      tagline: hostel.tagline,
      price_start: hostel.price_start,
      location: hostel.location,
      facilities: hostel.facilities,
      hero_image_url: hostel.hero_image_url,
      card_image_url: hostel.card_image_url,
      gallery_urls: hostel.gallery_urls,
      rooms: hostel.rooms
    }
  });

  if (req.body.name) {
    hostel.name = String(req.body.name).trim();
  }
  if (req.body.slug) {
    hostel.slug = toSlug(req.body.slug);
  }
  if (req.body.description) {
    hostel.description = String(req.body.description).trim();
  }
  if (req.body.tagline !== undefined) {
    hostel.tagline = String(req.body.tagline).trim();
  }
  if (req.body.price_start) {
    hostel.price_start = String(req.body.price_start).trim();
  }
  if (req.body.location !== undefined) {
    hostel.location = String(req.body.location).trim();
  }
  if (Array.isArray(req.body.facilities)) {
    hostel.facilities = req.body.facilities;
  }
  if (req.body.hero_image_url !== undefined) {
    hostel.hero_image_url = String(req.body.hero_image_url).trim();
  }
  if (req.body.card_image_url !== undefined) {
    hostel.card_image_url = String(req.body.card_image_url).trim();
  }
  if (Array.isArray(req.body.gallery_urls)) {
    hostel.gallery_urls = req.body.gallery_urls;
  }
  if (Array.isArray(req.body.rooms)) {
    hostel.rooms = req.body.rooms;
  }

  await hostel.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "update_hostel",
    target_type: "Hostel",
    target_id: String(hostel._id),
    details: { name: hostel.name }
  });

  return res.json(hostel);
}

async function restoreLastVersion(req, res) {
  const { id } = req.params;
  const hostel = await Hostel.findById(id);

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found" });
  }

  if (!hostel.history.length) {
    return res.status(400).json({ message: "No backup history available" });
  }

  const last = hostel.history.pop();
  const previous = last.previous_data;

  hostel.name = previous.name;
  hostel.slug = previous.slug;
  hostel.description = previous.description;
  hostel.tagline = previous.tagline;
  hostel.price_start = previous.price_start;
  hostel.location = previous.location;
  hostel.facilities = previous.facilities;
  hostel.hero_image_url = previous.hero_image_url;
  hostel.card_image_url = previous.card_image_url;
  hostel.gallery_urls = previous.gallery_urls;
  hostel.rooms = previous.rooms;

  await hostel.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "restore_hostel",
    target_type: "Hostel",
    target_id: String(hostel._id),
    details: { restoredTo: previous.name }
  });

  return res.json(hostel);
}

module.exports = {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  restoreLastVersion
};
