import { CORRIDOR_CAMERAS, stillUrl } from "./corridor";
import type { LiveCamera } from "./types";

type CaltransRecord = {
  cctv?: {
    inService?: string;
    recordTimestamp?: { recordDate?: string; recordTime?: string };
    location?: {
      latitude?: string;
      longitude?: string;
      elevation?: string;
    };
    imageData?: { static?: { currentImageURL?: string } };
  };
};

const DISTRICT_URL: Record<3 | 4, string> = {
  3: "https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json",
  4: "https://cwwp2.dot.ca.gov/data/d4/cctv/cctvStatusD04.json",
};

function slugFromImageUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return parts.at(-2) ?? "";
}

function parseNum(value: string | undefined) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchDistrict(district: 3 | 4) {
  const res = await fetch(DISTRICT_URL[district]);
  if (!res.ok) throw new Error(`Caltrans D${district} ${res.status}`);
  const json = (await res.json()) as { data?: CaltransRecord[] };
  return json.data ?? [];
}

function indexBySlug(records: CaltransRecord[]) {
  const map = new Map<string, CaltransRecord["cctv"]>();
  for (const record of records) {
    const cctv = record.cctv;
    const url = cctv?.imageData?.static?.currentImageURL;
    if (!cctv || !url) continue;
    map.set(slugFromImageUrl(url), cctv);
  }
  return map;
}

export async function loadCorridorCameras(): Promise<LiveCamera[]> {
  let live = new Map<string, CaltransRecord["cctv"]>();

  try {
    const [d3, d4] = await Promise.all([fetchDistrict(3), fetchDistrict(4)]);
    live = indexBySlug([...d3, ...d4]);
  } catch {
    live = new Map();
  }

  return CORRIDOR_CAMERAS.map((cam) => {
    const cctv = live.get(cam.id);
    const ts = cctv?.recordTimestamp;
    return {
      ...cam,
      imageUrl: cctv?.imageData?.static?.currentImageURL ?? stillUrl(cam.district, cam.id),
      inService: cctv?.inService !== "false",
      elevationFt: parseNum(cctv?.location?.elevation),
      latitude: parseNum(cctv?.location?.latitude),
      longitude: parseNum(cctv?.location?.longitude),
      capturedAt: ts?.recordDate && ts.recordTime ? `${ts.recordDate} ${ts.recordTime}` : null,
    };
  });
}
