"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { driveDirectUrl, extractDriveFileId } from "@/helpers/drive";
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

    // Try Google Drive candidates if we can extract an ID
    const id = extractDriveFileId(src);
    if (id) {
      const view = driveDirectUrl(id, { mode: "view" });
      if (view) list.push(view);
      // Thumbnail endpoint can sometimes bypass cookies if public
      list.push(`https://drive.google.com/thumbnail?id=${id}&sz=w2048`);
      // Alternate Drive endpoints that sometimes work better depending on edge caches
      list.push(`https://drive.usercontent.google.com/uc?export=view&id=${id}`);
      list.push(`https://lh3.googleusercontent.com/d/${id}`);
      const download = driveDirectUrl(id, { mode: "download" });
      if (download) list.push(download);
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

    // Add proxied versions (server-side fetch) for each candidate to bypass desktop referrer/cookie issues
    const proxied = list.map(
      (u) => `/api/image-proxy?src=${encodeURIComponent(u)}`
    );
    // Put proxies first to prefer server-side fetch
    return Array.from(new Set([...proxied, ...list]));
  }, [src]);

  const [index, setIndex] = useState(0);
  const hasCandidates = candidates.length > 0;
  const [exhausted, setExhausted] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Attempt to serve from IndexedDB blob cache with 24h TTL
  useEffect(() => {
    let isCancelled = false;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    async function run() {
      if (!candidates.length) return;
      // Strategy: Try cache first, then proxy, then direct URLs
      const proxy = candidates.find((c) => c.startsWith("/api/image-proxy"));
      const key = proxy || candidates[0];
      
      // First try to get from cache only (no network request)
      let blob = await getCachedBlobOnly(key, TWENTY_FOUR_HOURS);
      
      // If not in cache, fetch with cache
      if (!blob) {
        blob = await fetchBlobWithCache(key, TWENTY_FOUR_HOURS);
      }
      
      if (!blob || isCancelled) return;
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
