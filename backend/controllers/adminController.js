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

async function seedAdmin(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Admin already exists" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password_hash
  });

  return res.status(201).json({
    message: "Admin created",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email
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
      role: admin.role
    }
  });
}

async function createAdmin(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Admin already exists with this email" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password_hash
  });

  return res.status(201).json({
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    }
  });
}

async function listAdmins(_req, res) {
  const admins = await Admin.find({}, { password_hash: 0 }).sort({ createdAt: -1 });
  return res.json(admins);
}

module.exports = {
  seedAdmin,
  login,
  createAdmin,
  listAdmins
};
