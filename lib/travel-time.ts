export const ORIGIN = {
  name: "Oakland Airport",
  query: "Oakland International Airport, Oakland, CA",
  lat: 37.7126,
  lng: -122.2197,
} as const;

export const DESTINATION = {
  name: "Truckee",
  query: "Truckee, CA",
  lat: 39.328,
  lng: -120.1833,
} as const;

export type TravelTime =
  | {
      ok: true;
      durationSeconds: number;
      distanceMeters: number;
      trafficAware: boolean;
    }
  | { ok: false; message: string };

function parseDurationSeconds(value: string | undefined): number | null {
  if (!value) return null;
  const match = /^(\d+)s$/.exec(value);
  return match ? Number(match[1]) : null;
}

async function fromGoogle(departure: Date): Promise<TravelTime | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  const body: Record<string, unknown> = {
    origin: { address: ORIGIN.query },
    destination: { address: DESTINATION.query },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
  };

  if (departure.getTime() > Date.now()) {
    body.departureTime = departure.toISOString();
  }

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "routes.duration,routes.staticDuration,routes.distanceMeters",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: { duration?: string; distanceMeters?: number }[];
  };
  const route = data.routes?.[0];
  const durationSeconds = parseDurationSeconds(route?.duration);
  if (durationSeconds == null || route?.distanceMeters == null) return null;

  return {
    ok: true,
    durationSeconds,
    distanceMeters: route.distanceMeters,
    trafficAware: true,
  };
}

async function fromOsrm(): Promise<TravelTime> {
  const url = `https://router.project-osrm.org/route/v1/driving/${ORIGIN.lng},${ORIGIN.lat};${DESTINATION.lng},${DESTINATION.lat}?overview=false`;
  const response = await fetch(url, {
    headers: { "User-Agent": "preview-lab/oak-truckee-travel-time" },
  });

  if (!response.ok) {
    return { ok: false, message: "Could not load travel time." };
  }

  const data = (await response.json()) as {
    code?: string;
    routes?: { duration?: number; distance?: number }[];
  };
  const route = data.routes?.[0];
  if (data.code !== "Ok" || route?.duration == null || route.distance == null) {
    return { ok: false, message: "Could not load travel time." };
  }

  return {
    ok: true,
    durationSeconds: route.duration,
    distanceMeters: route.distance,
    trafficAware: false,
  };
}

export async function getTravelTime(departure: Date): Promise<TravelTime> {
  try {
    const google = await fromGoogle(departure);
    if (google) return google;
  } catch {
    // Fall through to the public router.
  }

  try {
    return await fromOsrm();
  } catch {
    return { ok: false, message: "Could not load travel time." };
  }
}

export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  return `${miles.toFixed(0)} mi`;
}

export function googleMapsUrl(departure: Date): string {
  const leaveAt = Math.floor(departure.getTime() / 1000);
  const origin = encodeURIComponent(ORIGIN.query);
  const destination = encodeURIComponent(DESTINATION.query);
  return `https://www.google.com/maps/dir/${origin}/${destination}/data=!4m6!4m5!2m3!6e0!7e2!8j${leaveAt}!3e0`;
}
