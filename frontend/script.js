const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const API_BASE_URL =
  window.HOSTEL_API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://hostel-website-9uc9.onrender.com");

const defaultContactDetails = {
  phone: "+91 91214 30736",
  whatsapp: "919121430736",
  email: "enquiry@studentstays.local",
  address: "Locality, City, State"
};

const defaultMainGallery = [
  "https://images.unsplash.com/photo-1616594039964-3fd3d3f4c2b8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80"
];

const defaultHostelsData = {
  praneeth1: {
    name: "Sai Praneeth Boys Hostel 1",
    tagline: "Affordable shared rooms with WiFi, mess, and comfortable student living.",
    startingPrice: "Starting from ₹4500 / month",
    description:
      "Perfect for students looking for value and convenience. The hostel is close to colleges and essential shops, with a friendly student atmosphere.",
    cardImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    facilities: [
      "High Speed WiFi",
      "Daily Mess Food",
      "Laundry Service",
      "24/7 Security",
      "Drinking Water"
    ],
    rooms: [
      { type: "3 Sharing", price: "₹4500" },
      { type: "4 Sharing", price: "₹4200" }
    ],
    availability: ["3 Sharing – 2 beds available", "4 Sharing – Full"],
    gallery: [
      "https://images.unsplash.com/photo-1616594039964-3fd3d3f4c2b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  praneeth2: {
    name: "Sai Praneeth Boys Hostel 2",
    tagline: "Newly built hostel with upgraded rooms and attached bathrooms.",
    startingPrice: "Starting from ₹5000 / month",
    description:
      "A modern setup for students who want upgraded comfort and better privacy with easy access to nearby colleges and transport points.",
    cardImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    facilities: [
      "High Speed WiFi",
      "Attached Bathrooms",
      "Power Backup",
      "CCTV Monitoring",
      "24/7 Security"
    ],
    rooms: [
      { type: "2 Sharing", price: "₹5800" },
      { type: "3 Sharing", price: "₹5000" }
    ],
    availability: ["2 Sharing – 1 bed available", "3 Sharing – 3 beds available"],
    gallery: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560067174-89474a6f3f95?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  elvy: {
    name: "Elvy Stays",
    tagline: "Premium student stay with a quieter and more comfortable environment.",
    startingPrice: "Starting from ₹6500 / month",
    description:
      "Elvy Stays is built for students who prefer a calm and premium setting while still staying close to campus life and city essentials.",
    cardImage:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
    facilities: [
      "High Speed WiFi",
      "Well Maintained Premium Rooms",
      "Quiet Study-Friendly Environment",
      "Power Backup",
      "CCTV Monitoring"
    ],
    rooms: [
      { type: "Single Occupancy", price: "₹8500" },
      { type: "2 Sharing", price: "₹6500" }
    ],
    availability: ["Single Occupancy – Full", "2 Sharing – 2 beds available"],
    gallery: [
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ]
  }
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

let contactDetails = deepClone(defaultContactDetails);
let hostelsData = deepClone(defaultHostelsData);
let mainGalleryData = deepClone(defaultMainGallery);
let mainGalleryRecordIds = [];
const ADMIN_TOKEN_STORAGE_KEY = "hostelAdminToken";
let adminToken = "";
const apiHostelsByKey = {};

function setAdminToken(token) {
  const normalizedToken = String(token || "").trim();
  adminToken = normalizedToken;

  if (typeof window === "undefined") {
    return;
  }

  if (normalizedToken) {
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, normalizedToken);
  } else {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  }
}

function restoreAdminToken() {
  if (typeof window === "undefined") {
    return;
  }
  setAdminToken(window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "");
}

function saveHostelsData() {}

function saveMainGalleryData() {}

function getWhatsappMessage(baseMessage) {
  return encodeURIComponent(baseMessage || "Hi, I want to book a room");
}

function updateWhatsappHref(originalHref, whatsappNumber) {
  try {
    const url = new URL(originalHref);
    url.pathname = `/${whatsappNumber}`;
    if (!url.searchParams.has("text")) {
      url.searchParams.set("text", getWhatsappMessage("Hi, I want to book a room"));
    }
    return url.toString();
  } catch (_error) {
    return `https://wa.me/${whatsappNumber}?text=${getWhatsappMessage("Hi, I want to book a room")}`;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function parseLineList(text) {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeImageUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("drive.google.com")) {
      const filePathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      if (filePathMatch?.[1]) {
        return `https://drive.google.com/uc?export=view&id=${filePathMatch[1]}`;
      }

      const idParam = parsed.searchParams.get("id");
      if (idParam) {
        return `https://drive.google.com/uc?export=view&id=${idParam}`;
      }
    }

    return raw;
  } catch (_error) {
    return raw;
  }
}

function parseImageUrls(text) {
  return parseLineList(text)
    .map((url) => normalizeImageUrl(url))
    .filter(Boolean);
}

function parseRooms(text) {
  return parseLineList(text)
    .map((line) => {
      const [type, price] = line.split("|");
      if (!type || !price) {
        return null;
      }
      return { type: type.trim(), price: price.trim() };
    })
    .filter(Boolean);
}

async function apiFetchWithRetry(path, options = {}, retries = 2) {
  const request = {
    ...options,
    headers: {
      ...(options.headers || {})
    }
  };

  let latestError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, request);
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || `Request failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      latestError = error;
      if (attempt < retries) {
        await new Promise((resolve) => {
          setTimeout(resolve, 400 * (attempt + 1));
        });
      }
    }
  }

  throw latestError;
}

function hostelKeyFromApi(hostel) {
  const slug = String(hostel.slug || "").toLowerCase();
  const name = String(hostel.name || "").toLowerCase();

  if (slug.includes("hostel-1") || name.includes("hostel 1")) {
    return "praneeth1";
  }
  if (slug.includes("hostel-2") || name.includes("hostel 2")) {
    return "praneeth2";
  }
  if (slug.includes("elvy") || name.includes("elvy")) {
    return "elvy";
  }

  return slug || name.replaceAll(" ", "-") || "unknown-hostel";
}

function mapApiHostelToFrontend(hostel) {
  const rooms = Array.isArray(hostel.rooms)
    ? hostel.rooms.map((room) => ({
      type: String(room.type || "").trim(),
      price: String(room.price || "").trim()
    }))
    : [];

  const availability = Array.isArray(hostel.rooms)
    ? hostel.rooms.map((room) => `${room.type} – ${room.available_beds || "Full"}`)
    : [];

  return {
    id: String(hostel._id || "").trim(),
    name: String(hostel.name || "").trim(),
    tagline: String(hostel.tagline || "").trim(),
    startingPrice: String(hostel.price_start || "").trim(),
    description: String(hostel.description || "").trim(),
    cardImage: String(hostel.card_image_url || "").trim(),
    heroImage: String(hostel.hero_image_url || "").trim(),
    facilities: Array.isArray(hostel.facilities) ? hostel.facilities : [],
    rooms,
    availability,
    gallery: Array.isArray(hostel.gallery_urls) ? hostel.gallery_urls : []
  };
}

function getAuthHeaders() {
  if (!adminToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${adminToken}`
  };
}

