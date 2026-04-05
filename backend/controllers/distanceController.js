const Hostel = require("../models/Hostel");
const { geocodeAddress, getDrivingDistance } = require("../config/osrmMaps");

const hostelKeyToSlug = {
  praneeth1: "sai-praneeth-boys-hostel-1",
  praneeth2: "sai-praneeth-boys-hostel-2",
  elvy: "elvy-stays"
};

async function findHostel({ hostelId, hostelKey, hostelSlug }) {
  if (hostelId) {
    return Hostel.findById(hostelId);
  }

  if (hostelSlug) {
    return Hostel.findOne({ slug: String(hostelSlug).trim().toLowerCase() });
  }

  if (hostelKey) {
    const mappedSlug = hostelKeyToSlug[String(hostelKey).trim().toLowerCase()];
    if (mappedSlug) {
      return Hostel.findOne({ slug: mappedSlug });
    }
  }

  return null;
}

async function getHostelDistance(req, res) {
  const { hostelId, hostelKey, hostelSlug, userLocationText } = req.body || {};

  const queryText = String(userLocationText || "").trim();
  if (!queryText) {
    return res.status(400).json({ message: "userLocationText is required" });
  }

  const hostel = await findHostel({ hostelId, hostelKey, hostelSlug });
  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found for distance calculation" });
  }

  if (!Number.isFinite(hostel.latitude) || !Number.isFinite(hostel.longitude)) {
    return res.status(400).json({
      message: "Selected hostel does not have coordinates configured"
    });
  }

  const origin = await geocodeAddress(queryText);
  const destination = {
    latitude: hostel.latitude,
    longitude: hostel.longitude
  };

  const route = await getDrivingDistance(origin, destination);

  const osmDirectionsUrl =
    `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
    `${encodeURIComponent(`${origin.latitude},${origin.longitude};${hostel.latitude},${hostel.longitude}`)}`;

  return res.json({
    hostel: {
      id: String(hostel._id),
      name: hostel.name,
      slug: hostel.slug,
      location: hostel.location,
      latitude: hostel.latitude,
      longitude: hostel.longitude
    },
    origin: {
      input: queryText,
      formatted_address: origin.formattedAddress,
      latitude: origin.latitude,
      longitude: origin.longitude
    },
    route: {
      distance_text: route.distanceText,
      duration_text: route.durationText,
      distance_km: route.distanceKm,
      duration_minutes: route.durationMinutes,
      coordinates: route.coordinates
    },
    osm_directions_url: osmDirectionsUrl
  });
}

module.exports = {
  getHostelDistance
};
