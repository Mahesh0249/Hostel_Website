require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const contactDetailsRoutes = require("./routes/contactDetailsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const distanceRoutes = require("./routes/distanceRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = Number(process.env.PORT || 5000);
const frontendRoot = path.resolve(__dirname, "../frontend");

app.use(
  helmet({
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        // Allow trusted external image hosts (Cloudflare/Cloudinary/etc.).
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: [
          "'self'",
          "https://nominatim.openstreetmap.org",
          "https://router.project-osrm.org",
          "https://tile.openstreetmap.org",
          "https://a.tile.openstreetmap.org",
          "https://b.tile.openstreetmap.org",
          "https://c.tile.openstreetmap.org"
        ],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "https://unpkg.com"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        upgradeInsecureRequests: []
      }
    }
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "*"
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.send("Hostel API running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contact-details", contactDetailsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/distance", distanceRoutes);

app.use(express.static(frontendRoot));

const pageRoutes = {
  "/": "index.html",
  "/home": "index.html",
  "/hostels": "pages/hostels.html",
  "/facilities": "pages/facilities.html",
  "/gallery": "pages/gallery.html",
  "/distance": "pages/distance.html",
  "/contact": "pages/contact.html",
  "/admin": "pages/admin.html",
  "/admin/contact": "pages/admin-contact.html",
  "/admin/hostels": "pages/admin-hostels.html",
  "/admin/gallery": "pages/admin-gallery.html",
  "/admin/users": "pages/admin-users.html",
  "/elvy-stays": "pages/elvy-stays.html",
  "/hostel-praneeth1": "pages/hostel-praneeth1.html",
  "/hostel-praneeth2": "pages/hostel-praneeth2.html"
};

for (const [routePath, filePath] of Object.entries(pageRoutes)) {
  app.get(routePath, (_req, res) => {
    res.sendFile(path.join(frontendRoot, filePath));
  });
}

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  const normalizedPath = req.path.replace(/\/+$/, "") || "/";
  const mappedPage = pageRoutes[normalizedPath];

  if (mappedPage) {
    return res.sendFile(path.join(frontendRoot, mappedPage));
  }

  // Fallback to home page for unknown non-API routes.
  return res.sendFile(path.join(frontendRoot, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(port, () => {
    process.stdout.write(`Backend listening on http://localhost:${port}\n`);
  });
}

start().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