async function hydrateContactDetailsFromApi() {
  try {
    const response = await apiFetchWithRetry("/api/contact-details", { method: "GET" });
    const details = await response.json();
    if (!details) {
      return;
    }

    contactDetails = {
      phone: String(details.phone || defaultContactDetails.phone).trim(),
      whatsapp: String(details.whatsapp || defaultContactDetails.whatsapp).trim(),
      email: String(details.email || defaultContactDetails.email).trim(),
      address: String(details.address || defaultContactDetails.address).trim()
    };
    applyContactDetailsToPage();
  } catch (_error) {
  }
}

async function uploadImageToApi(file, folder = "hostel-project/uploads") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const response = await apiFetchWithRetry("/api/uploads/image", {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });

  const result = await response.json();
  return String(result.image_url || "").trim();
}

function getAvailableBedsByRoomType(availabilityLines, roomType, fallback) {
  const normalizedType = String(roomType || "").toLowerCase();
  const line = availabilityLines.find((item) => String(item).toLowerCase().startsWith(normalizedType));
  if (!line) {
    return fallback || "Full";
  }

  const parts = String(line).split("–");
  if (parts.length > 1) {
    return parts.slice(1).join("–").trim() || fallback || "Full";
  }

  const dashParts = String(line).split("-");
  if (dashParts.length > 1) {
    return dashParts.slice(1).join("-").trim() || fallback || "Full";
  }

  return fallback || "Full";
}

async function hydrateHostelsFromApi() {
  try {
    const response = await apiFetchWithRetry("/api/hostels", { method: "GET" });
    const hostels = await response.json();
    if (!Array.isArray(hostels) || !hostels.length) {
      return;
    }

    const mapped = {};
    hostels.forEach((hostel) => {
      const key = hostelKeyFromApi(hostel);
      mapped[key] = mapApiHostelToFrontend(hostel);
      apiHostelsByKey[key] = hostel;
    });

    hostelsData = {
      ...hostelsData,
      ...mapped
    };
    saveHostelsData();
    applyHostelCardsData();
    applyHostelDetailData();
  } catch (_error) {
  }
}

async function hydrateGalleryFromApi() {
  try {
    const response = await apiFetchWithRetry("/api/gallery", { method: "GET" });
    const images = await response.json();
    if (!Array.isArray(images) || !images.length) {
      return;
    }

    const mainGalleryEntries = images.filter((item) => item.is_main_gallery);
    const galleryEntries = mainGalleryEntries.length ? mainGalleryEntries : images;

    const mainImages = galleryEntries
      .map((item) => String(item.image_url || "").trim())
      .filter(Boolean);

    mainGalleryRecordIds = mainGalleryEntries
      .map((item) => String(item._id || ""))
      .filter(Boolean);

    if (mainImages.length) {
      mainGalleryData = mainImages;
      saveMainGalleryData();
      applyMainGalleryData();
    }
  } catch (_error) {
  }
}

