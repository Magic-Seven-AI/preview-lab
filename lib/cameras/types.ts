export type Hazard = "traffic" | "weather";

export type CorridorCamera = {
  id: string;
  district: 3 | 4;
  title: string;
  place: string;
  route: string;
  hazard: Hazard;
  why: string;
};

export type LiveCamera = CorridorCamera & {
  imageUrl: string;
  inService: boolean;
  elevationFt: number | null;
  latitude: number | null;
  longitude: number | null;
  capturedAt: string | null;
};
