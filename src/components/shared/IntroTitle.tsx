"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import styles from "./introTitle.module.css";

type IntroTitleProps = {
  text: string;
};

export default function IntroTitle({ text }: IntroTitleProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const letters = useMemo(() => text.split(""), [text]);

  return (
    <div className={styles.wrapper}>
      <h1
        className={`${styles.title} ${isReady ? styles.ready : ""}`}
        style={{
          fontFamily: "var(--font-playfair), var(--font-geist-sans), serif",
        }}
        aria-label={text}
      >
        <span className={styles.highlight} aria-hidden="true" />
        <span className={styles.shimmer} aria-hidden="true" />
        <span className={styles.gloss} aria-hidden="true" />
        {letters.map((char, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${char}-${index}`}
            className={styles.letter}
            style={
              {
                // CSS custom property used for staggered delays
                ["--d" as unknown as string]: `${index * 70}ms`,
              } as CSSProperties
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <span className={styles.underline} aria-hidden="true" />
      </h1>
    </div>
  );
}
