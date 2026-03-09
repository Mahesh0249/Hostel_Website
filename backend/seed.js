require("dotenv").config();

const connectDB = require("./config/db");
const Hostel = require("./models/Hostel");

const defaultHostels = [
  {
    name: "Sai Praneeth Boys Hostel 1",
    slug: "sai-praneeth-boys-hostel-1",
    tagline: "Affordable shared rooms with WiFi, mess, and comfortable student living.",
    description:
      "Perfect for students looking for value and convenience. The hostel is close to colleges and essential shops, with a friendly student atmosphere.",
    price_start: "Starting from ₹4500 / month",
    location: "Locality, City, State",
    facilities: ["High Speed WiFi", "Daily Mess Food", "Laundry Service", "24/7 Security", "Drinking Water"],
    card_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
    hero_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1616594039964-3fd3d3f4c2b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ],
    rooms: [
      { type: "3 Sharing", price: "₹4500", available_beds: "2 beds available" },
      { type: "4 Sharing", price: "₹4200", available_beds: "Full" }
    ]
  },
  {
    name: "Sai Praneeth Boys Hostel 2",
    slug: "sai-praneeth-boys-hostel-2",
    tagline: "Newly built hostel with upgraded rooms and attached bathrooms.",
    description:
      "A modern setup for students who want upgraded comfort and better privacy with easy access to nearby colleges and transport points.",
    price_start: "Starting from ₹5000 / month",
    location: "Locality, City, State",
    facilities: ["High Speed WiFi", "Attached Bathrooms", "Power Backup", "CCTV Monitoring", "24/7 Security"],
    card_image_url:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
    hero_image_url:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560067174-89474a6f3f95?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80"
    ],
    rooms: [
      { type: "2 Sharing", price: "₹5800", available_beds: "1 bed available" },
      { type: "3 Sharing", price: "₹5000", available_beds: "3 beds available" }
    ]
  },
  {
    name: "Elvy Stays",
    slug: "elvy-stays",
    tagline: "Premium student stay with a quieter and more comfortable environment.",
    description:
      "Elvy Stays is built for students who prefer a calm and premium setting while still staying close to campus life and city essentials.",
    price_start: "Starting from ₹6500 / month",
    location: "Locality, City, State",
    facilities: [
      "High Speed WiFi",
      "Well Maintained Premium Rooms",
      "Quiet Study-Friendly Environment",
      "Power Backup",
      "CCTV Monitoring"
    ],
    card_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=80",
    hero_image_url:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    rooms: [
      { type: "Single Occupancy", price: "₹8500", available_beds: "Full" },
      { type: "2 Sharing", price: "₹6500", available_beds: "2 beds available" }
    ]
  }
];

async function runSeed() {
  await connectDB();

  for (const hostel of defaultHostels) {
    await Hostel.findOneAndUpdate({ slug: hostel.slug }, hostel, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  process.stdout.write("Seed completed\n");
  process.exit(0);
}

runSeed().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
