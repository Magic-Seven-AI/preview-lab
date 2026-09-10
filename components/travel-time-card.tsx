import {
  formatPacificDateTime,
  getFridayDeparture,
} from "@/lib/friday-departure";
import {
  DESTINATION,
  formatDistance,
  formatDuration,
  getTravelTime,
  googleMapsUrl,
  ORIGIN,
} from "@/lib/travel-time";
import styles from "./travel-time-card.module.css";

export async function TravelTimeCard() {
  const departure = getFridayDeparture();
  const travel = await getTravelTime(departure);

  return (
    <section className={styles.card} aria-labelledby="travel-time-heading">
      <p className={styles.kicker}>Weekend drive</p>
      <h2 id="travel-time-heading" className={styles.route}>
        {ORIGIN.name} → {DESTINATION.name}
      </h2>
      <p className={styles.depart}>
        Leave {formatPacificDateTime(departure)}
      </p>
      {travel.ok ? (
        <>
          <p className={styles.duration}>{formatDuration(travel.durationSeconds)}</p>
          <p className={styles.meta}>
            {formatDistance(travel.distanceMeters)}
            {travel.trafficAware
              ? " · traffic-aware estimate"
              : " · typical driving time, no live traffic"}
          </p>
        </>
      ) : (
        <p className={styles.error}>{travel.message}</p>
      )}
      <a
        className={styles.link}
        href={googleMapsUrl(departure)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Friday 7pm directions
      </a>
    </section>
  );
}

export function TravelTimeFallback() {
  return (
    <section className={styles.card} aria-busy="true" aria-label="Loading travel time">
      <p className={styles.kicker}>Weekend drive</p>
      <h2 className={styles.route}>
        {ORIGIN.name} → {DESTINATION.name}
      </h2>
      <p className={styles.depart}>Checking Friday 7pm departure…</p>
      <p className={styles.durationPending}>—</p>
    </section>
  );
}
