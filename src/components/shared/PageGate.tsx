"use client";

import { useEffect, useMemo, useState } from "react";
import Spinner from "./Spinner";

type PageGateProps = {
  children: React.ReactNode;
  criticalSelectors?: string[];
  minWaitMs?: number;
  maxWaitMs?: number;
};

export default function PageGate({
  children,
  criticalSelectors = ["[data-critical]"],
  minWaitMs = 300,
  maxWaitMs = 4000,
}: PageGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const waitFonts =
      typeof (document as any).fonts?.ready === "object"
        ? (document as any).fonts.ready.catch(() => {})
        : Promise.resolve();

    const waitImages = Promise.all(
      criticalSelectors
        .flatMap((sel) => Array.from(document.querySelectorAll(sel)))
        .map((el) => {
          if (el instanceof HTMLImageElement) {
            if (el.complete && el.naturalWidth > 0)
              return Promise.resolve(undefined);
            return new Promise<void>((resolve) => {
              el.addEventListener("load", () => resolve(), { once: true });
              el.addEventListener("error", () => resolve(), { once: true });
            });
          }
          return Promise.resolve(undefined);
        })
    );

    const waitIdle = new Promise<void>((resolve) => {
      const ric: any = (window as any).requestIdleCallback;
      if (typeof ric === "function") {
        try {
          ric(() => resolve(), { timeout: 300 });
          return;
        } catch {
          // fall through to setTimeout
        }
      }
      window.setTimeout(() => resolve(), 300);
    });

    const minWait = new Promise<void>((resolve) =>
      setTimeout(resolve, minWaitMs)
    );
    const maxWait = new Promise<void>((resolve) =>
      setTimeout(resolve, maxWaitMs)
    );

    Promise.race([
      Promise.all([waitFonts, waitImages, waitIdle, minWait]).then(
        () => undefined
      ),
      maxWait.then(() => undefined),
    ]).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      // Small grace to avoid flash
      const remaining = Math.max(0, 160 - elapsed);
      setTimeout(() => {
        if (!cancelled) setReady(true);
      }, remaining);
    });

    return () => {
      cancelled = true;
    };
  }, [criticalSelectors, minWaitMs, maxWaitMs]);

  const overlay = useMemo(
    () => (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg)",
          zIndex: 2000,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Spinner />
      </div>
    ),
    []
  );

  return (
    <>
      {!ready && overlay}
      {children}
    </>
  );
}