async function submitEnquiryToApi(payload) {
  await apiFetchWithRetry("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

async function saveContactDetailsToApi(payload) {
  const response = await apiFetchWithRetry("/api/contact-details", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  return response.json();
}

async function resetContactDetailsToApi() {
  const response = await apiFetchWithRetry("/api/contact-details/reset", {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    }
  });
  return response.json();
}

function buildHostelEnquiryText(hostelName) {
  return getWhatsappMessage(`Hi, I am interested in ${hostelName}`);
}

function buildHostelAvailabilityText(hostelName) {
  return getWhatsappMessage(`Hi, I want availability for ${hostelName}`);
}

function applyContactDetailsToPage() {
  const phoneText = document.getElementById("contactPhoneText");
  const whatsappText = document.getElementById("contactWhatsappText");
  const emailText = document.getElementById("contactEmailText");
  const addressText = document.getElementById("contactAddressText");
  const contactCallLink = document.getElementById("contactCallLink");
  const contactWhatsappLink = document.getElementById("contactWhatsappLink");

  if (phoneText) {
    phoneText.textContent = contactDetails.phone;
  }
  if (whatsappText) {
    whatsappText.textContent = `+${contactDetails.whatsapp}`;
  }
  if (emailText) {
    emailText.textContent = contactDetails.email;
  }
  if (addressText) {
    addressText.textContent = contactDetails.address;
  }
  if (contactCallLink) {
    contactCallLink.href = `tel:${contactDetails.phone.replace(/\s+/g, "")}`;
  }
  if (contactWhatsappLink) {
    contactWhatsappLink.href = `https://wa.me/${contactDetails.whatsapp}?text=${getWhatsappMessage("Hi, I want to book a room")}`;
  }

  const whatsappDisplay = String(contactDetails.whatsapp || "").startsWith("+")
    ? String(contactDetails.whatsapp || "")
    : `+${contactDetails.whatsapp}`;

  document.querySelectorAll(".site-footer p").forEach((node) => {
    const text = String(node.textContent || "").trim();

    if (/^Phone number\s*:/i.test(text)) {
      node.textContent = `Phone number: ${contactDetails.phone}`;
      return;
    }

    if (/^Address\s*:/i.test(text)) {
      node.textContent = `Address: ${contactDetails.address}`;
      return;
    }

    if (/^WhatsApp\s*:/i.test(text)) {
      node.textContent = `WhatsApp: ${whatsappDisplay}`;
    }
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:${contactDetails.phone.replace(/\s+/g, "")}`;
  });

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.href = updateWhatsappHref(link.href, contactDetails.whatsapp);
  });
}

function applyHostelCardsData() {
  document.querySelectorAll("[data-hostel-card]").forEach((card) => {
    const key = card.getAttribute("data-hostel-card");
    const data = hostelsData[key];
    if (!data) {
      return;
    }

    const image = card.querySelector(".hostel-card-image");
    const name = card.querySelector(".hostel-card-name");
    const desc = card.querySelector(".hostel-card-desc");
    const price = card.querySelector(".hostel-card-price");
    const wa = card.querySelector(".hostel-card-wa");

    if (image) {
      image.src = data.cardImage;
      image.alt = data.name;
    }
    if (name) {
      name.textContent = data.name;
    }
    if (desc) {
      desc.textContent = data.tagline;
    }
    if (price) {
      price.textContent = data.startingPrice;
    }
    if (wa) {
      wa.href = `https://wa.me/${contactDetails.whatsapp}?text=${buildHostelEnquiryText(data.name)}`;
    }
  });
}

function applyHostelDetailData() {
  const key = document.body.dataset.hostelDetail;
  if (!key || !hostelsData[key]) {
    return;
  }

  const data = hostelsData[key];
  const hero = document.getElementById("detailHeroSection");
  const name = document.getElementById("detailHostelName");
  const tagline = document.getElementById("detailTagline");
  const desc = document.getElementById("detailDescription");
  const facilitiesList = document.getElementById("detailFacilitiesList");
  const roomTableBody = document.getElementById("detailRoomTableBody");
  const availabilityList = document.getElementById("detailAvailabilityList");
  const waLink = document.getElementById("detailWhatsappLink");
  const galleryGrid = document.getElementById("detailGalleryGrid");

  if (hero) {
    hero.style.backgroundImage = `url('${data.heroImage}')`;
  }
  if (name) {
    name.textContent = data.name;
  }
  if (tagline) {
    tagline.textContent = data.tagline;
  }
  if (desc) {
    desc.textContent = data.description;
  }
  if (facilitiesList) {
    facilitiesList.innerHTML = data.facilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }
  if (roomTableBody) {
    roomTableBody.innerHTML = data.rooms
      .map((room) => `<tr><td>${escapeHtml(room.type)}</td><td>${escapeHtml(room.price)}</td></tr>`)
      .join("");
  }
  if (availabilityList) {
    availabilityList.innerHTML = data.availability.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  }
  if (waLink) {
    waLink.href = `https://wa.me/${contactDetails.whatsapp}?text=${buildHostelAvailabilityText(data.name)}`;
  }
  if (galleryGrid) {
    galleryGrid.innerHTML = data.gallery
      .map((img, index) => `<img src="${escapeHtml(img)}" alt="${escapeHtml(data.name)} image ${index + 1}" />`)
      .join("");
  }
}

function applyMainGalleryData() {
  const mainGalleryGrid = document.getElementById("mainGalleryGrid");
  if (!mainGalleryGrid) {
    return;
  }

  mainGalleryGrid.innerHTML = mainGalleryData
    .map((img, index) => `<img src="${escapeHtml(img)}" alt="Hostel gallery image ${index + 1}" />`)
    .join("");
}

menuToggle?.addEventListener("click", () => {
  mainNav?.classList.toggle("show");
});

document.addEventListener("click", (event) => {
  if (!mainNav || !menuToggle) {
    return;
  }

  const clickedInsideNav = mainNav.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideNav && !clickedToggle) {
    mainNav.classList.remove("show");
  }
});

const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("active");
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (!targetElement) {
      return;
    }

    event.preventDefault();
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const distanceSamples = [
  { keys: ["railway", "station", "train"], km: 2.8, mins: 10 },
  { keys: ["bus", "stand", "stop"], km: 1.9, mins: 7 },
  { keys: ["college", "campus", "university"], km: 1.2, mins: 5 },
  { keys: ["market", "supermarket", "mall"], km: 1.5, mins: 6 },
  { keys: ["hospital", "medical"], km: 2.1, mins: 8 }
];

function getDistanceData(query) {
  const normalizedQuery = query.toLowerCase();
  const matched = distanceSamples.find((entry) =>
    entry.keys.some((key) => normalizedQuery.includes(key))
  );

  if (matched) {
    return matched;
  }

  const seededValue = normalizedQuery
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const km = (1 + (seededValue % 60) / 10).toFixed(1);
  const mins = Math.round(Number(km) * 3.8);

  return { km: Number(km), mins };
}

const distanceForm = document.getElementById("distanceForm");
const locationInput = document.getElementById("locationInput");
const distanceResult = document.getElementById("distanceResult");
const mapLink = document.getElementById("mapLink");

function renderDistanceResult(location) {
  if (!distanceResult || !locationInput) {
    return;
  }

  if (!location) {
    distanceResult.innerHTML = "<p>Please enter a location to calculate distance.</p>";
    return;
  }

  const { km, mins } = getDistanceData(location);
  distanceResult.innerHTML = `<p>Distance: ${km} km</p><p>Travel Time: ${mins} minutes</p>`;

  if (mapLink) {
    const query = encodeURIComponent(`Sai Praneeth & Elvy Student Stays from ${location}`);
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
    mapLink.hidden = false;
  }
}

distanceForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderDistanceResult(locationInput?.value.trim() || "");
});

const contactForms = document.querySelectorAll(".contact-form");
contactForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const hostel = String(formData.get("hostel") || "General Enquiry").trim();
    const statusNode = form.querySelector(".status-text");

    if (!name || !phone || !message) {
      if (statusNode) {
        statusNode.textContent = "Please fill all fields before sending.";
      }
      return;
    }

    if (statusNode) {
      statusNode.textContent = "Submitting enquiry...";
    }

    try {
      await submitEnquiryToApi({ hostel, name, phone, message });
      if (statusNode) {
        statusNode.textContent = "Enquiry submitted. Opening WhatsApp...";
      }
    } catch (_error) {
      if (statusNode) {
        statusNode.textContent = "Could not reach server. Opening WhatsApp directly...";
      }
    }

    const whatsappMessage = encodeURIComponent(
      `Hostel: ${hostel}\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`
    );

    window.open(`https://wa.me/${contactDetails.whatsapp}?text=${whatsappMessage}`, "_blank", "noopener,noreferrer");

    if (statusNode) {
      statusNode.textContent = "Opening WhatsApp with your enquiry...";
    }

    form.reset();
  });
});

