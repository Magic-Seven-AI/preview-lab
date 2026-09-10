import type { LiveCamera } from "@/lib/cameras/types";
import { LiveStill } from "./live-still";
import styles from "./cameras.module.css";

export function CameraCard({ camera, index }: { camera: LiveCamera; index: number }) {
  const elev =
    camera.hazard === "weather" && camera.elevationFt != null
      ? `${camera.elevationFt.toLocaleString()} ft`
      : null;

  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <LiveStill
          src={camera.imageUrl}
          alt={`${camera.title} traffic camera`}
          preload={index <= 3}
        />
        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles[camera.hazard]}`}>
            {camera.hazard}
          </span>
          {!camera.inService ? (
            <span className={`${styles.badge} ${styles.offlineBadge}`}>offline</span>
          ) : null}
        </div>
        <span className={styles.index}>{index}</span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{camera.title}</h2>
        <p className={styles.meta}>
          {camera.route} · {camera.place}
          {elev ? ` · ${elev}` : ""}
        </p>
        <p className={styles.why}>{camera.why}</p>
      </div>
    </article>
  );
}
