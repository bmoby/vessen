"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import styles from "./pageAssemble.module.css";

type PageAssembleProps = {
  delayMs?: number;
  durationMs?: number;
};

export default function PageAssemble({
  children,
  delayMs = 2000, // match IntroOverlay (1400ms show + 600ms fade)
  durationMs = 320,
}: PropsWithChildren<PageAssembleProps>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), Math.max(0, delayMs));
    return () => window.clearTimeout(id);
  }, [delayMs]);

  return (
    <div
      className={`${styles.assemble} ${ready ? styles.ready : ""}`}
      data-assemble-ready={ready ? "true" : "false"}
      style={{
        // allow customizing duration per instance if needed
        ["--assemble-duration" as unknown as string]: `${durationMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
