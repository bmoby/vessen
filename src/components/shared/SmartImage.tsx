"use client";

import { useMemo, useState } from "react";
import { driveDirectUrl, extractDriveFileId } from "@/helpers/drive";

type SmartImageProps = {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
};

export default function SmartImage({
  src,
  alt,
  className,
  loading = "lazy",
  referrerPolicy = "no-referrer",
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
          key={candidates[index]}
          src={candidates[index]}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
          crossOrigin="anonymous"
          referrerPolicy={referrerPolicy}
          onError={() => {
            if (index < candidates.length - 1) setIndex((i) => i + 1);
            else setExhausted(true);
          }}
        />
      )}
    </>
  );
}
