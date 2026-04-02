const https = require("https");

function getMapsApiKey() {
  const key = String(process.env.GOOGLE_MAPS_API_KEY || "").trim();
  if (!key) {
    const error = new Error("GOOGLE_MAPS_API_KEY is missing in environment variables");
    error.status = 500;
    throw error;
  }
  return key;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let raw = "";

        response.on("data", (chunk) => {
          raw += chunk;
        });

        response.on("end", () => {
          try {
            const parsed = JSON.parse(raw || "{}");
            resolve(parsed);
          } catch (_error) {
            const error = new Error("Could not parse maps API response");
            error.status = 502;
            reject(error);
          }
        });
      })
      .on("error", () => {
        const error = new Error("Failed to reach maps provider");
        error.status = 502;
        reject(error);
      });
  });
}

async function geocodeAddress(addressText) {
  const params = new URLSearchParams({
    address: addressText,
    key: getMapsApiKey()
  });

  const payload = await fetchJson(`https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`);

  if (payload.status !== "OK" || !Array.isArray(payload.results) || !payload.results.length) {
    const error = new Error("Location not found. Please enter a clearer landmark or full address.");
    error.status = 400;
    throw error;
  }

  const first = payload.results[0];
  const location = first.geometry?.location || {};

  return {
    formattedAddress: String(first.formatted_address || "").trim(),
    latitude: Number(location.lat),
    longitude: Number(location.lng)
  };
}

async function getDrivingDistance(origin, destination) {
  const params = new URLSearchParams({
    origins: `${origin.latitude},${origin.longitude}`,
    destinations: `${destination.latitude},${destination.longitude}`,
    mode: "driving",
    units: "metric",
    key: getMapsApiKey()
  });

  const payload = await fetchJson(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`
  );

  if (payload.status !== "OK") {
    const error = new Error("Could not compute distance at the moment. Please try again.");
    error.status = 502;
    throw error;
  }

  const element = payload.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") {
    const error = new Error("No route found for this location. Try another nearby landmark.");
    error.status = 400;
    throw error;
  }

  const distanceMeters = Number(element.distance?.value || 0);
  const durationSeconds = Number(element.duration?.value || 0);

  return {
    distanceText: String(element.distance?.text || "").trim(),
    durationText: String(element.duration?.text || "").trim(),
    distanceKm: Number((distanceMeters / 1000).toFixed(1)),
    durationMinutes: Math.max(1, Math.round(durationSeconds / 60))
  };
}

module.exports = {
  geocodeAddress,
  getDrivingDistance
};
