import type { CorridorCamera } from "./types";

/** OAK → Truckee via I-880 N and I-80 E. Order is west-to-east. */
export const CORRIDOR_CAMERAS: CorridorCamera[] = [
  {
    id: "tvb19i880athegenbergerrd",
    district: 4,
    title: "I-880 at Hegenberger",
    place: "Oakland Airport",
    route: "I-880",
    hazard: "traffic",
    why: "OAK airport interchange — chronic congestion on the 880 corridor",
  },
  {
    id: "tv726i880atjct80",
    district: 4,
    title: "I-880 at I-80",
    place: "Oakland",
    route: "I-880",
    hazard: "traffic",
    why: "MacArthur Maze approach — I-880 / I-80 merge, one of the Bay’s worst bottlenecks",
  },
  {
    id: "tv107i80powellstreet",
    district: 4,
    title: "I-80 at Powell Street",
    place: "Emeryville",
    route: "I-80",
    hazard: "traffic",
    why: "Eastshore Freeway — stop-and-go through Berkeley and Emeryville",
  },
  {
    id: "tv972i80justwestofcarquinezbrdg",
    district: 4,
    title: "Carquinez Bridge",
    place: "Crockett",
    route: "I-80",
    hazard: "traffic",
    why: "Bridge bottleneck with frequent backups and high winds",
  },
  {
    id: "tv981i80eastofi680",
    district: 4,
    title: "I-80 east of I-680",
    place: "Fairfield",
    route: "I-80",
    hazard: "traffic",
    why: "I-80 / I-680 junction — commute merge and weekend Sierra traffic",
  },
  {
    id: "hwy80at5180split",
    district: 3,
    title: "I-80 / SR-51 Split",
    place: "Sacramento",
    route: "I-80",
    hazard: "traffic",
    why: "Capital City freeway split — weekday congestion and crash delays",
  },
  {
    id: "hwy80atcolfax",
    district: 3,
    title: "I-80 at Colfax",
    place: "Colfax",
    route: "I-80",
    hazard: "weather",
    why: "Sierra foothills (~2,400 ft) — first snow, fog, and chain-control alerts",
  },
  {
    id: "hwy80atkingvalewb",
    district: 3,
    title: "I-80 at Kingvale",
    place: "Soda Springs",
    route: "I-80",
    hazard: "weather",
    why: "6,100 ft — snow, ice, and chain controls on the west side of Donner",
  },
  {
    id: "hwy80atdonnersummit",
    district: 3,
    title: "Donner Summit",
    place: "Soda Springs",
    route: "I-80",
    hazard: "weather",
    why: "7,200 ft pass — blizzard, ice, and closures on the Sierra crossing",
  },
  {
    id: "hwy80athwy89",
    district: 3,
    title: "I-80 at Hwy 89",
    place: "Truckee",
    route: "I-80",
    hazard: "weather",
    why: "Truckee junction — snow, chain controls, and ski-weekend backups",
  },
];

export function stillUrl(district: 3 | 4, id: string) {
  return `https://cwwp2.dot.ca.gov/data/d${district}/cctv/image/${id}/${id}.jpg`;
}
