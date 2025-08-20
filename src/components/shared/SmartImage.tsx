"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchBlobWithCache, getCachedBlobOnly } from "@/helpers/blobCache";

type SmartImageProps = {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  critical?: boolean;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
};

export default function SmartImage({
  src,
  alt,
  className,
  loading = "lazy",
  referrerPolicy = "no-referrer",
  critical = false,
  onLoad,
}: SmartImageProps) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (!src) return list;

    // 🚀 ImageKit CDN (nouveau système d'images)
    if (src.includes("ik.imagekit.io")) {
      // ImageKit est déjà optimisé, utiliser directement
      list.push(src);

      // Optionnel : Essayer sans le paramètre updatedAt pour le cache
      const baseUrl = src.split("?")[0];
      if (baseUrl !== src) {
        list.push(baseUrl);
      }
      return list;
    }

    // Always add normalized original as a fallback
    let url = src.trim();
    if (!/^https?:\/\//i.test(url)) {
      if (/^\/\//.test(url)) url = `https:${url}`;
      else url = `https://${url}`;
    }
    url = url.replace(/^http:\/\//i, "https://");
    try {
      const u = new URL(url);
      list.push(encodeURI(u.toString()));
    } catch {
      list.push(url);
    }

    return list;
  }, [src]);

  const [index, setIndex] = useState(0);
  const hasCandidates = candidates.length > 0;
  const [exhausted, setExhausted] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const isMobile = useRef(false);

  // Detect mobile once on mount
  useEffect(() => {
    isMobile.current = window.innerWidth <= 768;
  }, []);

  // Attempt to serve from IndexedDB blob cache with 24h TTL
  useEffect(() => {
    let isCancelled = false;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    async function run() {
      if (!candidates.length) return;

      // 🚀 Stratégie optimisée : Cache → ImageKit → Fallback
      let blob = null;

      // Essayer chaque candidat dans l'ordre jusqu'à ce qu'un fonctionne
      for (let i = 0; i < candidates.length && !blob && !isCancelled; i++) {
        const candidate = candidates[i];

        // 🎯 Cache plus agressif pour ImageKit (CDN fiable)
        const cacheTime = candidate.includes("ik.imagekit.io")
          ? 48 * 60 * 60 * 1000 // 48h pour ImageKit
          : TWENTY_FOUR_HOURS; // 24h pour les autres

        // On mobile, try cache first but fallback faster
        if (isMobile.current) {
          blob = await getCachedBlobOnly(candidate, cacheTime);
          if (!blob) {
            // Quick fallback to direct URL on mobile to reduce flickering
            break;
          }
        } else {
          // First try to get from cache only (no network request)
          blob = await getCachedBlobOnly(candidate, cacheTime);

          // If not in cache, fetch with cache
          if (!blob) {
            blob = await fetchBlobWithCache(candidate, cacheTime);
          }
        }

        if (blob) {
          break;
        }
      }

      if (!blob || isCancelled) return;

      // Create object URL only if we have a blob
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setObjectUrl(url);
    }

    run();

    return () => {
      isCancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [candidates]);

  if (!hasCandidates && !exhausted) return null;

  return (
    <>
      {exhausted || !hasCandidates ? (
        <div
          className={className}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(60% 40% at 50% 60%, rgba(236, 206, 147, 0.18), rgba(0,0,0,0.02))",
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={objectUrl || candidates[index]}
          src={objectUrl || candidates[index]}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
          crossOrigin="anonymous"
          referrerPolicy={referrerPolicy}
          data-critical={critical ? true : undefined}
          onError={() => {
            if (index < candidates.length - 1) setIndex((i) => i + 1);
            else setExhausted(true);
          }}
          onLoad={onLoad}
        />
      )}
    </>
  );
}