const adminLoginForm = document.getElementById("adminLoginForm");
const adminEmailInput = document.getElementById("adminEmailInput");
const adminKeyInput = document.getElementById("adminKeyInput");
const adminLoginStatus = document.getElementById("adminLoginStatus");
const adminEditor = document.getElementById("adminEditor");
const hostelEditor = document.getElementById("hostelEditor");
const galleryEditor = document.getElementById("galleryEditor");
const enquiryEditor = document.getElementById("enquiryEditor");
const refreshEnquiriesBtn = document.getElementById("refreshEnquiriesBtn");
const enquiryStatus = document.getElementById("enquiryStatus");
const enquiriesList = document.getElementById("enquiriesList");
const adminUserEditor = document.getElementById("adminUserEditor");
const createAdminForm = document.getElementById("createAdminForm");
const newAdminName = document.getElementById("newAdminName");
const newAdminEmail = document.getElementById("newAdminEmail");
const newAdminPassword = document.getElementById("newAdminPassword");
const newAdminPasswordConfirm = document.getElementById("newAdminPasswordConfirm");
const adminUserStatus = document.getElementById("adminUserStatus");
const refreshAdminsBtn = document.getElementById("refreshAdminsBtn");
const adminsList = document.getElementById("adminsList");

const adminContactForm = document.getElementById("adminContactForm");
const adminResetBtn = document.getElementById("adminResetBtn");
const adminStatus = document.getElementById("adminStatus");
const adminPhone = document.getElementById("adminPhone");
const adminWhatsapp = document.getElementById("adminWhatsapp");
const adminEmail = document.getElementById("adminEmail");
const adminAddress = document.getElementById("adminAddress");

const hostelDataForm = document.getElementById("hostelDataForm");
const adminHostelSelect = document.getElementById("adminHostelSelect");
const adminHostelName = document.getElementById("adminHostelName");
const adminHostelTagline = document.getElementById("adminHostelTagline");
const adminHostelPrice = document.getElementById("adminHostelPrice");
const adminHostelDescription = document.getElementById("adminHostelDescription");
const adminFacilities = document.getElementById("adminFacilities");
const adminRooms = document.getElementById("adminRooms");
const adminAvailability = document.getElementById("adminAvailability");
const adminCardImage = document.getElementById("adminCardImage");
const adminHeroImage = document.getElementById("adminHeroImage");
const adminGalleryUrls = document.getElementById("adminGalleryUrls");
const facilityTemplateSelect = document.getElementById("facilityTemplateSelect");
const addFacilityTemplateBtn = document.getElementById("addFacilityTemplateBtn");
const customFacilityInput = document.getElementById("customFacilityInput");
const addCustomFacilityBtn = document.getElementById("addCustomFacilityBtn");
const facilitiesListBuilder = document.getElementById("facilitiesListBuilder");
const roomsBuilderBody = document.getElementById("roomsBuilderBody");
const addRoomRowBtn = document.getElementById("addRoomRowBtn");
const galleryUrlInput = document.getElementById("galleryUrlInput");
const addGalleryUrlBtn = document.getElementById("addGalleryUrlBtn");
const galleryBulkInput = document.getElementById("galleryBulkInput");
const addGalleryBulkBtn = document.getElementById("addGalleryBulkBtn");
const galleryUrlsBuilder = document.getElementById("galleryUrlsBuilder");
const adminCardImageFile = document.getElementById("adminCardImageFile");
const adminHeroImageFile = document.getElementById("adminHeroImageFile");
const adminGalleryFiles = document.getElementById("adminGalleryFiles");
const adminGalleryFilesInfo = document.getElementById("adminGalleryFilesInfo");
const resetHostelDefaultsBtn = document.getElementById("resetHostelDefaultsBtn");
const hostelDataStatus = document.getElementById("hostelDataStatus");

const mainGalleryForm = document.getElementById("mainGalleryForm");
const mainGalleryUrls = document.getElementById("mainGalleryUrls");
const mainGalleryUrlInput = document.getElementById("mainGalleryUrlInput");
const addMainGalleryUrlBtn = document.getElementById("addMainGalleryUrlBtn");
const mainGalleryBulkInput = document.getElementById("mainGalleryBulkInput");
const addMainGalleryBulkBtn = document.getElementById("addMainGalleryBulkBtn");
const mainGalleryUrlsBuilder = document.getElementById("mainGalleryUrlsBuilder");
const mainGalleryFiles = document.getElementById("mainGalleryFiles");
const mainGalleryFilesInfo = document.getElementById("mainGalleryFilesInfo");
const resetMainGalleryBtn = document.getElementById("resetMainGalleryBtn");
const mainGalleryStatus = document.getElementById("mainGalleryStatus");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

function unlockAdminSections() {
  adminEditor?.removeAttribute("hidden");
  hostelEditor?.removeAttribute("hidden");
  galleryEditor?.removeAttribute("hidden");
  enquiryEditor?.removeAttribute("hidden");
  adminUserEditor?.removeAttribute("hidden");
}

async function hydrateUnlockedAdminData() {
  await Promise.all([hydrateContactDetailsFromApi(), hydrateHostelsFromApi(), hydrateGalleryFromApi()]);
  await Promise.all([hydrateEnquiriesFromApi(), hydrateAdminsFromApi()]);

  fillAdminContactForm();
  if (adminHostelSelect) {
    fillHostelForm(adminHostelSelect.value);
  }
  fillMainGalleryForm();
}

async function tryAutoUnlockAdmin() {
  if (document.body?.dataset?.page !== "admin") {
    return;
  }

  restoreAdminToken();
  if (!adminToken) {
    return;
  }

  unlockAdminSections();
  if (adminLoginStatus) {
    adminLoginStatus.textContent = "Session restored. Editor unlocked.";
  }

  try {
    await hydrateUnlockedAdminData();
  } catch (_error) {
    setAdminToken("");
    if (adminLoginStatus) {
      adminLoginStatus.textContent = "Session expired. Please login again.";
    }
  }
}

