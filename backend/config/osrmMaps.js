const https = require("https");

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "hostel-distance-finder/1.0",
          Accept: "application/json",
          ...headers
        }
      },
      (response) => {
        let raw = "";

        response.on("data", (chunk) => {
          raw += chunk;
        });

        response.on("end", () => {
          try {
            const parsed = JSON.parse(raw || "{}");
            resolve(parsed);
          } catch (_error) {
            const error = new Error("Could not parse distance provider response");
            error.status = 502;
            reject(error);
          }
        });
      }
    );

    request.on("error", () => {
      const error = new Error("Failed to reach distance provider");
      error.status = 502;
      reject(error);
    });
  });
}

function formatDistanceText(distanceMeters) {
  const km = distanceMeters / 1000;
  if (km < 1) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${km.toFixed(1)} km`;
}

function formatDurationText(durationSeconds) {
  const totalMinutes = Math.max(1, Math.round(durationSeconds / 60));
  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!minutes) {
    return `${hours} hr`;
  }
  return `${hours} hr ${minutes} mins`;
}

async function geocodeAddress(addressText) {
  const params = new URLSearchParams({
    q: String(addressText || "").trim(),
    format: "jsonv2",
    limit: "1",
    addressdetails: "0"
  });

  const payload = await fetchJson(`https://nominatim.openstreetmap.org/search?${params.toString()}`);

  if (!Array.isArray(payload) || !payload.length) {
    const error = new Error("Location not found. Please enter a clearer landmark or full address.");
    error.status = 400;
    throw error;
  }

  const first = payload[0];

  const latitude = Number(first.lat);
  const longitude = Number(first.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    const error = new Error("Location coordinates are invalid. Try another address.");
    error.status = 400;
    throw error;
  }

  return {
    formattedAddress: String(first.display_name || addressText || "").trim(),
    latitude,
    longitude
  };
}

async function getDrivingDistance(origin, destination) {
  const coords = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    alternatives: "false",
    steps: "false"
  });

  const payload = await fetchJson(`https://router.project-osrm.org/route/v1/driving/${coords}?${params.toString()}`);

  if (payload.code !== "Ok" || !Array.isArray(payload.routes) || !payload.routes.length) {
    const error = new Error("No driving route found for this location. Try another nearby landmark.");
    error.status = 400;
    throw error;
  }

  const firstRoute = payload.routes[0];
  const distanceMeters = Number(firstRoute.distance || 0);
  const durationSeconds = Number(firstRoute.duration || 0);
  const coordinates = Array.isArray(firstRoute.geometry?.coordinates)
    ? firstRoute.geometry.coordinates
      .map((point) => [Number(point[1]), Number(point[0])])
      .filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]))
    : [];

  return {
    distanceText: formatDistanceText(distanceMeters),
    durationText: formatDurationText(durationSeconds),
    distanceKm: Number((distanceMeters / 1000).toFixed(1)),
    durationMinutes: Math.max(1, Math.round(durationSeconds / 60)),
    coordinates
  };
}

module.exports = {
  geocodeAddress,
  getDrivingDistance
};
