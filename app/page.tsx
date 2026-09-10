import { loadCorridorCameras } from "@/lib/cameras/caltrans";
import { CameraGrid } from "@/components/cameras/camera-grid";
import styles from "./page.module.css";

export default async function Home() {
  const cameras = await loadCorridorCameras();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>OAK → Truckee</p>
        <h1 className={styles.title}>Corridor cameras</h1>
        <p className={styles.subtitle}>
          Ten Caltrans stills along I-880 and I-80, from Oakland Airport to
          Truckee — spots that usually jam up or take the Sierra weather.
        </p>
      </header>

      <p className={styles.legend}>
        <span>
          <span className={`${styles.dot} ${styles.traffic}`} />
          High traffic
        </span>
        <span>
          <span className={`${styles.dot} ${styles.weather}`} />
          Bad weather
        </span>
      </p>

      <ol className={styles.route} aria-label="West to east">
        {cameras.map((cam, i) => (
          <li key={cam.id} className={styles.stop}>
            <b>
              {i + 1}. {cam.place}
            </b>
            {cam.title}
          </li>
        ))}
      </ol>

      <CameraGrid cameras={cameras} />

      <p className={styles.credit}>
        Stills from Caltrans CWWP2. Images refresh about every 45 seconds.
      </p>
    </main>
  );
}
