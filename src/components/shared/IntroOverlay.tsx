"use client";

import { useEffect, useState } from "react";
import IntroTitle from "./IntroTitle";
import styles from "./introOverlay.module.css";

type IntroOverlayProps = {
  text?: string;
  durationMs?: number;
};

export default function IntroOverlay({
  text = "VESSEN",
  durationMs = 1400,
}: IntroOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsFading(true);
      const hideTimer = setTimeout(() => setIsVisible(false), 600);
      return () => clearTimeout(hideTimer);
    }, durationMs);
    return () => clearTimeout(showTimer);
  }, [durationMs]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${isFading ? styles.fadeOut : ""}`}>
      <IntroTitle text={text} />
    </div>
  );
}
