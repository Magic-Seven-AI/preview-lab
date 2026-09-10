const PACIFIC = "America/Los_Angeles";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type PacificParts = {
  weekday: (typeof WEEKDAYS)[number];
  year: number;
  month: number;
  day: number;
};

function pacificParts(date: Date): PacificParts {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PACIFIC,
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const weekday = parts.weekday as PacificParts["weekday"];
  if (!WEEKDAYS.includes(weekday)) {
    throw new Error(`Unexpected weekday: ${parts.weekday}`);
  }

  return {
    weekday,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function tzOffsetMs(instant: Date, timeZone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return asUtc - instant.getTime();
}

function pacificLocalTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const first = new Date(asUtc - tzOffsetMs(new Date(asUtc), PACIFIC));
  return new Date(asUtc - tzOffsetMs(first, PACIFIC));
}

function addUtcDays(year: number, month: number, day: number, days: number) {
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/** Friday 7pm PT this week (Sun–Fri). Saturday uses the next Friday. */
export function getFridayDeparture(now = new Date()): Date {
  const parts = pacificParts(now);
  const weekday = WEEKDAYS.indexOf(parts.weekday);
  const daysUntilFriday = weekday === 6 ? 6 : 5 - weekday;
  const friday = addUtcDays(parts.year, parts.month, parts.day, daysUntilFriday);
  return pacificLocalTime(friday.year, friday.month, friday.day, 19, 0);
}

export function formatPacificDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC,
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}
