const Hostel = require("../models/Hostel");
const { geocodeAddress, getDrivingDistance } = require("../config/osrmMaps");

const hostelKeyToSlug = {
  praneeth1: "sai-praneeth-boys-hostel-1",
  praneeth2: "sai-praneeth-boys-hostel-2",
  elvy: "elvy-stays"
};

const fallbackHostelCoordinatesBySlug = {
  "sai-praneeth-boys-hostel-1": {
    latitude: 16.48386496614565,
    longitude: 80.68704056835566
  },
  "sai-praneeth-boys-hostel-2": {
    latitude: 16.485776025395335,
    longitude: 80.68794589534089
  },
  "elvy-stays": {
    latitude: 16.48328895461507,
    longitude: 80.6966962530124
  }
};

function isHostelCoordinateInServiceArea(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return false;
  }

  // Restrict to expected local area so stale admin edits cannot send routes to wrong countries.
  return lat >= 15 && lat <= 18 && lon >= 79 && lon <= 82;
}

function resolveHostelCoordinates(hostel) {
  if (isHostelCoordinateInServiceArea(hostel?.latitude, hostel?.longitude)) {
    return {
      latitude: Number(hostel.latitude),
      longitude: Number(hostel.longitude)
    };
  }

  return fallbackHostelCoordinatesBySlug[String(hostel?.slug || "").toLowerCase()] || null;
}

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

  const hostelCoordinates = resolveHostelCoordinates(hostel);
  if (!hostelCoordinates) {
    return res.status(400).json({
      message: "Selected hostel does not have coordinates configured"
    });
  }

  const origin = await geocodeAddress(queryText);
  const destination = {
    latitude: hostelCoordinates.latitude,
    longitude: hostelCoordinates.longitude
  };

  const route = await getDrivingDistance(origin, destination);

  const osmDirectionsUrl =
    `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
    `${encodeURIComponent(`${origin.latitude},${origin.longitude};${hostelCoordinates.latitude},${hostelCoordinates.longitude}`)}`;

  return res.json({
    hostel: {
      id: String(hostel._id),
      name: hostel.name,
      slug: hostel.slug,
      location: hostel.location,
      latitude: hostelCoordinates.latitude,
      longitude: hostelCoordinates.longitude
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
