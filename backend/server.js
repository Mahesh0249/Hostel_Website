require("dotenv").config();

const express = require("express");
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
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
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

app.get("/", (_req, res) => {
  res.send("Hostel API running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contact-details", contactDetailsRoutes);
app.use("/api/uploads", uploadRoutes);

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