function getBuilderValues(containerSelector, inputSelector) {
  const rows = document.querySelectorAll(containerSelector);
  return Array.from(rows)
    .map((row) => String(row.querySelector(inputSelector)?.value || "").trim())
    .filter(Boolean);
}

function syncFacilitiesSource() {
  if (!adminFacilities) {
    return;
  }

  const items = getBuilderValues("#facilitiesListBuilder .builder-chip", "input");
  adminFacilities.value = items.join("\n");
}

function addFacilityChip(value) {
  const normalized = String(value || "").trim();
  if (!normalized || !facilitiesListBuilder) {
    return;
  }

  const duplicate = Array.from(facilitiesListBuilder.querySelectorAll("input"))
    .some((input) => String(input.value || "").trim().toLowerCase() === normalized.toLowerCase());
  if (duplicate) {
    return;
  }

  const chip = document.createElement("div");
  chip.className = "builder-chip";

  const input = document.createElement("input");
  input.type = "text";
  input.value = normalized;
  input.addEventListener("input", syncFacilitiesSource);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => {
    chip.remove();
    syncFacilitiesSource();
  });

  chip.append(input, removeBtn);
  facilitiesListBuilder.appendChild(chip);
  syncFacilitiesSource();
}

function setFacilitiesBuilder(values) {
  if (!facilitiesListBuilder) {
    return;
  }
  facilitiesListBuilder.innerHTML = "";
  values.forEach((value) => addFacilityChip(value));
  syncFacilitiesSource();
}

function addRoomRow(data = {}) {
  if (!roomsBuilderBody) {
    return;
  }

  const row = document.createElement("div");
  row.className = "builder-row";

  const typeInput = document.createElement("input");
  typeInput.type = "text";
  typeInput.placeholder = "Room type (e.g., 3 Sharing)";
  typeInput.value = String(data.type || "").trim();

  const priceInput = document.createElement("input");
  priceInput.type = "text";
  priceInput.placeholder = "Price (e.g., ₹4500)";
  priceInput.value = String(data.price || "").trim();

  const bedsInput = document.createElement("input");
  bedsInput.type = "text";
  bedsInput.placeholder = "Availability (e.g., 2 beds available)";
  bedsInput.value = String(data.available || "").trim() || "Full";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";

  [typeInput, priceInput, bedsInput].forEach((input) => {
    input.addEventListener("input", syncRoomSources);
  });

  removeBtn.addEventListener("click", () => {
    row.remove();
    syncRoomSources();
  });

  row.append(typeInput, priceInput, bedsInput, removeBtn);
  roomsBuilderBody.appendChild(row);
  syncRoomSources();
}

function setRoomsBuilder(rooms) {
  if (!roomsBuilderBody) {
    return;
  }
  roomsBuilderBody.innerHTML = "";
  rooms.forEach((room) => addRoomRow(room));
  if (!rooms.length) {
    addRoomRow({ type: "", price: "", available: "Full" });
  }
  syncRoomSources();
}

function syncRoomSources() {
  if (!adminRooms || !adminAvailability) {
    return;
  }

  const rows = Array.from(document.querySelectorAll("#roomsBuilderBody .builder-row"));
  const roomLines = [];
  const availabilityLines = [];

  rows.forEach((row) => {
    const inputs = row.querySelectorAll("input");
    const roomType = String(inputs[0]?.value || "").trim();
    const roomPrice = String(inputs[1]?.value || "").trim();
    const roomAvailable = String(inputs[2]?.value || "").trim();

    if (roomType && roomPrice) {
      roomLines.push(`${roomType}|${roomPrice}`);
      availabilityLines.push(`${roomType} – ${roomAvailable || "Full"}`);
    }
  });

  adminRooms.value = roomLines.join("\n");
  adminAvailability.value = availabilityLines.join("\n");
}

function addUrlRow(container, value, onSync) {
  const normalized = normalizeImageUrl(value);
  if (!normalized || !container) {
    return;
  }

  const duplicate = Array.from(container.querySelectorAll("input"))
    .some((input) => String(input.value || "").trim() === normalized);
  if (duplicate) {
    return;
  }

  const row = document.createElement("div");
  row.className = "builder-row-url";

  const preview = document.createElement("img");
  preview.src = normalized;
  preview.alt = "Gallery preview";

  const input = document.createElement("input");
  input.type = "url";
  input.value = normalized;
  input.placeholder = "https://...";
  input.addEventListener("input", () => {
    preview.src = normalizeImageUrl(input.value) || input.value;
    openLink.href = normalizeImageUrl(input.value) || "#";
    onSync();
  });

  const openLink = document.createElement("a");
  openLink.href = normalized;
  openLink.target = "_blank";
  openLink.rel = "noopener noreferrer";
  openLink.className = "builder-link-btn";
  openLink.textContent = "↗";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => {
    row.remove();
    onSync();
  });

  row.append(preview, input, openLink, removeBtn);
  container.appendChild(row);
  onSync();
}

function syncHostelGallerySource() {
  if (!adminGalleryUrls) {
    return;
  }
  adminGalleryUrls.value = getBuilderValues("#galleryUrlsBuilder .builder-row-url", "input").join("\n");
}

function setHostelGalleryBuilder(urls) {
  if (!galleryUrlsBuilder) {
    return;
  }
  galleryUrlsBuilder.innerHTML = "";
  urls.forEach((url) => addUrlRow(galleryUrlsBuilder, url, syncHostelGallerySource));
  syncHostelGallerySource();
}

function syncMainGallerySource() {
  if (!mainGalleryUrls) {
    return;
  }
  mainGalleryUrls.value = getBuilderValues("#mainGalleryUrlsBuilder .builder-row-url", "input").join("\n");
}

function setMainGalleryBuilder(urls) {
  if (!mainGalleryUrlsBuilder) {
    return;
  }
  mainGalleryUrlsBuilder.innerHTML = "";
  urls.forEach((url) => addUrlRow(mainGalleryUrlsBuilder, url, syncMainGallerySource));
  syncMainGallerySource();
}

