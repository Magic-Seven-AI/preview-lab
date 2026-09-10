import type { LiveCamera } from "@/lib/cameras/types";
import { CameraCard } from "./camera-card";
import styles from "./cameras.module.css";

export function CameraGrid({ cameras }: { cameras: LiveCamera[] }) {
  return (
    <div className={styles.grid}>
      {cameras.map((camera, i) => (
        <CameraCard key={camera.id} camera={camera} index={i + 1} />
      ))}
    </div>
  );
}
