"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./cameras.module.css";

const REFRESH_MS = 45_000;

export function LiveStill({
  src,
  alt,
  preload = false,
}: {
  src: string;
  alt: string;
  preload?: boolean;
}) {
  const [bust, setBust] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFailed(false);
      setBust(Date.now());
    }, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [src]);

  if (failed) {
    return <div className={styles.offline}>Camera image unavailable</div>;
  }

  const url = bust ? `${src}${src.includes("?") ? "&" : "?"}t=${bust}` : src;

  return (
    <Image
      className={styles.image}
      src={url}
      alt={alt}
      fill
      unoptimized
      preload={preload}
      loading={preload ? "eager" : "lazy"}
      sizes="(max-width: 700px) 100vw, 33vw"
      onError={() => setFailed(true)}
    />
  );
}
