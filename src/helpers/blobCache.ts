/**
 * Simple IndexedDB-based blob cache with TTL.
 * Stores blobs by URL with a timestamp. Designed for client-side use only.
 */

const DB_NAME = "asset-cache";
const DB_VERSION = 1;
const STORE_NAME = "blobs";
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours default

type CachedRecord = {
  url: string;
  ts: number;
  blob: Blob;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isBrowser()) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "url" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedBlob(
  url: string,
  maxAgeMs: number
): Promise<Blob | null> {
  const db = await openDatabase();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(url);
    req.onsuccess = () => {
      const rec = req.result as CachedRecord | undefined;
      if (!rec) return resolve(null);
      if (Date.now() - rec.ts > maxAgeMs) return resolve(null);
      resolve(rec.blob);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function putCachedBlob(url: string, blob: Blob): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const rec: CachedRecord = { url, ts: Date.now(), blob };
    const req = store.put(rec);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function fetchBlobWithCache(
  url: string,
  maxAgeMs: number = DEFAULT_TTL
): Promise<Blob | null> {
  try {
    const cached = await getCachedBlob(url, maxAgeMs);
    if (cached) return cached;
  } catch {
    // ignore caches errors
  }
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const blob = await res.blob();
    try {
      await putCachedBlob(url, blob);
    } catch {
      // ignore store errors
    }
    return blob;
  } catch {
    return null;
  }
}

// New function to get cached blob without fetching if not found
export async function getCachedBlobOnly(
  url: string,
  maxAgeMs: number = DEFAULT_TTL
): Promise<Blob | null> {
  try {
    return await getCachedBlob(url, maxAgeMs);
  } catch {
    return null;
  }
}
