"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";

type MapWithLoaderProps = {
  iframeSrc: string;
  height?: number | string;
  mapSearchUrl: string;
  title?: string;
};

export default function MapWithLoader({
  iframeSrc,
  height = 500,
  mapSearchUrl,
  title = "Carte",
}: MapWithLoaderProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fallback: cache off cases where onLoad is not fired on some desktop browsers
  useEffect(() => {
    if (mapLoaded) return;
    const fallback = window.setTimeout(() => setMapLoaded(true), 6000);
    return () => window.clearTimeout(fallback);
  }, [mapLoaded, iframeSrc]);

  return (
    <div style={{ position: "relative" }}>
      {!mapLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface)",
            zIndex: 1,
          }}
        >
          <Spinner />
        </div>
      )}
      <iframe
        src={iframeSrc}
        width="100%"
        height={height}
        frameBorder={0}
        style={{ display: "block", width: "100%", border: 0 }}
        title={title}
        loading="lazy"
        onLoad={() => setMapLoaded(true)}
      />
      <a
        href={mapSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ouvrir la carte dans le navigateur"
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
