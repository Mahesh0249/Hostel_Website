const Hostel = require("../models/Hostel");
const { geocodeAddress, getDrivingDistance } = require("../config/osrmMaps");

const hostelKeyToSlug = {
  praneeth1: "sai-praneeth-boys-hostel-1",
  praneeth2: "sai-praneeth-boys-hostel-2",
  elvy: "elvy-stays"
};

const fallbackHostelCoordinatesBySlug = {
  "sai-praneeth-boys-hostel-1": {
    latitude: 16.48394726914612,
    longitude: 80.68697619534079
  },
  "sai-praneeth-boys-hostel-2": {
    latitude: 16.485739473366305,
    longitude: 80.68799956600591
  },
  "elvy-stays": {
    latitude: 16.483126283484175,
    longitude: 80.69665525497054
  }
};

function resolveHostelCoordinates(hostel) {
  if (Number.isFinite(hostel?.latitude) && Number.isFinite(hostel?.longitude)) {
    return {
      latitude: hostel.latitude,
      longitude: hostel.longitude
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