addFacilityTemplateBtn?.addEventListener("click", () => {
  addFacilityChip(facilityTemplateSelect?.value || "");
});

addCustomFacilityBtn?.addEventListener("click", () => {
  addFacilityChip(customFacilityInput?.value || "");
  if (customFacilityInput) {
    customFacilityInput.value = "";
  }
});

addRoomRowBtn?.addEventListener("click", () => {
  addRoomRow({ type: "", price: "", available: "Full" });
});

addGalleryUrlBtn?.addEventListener("click", () => {
  addUrlRow(galleryUrlsBuilder, normalizeImageUrl(galleryUrlInput?.value || ""), syncHostelGallerySource);
  if (galleryUrlInput) {
    galleryUrlInput.value = "";
  }
});

addGalleryBulkBtn?.addEventListener("click", () => {
  const urls = parseImageUrls(galleryBulkInput?.value || "");
  urls.forEach((url) => addUrlRow(galleryUrlsBuilder, url, syncHostelGallerySource));
  if (galleryBulkInput) {
    galleryBulkInput.value = "";
  }
});

addMainGalleryUrlBtn?.addEventListener("click", () => {
  addUrlRow(mainGalleryUrlsBuilder, normalizeImageUrl(mainGalleryUrlInput?.value || ""), syncMainGallerySource);
  if (mainGalleryUrlInput) {
    mainGalleryUrlInput.value = "";
  }
});

addMainGalleryBulkBtn?.addEventListener("click", () => {
  const urls = parseImageUrls(mainGalleryBulkInput?.value || "");
  urls.forEach((url) => addUrlRow(mainGalleryUrlsBuilder, url, syncMainGallerySource));
  if (mainGalleryBulkInput) {
    mainGalleryBulkInput.value = "";
  }
});

function updateFileSelectionInfo(input, statusNode, label) {
  if (!input || !statusNode) {
    return;
  }

  const files = Array.from(input.files || []);
  if (!files.length) {
    statusNode.textContent = `No ${label} files selected.`;
    return;
  }

  const previewNames = files.slice(0, 2).map((file) => file.name).join(", ");
  const suffix = files.length > 2 ? ` +${files.length - 2} more` : "";
  statusNode.textContent = `${files.length} ${label} file(s) selected: ${previewNames}${suffix}`;
}

adminGalleryFiles?.addEventListener("change", () => {
  updateFileSelectionInfo(adminGalleryFiles, adminGalleryFilesInfo, "gallery");
});

mainGalleryFiles?.addEventListener("change", () => {
  updateFileSelectionInfo(mainGalleryFiles, mainGalleryFilesInfo, "main gallery");
});

function fillAdminContactForm() {
  if (!adminPhone || !adminWhatsapp || !adminEmail || !adminAddress) {
    return;
  }
  adminPhone.value = contactDetails.phone;
  adminWhatsapp.value = contactDetails.whatsapp;
  adminEmail.value = contactDetails.email;
  adminAddress.value = contactDetails.address;
}

function fillHostelForm(hostelKey) {
  const data = hostelsData[hostelKey];
  if (!data || !adminHostelName) {
    return;
  }

  adminHostelName.value = data.name;
  adminHostelTagline.value = data.tagline;
  adminHostelPrice.value = data.startingPrice;
  adminHostelDescription.value = data.description;
  setFacilitiesBuilder(data.facilities || []);

  const availabilityMap = {};
  (data.availability || []).forEach((line) => {
    const raw = String(line || "").trim();
    if (!raw) {
      return;
    }
    const parts = raw.includes("–") ? raw.split("–") : raw.split("-");
    if (parts.length > 1) {
      availabilityMap[String(parts[0]).trim().toLowerCase()] = parts.slice(1).join("-").trim();
    }
  });

  const roomRows = (data.rooms || []).map((room) => ({
    type: room.type,
    price: room.price,
    available: availabilityMap[String(room.type || "").trim().toLowerCase()] || "Full"
  }));
  setRoomsBuilder(roomRows);

  adminCardImage.value = data.cardImage;
  adminHeroImage.value = data.heroImage;
  setHostelGalleryBuilder(data.gallery || []);
}

function fillMainGalleryForm() {
  if (mainGalleryUrls) {
    setMainGalleryBuilder(mainGalleryData);
  }
}

function formatEnquiryTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }
  return date.toLocaleString();
}

function renderEnquiries(enquiries) {
  if (!enquiriesList) {
    return;
  }

  if (!enquiries.length) {
    enquiriesList.innerHTML = "<p class=\"helper-text\">No enquiries yet.</p>";
    return;
  }

  enquiriesList.innerHTML = enquiries
    .map(
      (enquiry) => `
      <article class="enquiry-card">
        <div class="enquiry-head">
          <p class="enquiry-name">${escapeHtml(enquiry.name || "Unknown")}</p>
          <p class="enquiry-time">${escapeHtml(formatEnquiryTime(enquiry.createdAt))}</p>
        </div>
        <p class="enquiry-meta"><strong>Hostel:</strong> ${escapeHtml(enquiry.hostel || "General Enquiry")}</p>
        <p class="enquiry-meta"><strong>Phone:</strong> ${escapeHtml(enquiry.phone || "-")}</p>
        <p class="enquiry-message"><strong>Message:</strong> ${escapeHtml(enquiry.message || "-")}</p>
      </article>
    `
    )
    .join("");
}

async function hydrateEnquiriesFromApi() {
  if (!adminToken) {
    return;
  }

  try {
    if (enquiryStatus) {
      enquiryStatus.textContent = "Loading enquiries...";
    }

    const response = await apiFetchWithRetry("/api/contact?limit=100", {
      method: "GET",
      headers: {
        ...getAuthHeaders()
      }
    });
    const enquiries = await response.json();
    renderEnquiries(Array.isArray(enquiries) ? enquiries : []);

    if (enquiryStatus) {
      enquiryStatus.textContent = `Showing ${Array.isArray(enquiries) ? enquiries.length : 0} enquiry(s).`;
    }
  } catch (error) {
    if (enquiryStatus) {
      enquiryStatus.textContent = error.message || "Failed to load enquiries.";
    }
  }
}

