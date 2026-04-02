const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function buildToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function normalizeOwnership(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "owner") {
    return "Owner";
  }
  return "Managed";
}

function normalizeAccessType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "full access" || normalized === "full") {
    return "Full Access";
  }
  return "Limited Access";
}

function isSeedEnabled() {
  const allowSeed = String(process.env.ALLOW_ADMIN_SEED || "").trim().toLowerCase() === "true";
  const nodeEnv = String(process.env.NODE_ENV || "development").trim().toLowerCase();
  return allowSeed || nodeEnv !== "production";
}

function hasPrivilegedOwnerAccess(admin) {
  return Boolean(admin && admin.role === "admin" && admin.ownership === "Owner" && admin.access_type === "Full Access");
}

async function getRequesterAdmin(req) {
  if (!req.user?.id) {
    return null;
  }
  return Admin.findById(req.user.id);
}

async function seedAdmin(req, res) {
  const { name, email, password, ownership, access_type } = req.body;

  if (!isSeedEnabled()) {
    return res.status(403).json({
      message: "Admin bootstrap is disabled. Set ALLOW_ADMIN_SEED=true temporarily to enable it."
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const totalAdmins = await Admin.countDocuments();
  if (totalAdmins > 0) {
    return res.status(409).json({ message: "Seed is one-time only. Admin already exists." });
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Admin already exists" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password_hash,
    ownership: normalizeOwnership(ownership),
    access_type: normalizeAccessType(access_type)
  });

  return res.status(201).json({
    message: "Admin created",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      ownership: admin.ownership,
      access_type: admin.access_type
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const matches = await bcrypt.compare(password, admin.password_hash);
  if (!matches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = buildToken(admin);
  return res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      ownership: admin.ownership,
      access_type: admin.access_type
    }
  });
}

async function createAdmin(req, res) {
  const { name, email, password, ownership, access_type } = req.body;
  const requester = await getRequesterAdmin(req);

  if (!hasPrivilegedOwnerAccess(requester)) {
    return res.status(403).json({ message: "Only owner with full access can create admins" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Admin already exists with this email" });
  }

  const normalizedOwnership = normalizeOwnership(ownership);
  if (normalizedOwnership === "Owner") {
    const ownerExists = await Admin.exists({ ownership: "Owner" });
    if (ownerExists) {
      return res.status(400).json({ message: "An owner already exists. Use transfer ownership option." });
    }
  }

  const password_hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password_hash,
    ownership: normalizedOwnership,
    access_type: normalizeAccessType(access_type)
  });

  return res.status(201).json({
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      ownership: admin.ownership,
      access_type: admin.access_type,
      createdAt: admin.createdAt
    }
  });
}

async function listAdmins(_req, res) {
  const admins = await Admin.find({}, { password_hash: 0 }).sort({ createdAt: -1 });
  return res.json(admins);
}

async function updateAdmin(req, res) {
  const { id } = req.params;
  const requester = await getRequesterAdmin(req);
  const admin = await Admin.findById(id);

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isSelfUpdate = String(requester?._id || "") === String(admin._id);
  const canManageAnyAdmin = hasPrivilegedOwnerAccess(requester);
  if (!isSelfUpdate && !canManageAnyAdmin) {
    return res.status(403).json({ message: "Only owner with full access can update other admins" });
  }

  const nextName = req.body.name !== undefined ? String(req.body.name).trim() : admin.name;
  const nextEmail = req.body.email !== undefined ? String(req.body.email).trim().toLowerCase() : admin.email;
  const requestedOwnership = req.body.ownership !== undefined ? normalizeOwnership(req.body.ownership) : admin.ownership;
  const requestedAccessType = req.body.access_type !== undefined ? normalizeAccessType(req.body.access_type) : admin.access_type;

  const nextOwnership = canManageAnyAdmin ? requestedOwnership : admin.ownership;
  const nextAccessType = canManageAnyAdmin ? requestedAccessType : admin.access_type;

  if (!nextName || !nextEmail) {
    return res.status(400).json({ message: "name and email are required" });
  }

  const emailTaken = await Admin.findOne({ email: nextEmail, _id: { $ne: admin._id } });
  if (emailTaken) {
    return res.status(409).json({ message: "Another admin already uses this email" });
  }

  if (admin.ownership === "Owner" && nextOwnership !== "Owner") {
    const ownerCount = await Admin.countDocuments({ ownership: "Owner", _id: { $ne: admin._id } });
    if (ownerCount === 0) {
      return res.status(400).json({ message: "At least one owner must remain" });
    }
  }

  if (admin.ownership !== "Owner" && nextOwnership === "Owner") {
    const anotherOwner = await Admin.exists({ ownership: "Owner", _id: { $ne: admin._id } });
    if (anotherOwner) {
      return res.status(400).json({ message: "Use transfer ownership option to change owner" });
    }
  }

  admin.name = nextName;
  admin.email = nextEmail;
  admin.ownership = nextOwnership;
  admin.access_type = nextAccessType;

  if (req.body.password !== undefined && String(req.body.password || "").trim()) {
    admin.password_hash = await bcrypt.hash(String(req.body.password), 10);
  }

  await admin.save();

  return res.json({
    message: "Admin updated successfully",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      ownership: admin.ownership,
      access_type: admin.access_type,
      createdAt: admin.createdAt
    }
  });
}

async function deleteAdmin(req, res) {
  const { id } = req.params;
  const requester = await getRequesterAdmin(req);

  if (!hasPrivilegedOwnerAccess(requester)) {
    return res.status(403).json({ message: "Only owner with full access can remove admins" });
  }

  if (String(req.user.id) === String(id)) {
    return res.status(400).json({ message: "You cannot remove your own logged-in account" });
  }

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const totalAdmins = await Admin.countDocuments();
  if (totalAdmins <= 1) {
    return res.status(400).json({ message: "Cannot remove the last admin" });
  }

  if (admin.ownership === "Owner") {
    const ownerCount = await Admin.countDocuments({ ownership: "Owner", _id: { $ne: admin._id } });
    if (ownerCount === 0) {
      return res.status(400).json({ message: "Transfer ownership before removing this owner" });
    }
  }

  await Admin.findByIdAndDelete(id);
  return res.json({ message: "Admin removed successfully" });
}

async function transferOwnership(req, res) {
  const { id } = req.params;
  const requester = await getRequesterAdmin(req);

  if (!hasPrivilegedOwnerAccess(requester)) {
    return res.status(403).json({ message: "Only current owner with full access can transfer ownership" });
  }

  if (String(requester?._id || "") === String(id)) {
    return res.status(400).json({ message: "You are already the current owner" });
  }

  const target = await Admin.findById(id);

  if (!target) {
    return res.status(404).json({ message: "Target admin not found" });
  }

  await Admin.updateMany({}, { $set: { ownership: "Managed" } });
  target.ownership = "Owner";
  await target.save();

  return res.json({
    message: "Ownership transferred successfully",
    admin: {
      id: target._id,
      name: target.name,
      email: target.email,
      ownership: target.ownership,
      access_type: target.access_type
    }
  });
}

module.exports = {
  seedAdmin,
  login,
  createAdmin,
  listAdmins,
  updateAdmin,
  deleteAdmin,
  transferOwnership
};
