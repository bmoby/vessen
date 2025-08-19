import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "drive.google.com",
  "drive.usercontent.google.com",
  "lh3.googleusercontent.com",
  "usercontent.google.com",
  "googleusercontent.com",
]);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get("src");
    if (!src)
      return NextResponse.json({ error: "Missing src" }, { status: 400 });

    let target: URL;
    try {
      // Add scheme if missing
      const normalized = /^(https?:)?\/\//i.test(src)
        ? src.startsWith("//")
          ? `https:${src}`
          : src
        : `https://${src}`;
      target = new URL(normalized);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Guard: only proxy known hosts
    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }

    const upstream = await fetch(target.toString(), {
      // Cache agressif côté serveur pour réduire les requêtes répétées
      cache: "force-cache",
      headers: {
        // Present as a generic browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        // Minimize referrer/cookie constraints
        Referer: "",
      },
      redirect: "follow",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await upstream.arrayBuffer();
    const res = new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache at the edge for a short time to reduce repeated fetches
        "Cache-Control":
          "public, max-age=7200, s-maxage=86400, stale-while-revalidate=14400",
      },
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