function renderAdmins(admins) {
  if (!adminsList) {
    return;
  }

  if (!admins.length) {
    adminsList.innerHTML = "<p class=\"helper-text\">No admins found.</p>";
    return;
  }

  adminsList.innerHTML = admins
    .map(
      (admin) => `
      <article class="admin-user-card">
        <p class="admin-user-name">${escapeHtml(admin.name || "Admin")}</p>
        <p class="admin-user-meta"><strong>Email:</strong> ${escapeHtml(admin.email || "-")}</p>
        <p class="admin-user-meta"><strong>Role:</strong> ${escapeHtml(admin.role || "admin")}</p>
        <p class="admin-user-meta"><strong>Created:</strong> ${escapeHtml(formatEnquiryTime(admin.createdAt))}</p>
      </article>
    `
    )
    .join("");
}

async function hydrateAdminsFromApi() {
  if (!adminToken) {
    return;
  }

  try {
    if (adminUserStatus) {
      adminUserStatus.textContent = "Loading admin users...";
    }

    const response = await apiFetchWithRetry("/api/admin", {
      method: "GET",
      headers: {
        ...getAuthHeaders()
      }
    });

    const admins = await response.json();
    renderAdmins(Array.isArray(admins) ? admins : []);

    if (adminUserStatus) {
      adminUserStatus.textContent = `Showing ${Array.isArray(admins) ? admins.length : 0} admin(s).`;
    }
  } catch (error) {
    if (adminUserStatus) {
      adminUserStatus.textContent = error.message || "Failed to load admins.";
    }
  }
}

refreshAdminsBtn?.addEventListener("click", () => {
  hydrateAdminsFromApi();
});

createAdminForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = String(newAdminName?.value || "").trim();
  const email = String(newAdminEmail?.value || "").trim();
  const password = String(newAdminPassword?.value || "");
  const confirmPassword = String(newAdminPasswordConfirm?.value || "");

  if (!name || !email || !password) {
    if (adminUserStatus) {
      adminUserStatus.textContent = "Please fill all required fields.";
    }
    return;
  }

  if (password !== confirmPassword) {
    if (adminUserStatus) {
      adminUserStatus.textContent = "Password and confirm password must match.";
    }
    return;
  }

  try {
    if (adminUserStatus) {
      adminUserStatus.textContent = "Creating admin user...";
    }

    await apiFetchWithRetry("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({ name, email, password })
    });

    if (createAdminForm) {
      createAdminForm.reset();
    }

    if (adminUserStatus) {
      adminUserStatus.textContent = "Admin user created successfully.";
    }

    await hydrateAdminsFromApi();
  } catch (error) {
    if (adminUserStatus) {
      adminUserStatus.textContent = error.message || "Failed to create admin user.";
    }
  }
});

refreshEnquiriesBtn?.addEventListener("click", () => {
  hydrateEnquiriesFromApi();
});

adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = String(adminEmailInput?.value || "").trim();
  const password = String(adminKeyInput?.value || "").trim();

  if (!email || !password) {
    if (adminLoginStatus) {
      adminLoginStatus.textContent = "Please enter email and password.";
    }
    return;
  }

  try {
    if (adminLoginStatus) {
      adminLoginStatus.textContent = "Logging in...";
    }

    const response = await apiFetchWithRetry("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    const nextToken = String(result.token || "").trim();
    setAdminToken(nextToken);

    if (!adminToken) {
      throw new Error("Token missing from login response");
    }

    if (adminLoginStatus) {
      adminLoginStatus.textContent = "Login successful. DB editor unlocked.";
    }

    unlockAdminSections();
    await hydrateUnlockedAdminData();
  } catch (error) {
    if (adminLoginStatus) {
      adminLoginStatus.textContent = error.message || "Login failed.";
    }
  }
});

adminLogoutBtn?.addEventListener("click", () => {
  setAdminToken("");
  window.location.reload();
});

adminContactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!adminPhone || !adminWhatsapp || !adminEmail || !adminAddress) {
    return;
  }

  const nextDetails = {
    phone: adminPhone.value.trim(),
    whatsapp: adminWhatsapp.value.trim().replace(/\D/g, ""),
    email: adminEmail.value.trim(),
    address: adminAddress.value.trim()
  };

  try {
    if (adminStatus) {
      adminStatus.textContent = "Saving contact details to DB...";
    }
    const saved = await saveContactDetailsToApi(nextDetails);
    contactDetails = {
      phone: String(saved.phone || nextDetails.phone).trim(),
      whatsapp: String(saved.whatsapp || nextDetails.whatsapp).trim(),
      email: String(saved.email || nextDetails.email).trim(),
      address: String(saved.address || nextDetails.address).trim()
    };
    applyContactDetailsToPage();

    if (adminStatus) {
      adminStatus.textContent = "Contact details updated in DB.";
    }
  } catch (error) {
    if (adminStatus) {
      adminStatus.textContent = error.message || "Failed to update contact details.";
    }
  }
});

adminResetBtn?.addEventListener("click", async () => {
  try {
    if (adminStatus) {
      adminStatus.textContent = "Resetting contact details in DB...";
    }
    const reset = await resetContactDetailsToApi();
    contactDetails = {
      phone: String(reset.phone || defaultContactDetails.phone).trim(),
      whatsapp: String(reset.whatsapp || defaultContactDetails.whatsapp).trim(),
      email: String(reset.email || defaultContactDetails.email).trim(),
      address: String(reset.address || defaultContactDetails.address).trim()
    };
    fillAdminContactForm();
    applyContactDetailsToPage();

    if (adminStatus) {
      adminStatus.textContent = "Contact details reset in DB.";
    }
  } catch (error) {
    if (adminStatus) {
      adminStatus.textContent = error.message || "Failed to reset contact details.";
    }
  }
});

adminHostelSelect?.addEventListener("change", (event) => {
  const target = event.target;
  fillHostelForm(target.value);
  if (hostelDataStatus) {
    hostelDataStatus.textContent = "Loaded selected hostel data.";
  }
});

hostelDataForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  syncFacilitiesSource();
  syncRoomSources();
  syncHostelGallerySource();
  const key = adminHostelSelect?.value;
  if (!key || !hostelsData[key] || !apiHostelsByKey[key]) {
    return;
  }

  const existing = hostelsData[key];
  const hostelRecord = apiHostelsByKey[key];
  const urlGallery = parseImageUrls(adminGalleryUrls?.value || "");
  const facilities = parseLineList(adminFacilities?.value || "");
  const availabilityLines = parseLineList(adminAvailability?.value || "");
  const roomsInput = parseRooms(adminRooms?.value || "");

  try {
    if (hostelDataStatus) {
      hostelDataStatus.textContent = "Saving hostel to DB...";
    }

    const uploadedCard = adminCardImageFile?.files?.[0]
      ? await uploadImageToApi(adminCardImageFile.files[0], "hostel-project/hostel-card")
      : "";
    const uploadedHero = adminHeroImageFile?.files?.[0]
      ? await uploadImageToApi(adminHeroImageFile.files[0], "hostel-project/hostel-hero")
      : "";
    const uploadedGallery = adminGalleryFiles?.files?.length
      ? await Promise.all(
        Array.from(adminGalleryFiles.files).map((file) => uploadImageToApi(file, "hostel-project/hostel-gallery"))
      )
      : [];

    const mergedRooms = (roomsInput.length ? roomsInput : existing.rooms).map((room) => ({
      type: room.type,
      price: room.price,
      available_beds: getAvailableBedsByRoomType(availabilityLines, room.type, "Full")
    }));

    const payload = {
      name: adminHostelName?.value.trim() || existing.name,
      tagline: adminHostelTagline?.value.trim() || existing.tagline,
      price_start: adminHostelPrice?.value.trim() || existing.startingPrice,
      description: adminHostelDescription?.value.trim() || existing.description,
      facilities: facilities.length ? facilities : existing.facilities,
      card_image_url: uploadedCard || normalizeImageUrl(adminCardImage?.value.trim() || "") || existing.cardImage,
      hero_image_url: uploadedHero || normalizeImageUrl(adminHeroImage?.value.trim() || "") || existing.heroImage,
      gallery_urls: [...urlGallery, ...uploadedGallery].length ? [...urlGallery, ...uploadedGallery] : existing.gallery,
      rooms: mergedRooms
    };

    await apiFetchWithRetry(`/api/hostels/${hostelRecord._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    });

    await hydrateHostelsFromApi();
    fillHostelForm(key);

    if (adminCardImageFile) {
      adminCardImageFile.value = "";
    }
    if (adminHeroImageFile) {
      adminHeroImageFile.value = "";
    }
    if (adminGalleryFiles) {
      adminGalleryFiles.value = "";
    }

    if (hostelDataStatus) {
      hostelDataStatus.textContent = "Hostel changes saved to DB.";
    }
  } catch (error) {
    if (hostelDataStatus) {
      hostelDataStatus.textContent = error.message || "Failed to save hostel changes.";
    }
  }
});

resetHostelDefaultsBtn?.addEventListener("click", async () => {
  const key = adminHostelSelect?.value;
  if (!key || !apiHostelsByKey[key]) {
    return;
  }

  try {
    if (hostelDataStatus) {
      hostelDataStatus.textContent = "Restoring previous DB version...";
    }

    await apiFetchWithRetry(`/api/hostels/${apiHostelsByKey[key]._id}/restore`, {
      method: "POST",
      headers: {
        ...getAuthHeaders()
      }
    });

    await hydrateHostelsFromApi();
    fillHostelForm(key);

    if (hostelDataStatus) {
      hostelDataStatus.textContent = "Previous hostel version restored from DB.";
    }
  } catch (error) {
    if (hostelDataStatus) {
      hostelDataStatus.textContent = error.message || "Failed to restore hostel version.";
    }
  }
});

mainGalleryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  syncMainGallerySource();

  try {
    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = "Updating main gallery in DB...";
    }

    const urlImages = parseImageUrls(mainGalleryUrls?.value || "");
    const uploadedImages = mainGalleryFiles?.files?.length
      ? await Promise.all(
        Array.from(mainGalleryFiles.files).map((file) => uploadImageToApi(file, "hostel-project/main-gallery"))
      )
      : [];
    const combined = [...urlImages, ...uploadedImages];

    for (const id of mainGalleryRecordIds) {
      await apiFetchWithRetry(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders()
        }
      });
    }

    for (const imageUrl of combined) {
      await apiFetchWithRetry("/api/gallery", {
        method: "POST",
        headers: {
          ...getAuthHeaders()
        },
        body: (() => {
          const formData = new FormData();
          formData.append("image_url", imageUrl);
          formData.append("is_main_gallery", "true");
          formData.append("alt_text", "Main gallery image");
          return formData;
        })()
      });
    }

    await hydrateGalleryFromApi();
    fillMainGalleryForm();

    if (mainGalleryFiles) {
      mainGalleryFiles.value = "";
    }

    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = "Main gallery updated in DB.";
    }
  } catch (error) {
    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = error.message || "Failed to update main gallery.";
    }
  }
});

resetMainGalleryBtn?.addEventListener("click", async () => {
  try {
    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = "Resetting main gallery in DB...";
    }

    for (const id of mainGalleryRecordIds) {
      await apiFetchWithRetry(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders()
        }
      });
    }

    for (const imageUrl of defaultMainGallery) {
      await apiFetchWithRetry("/api/gallery", {
        method: "POST",
        headers: {
          ...getAuthHeaders()
        },
        body: (() => {
          const formData = new FormData();
          formData.append("image_url", imageUrl);
          formData.append("is_main_gallery", "true");
          formData.append("alt_text", "Main gallery image");
          return formData;
        })()
      });
    }

    await hydrateGalleryFromApi();
    fillMainGalleryForm();

    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = "Main gallery reset in DB.";
    }
  } catch (error) {
    if (mainGalleryStatus) {
      mainGalleryStatus.textContent = error.message || "Failed to reset main gallery.";
    }
  }
});

applyContactDetailsToPage();
applyHostelCardsData();
applyHostelDetailData();
applyMainGalleryData();
hydrateContactDetailsFromApi();
hydrateHostelsFromApi();
hydrateGalleryFromApi();
tryAutoUnlockAdmin();
