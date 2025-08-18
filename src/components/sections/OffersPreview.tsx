import Link from "next/link";
import styles from "./offersPreview.module.css";
import OffersGridClient from "./OffersGridClient";

export type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

// Client grid is imported directly; this file is a Server Component passing serializable props

function buildProductsSheetExportUrl(): string {
  const sheetId = process.env.PRODUCTS_SHEET_ID || process.env.BLOG_SHEET_ID;
  const gid = process.env.PRODUCTS_SHEET_GID || process.env.BLOG_SHEET_GID;
  if (!sheetId) return "";
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  return gid ? `${base}&gid=${gid}` : base;
}

async function fetchCsvText(): Promise<string | null> {
  try {
    const url = buildProductsSheetExportUrl();
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (inQuotes) {
      if (char === '"') {
        const next = csv[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        current.push(field);
        field = "";
      } else if (char === "\n") {
        current.push(field);
        rows.push(current);
        current = [];
        field = "";
      } else if (char === "\r") {
        // ignore
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }
  return rows;
}

function parseDiscount(value: unknown): number | undefined {
  if (value == null) return undefined;
  const str = String(value).trim();
  if (!str) return undefined;
  const m = str.match(/-?\d{1,3}/);
  if (!m) return undefined;
  const n = parseInt(m[0], 10);
  if (Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(90, Math.abs(n)));
}

async function readLatestOffers(): Promise<Product[]> {
  try {
    const csv = await fetchCsvText();
    if (!csv) return [];
    const rows = parseCsv(csv);
    if (!rows || rows.length < 2) return [];
    const dataRows = rows.slice(1);
    const products: Product[] = dataRows
      .map((row) => {
        const imageUrl = String(row[0] ?? "").trim();
        const title = String(row[1] ?? "").trim();
        const subtitle = String(row[2] ?? "").trim();
        const description = String(row[3] ?? "").trim();
        const discountPercent = parseDiscount(row[4]);
        const isEmpty = [imageUrl, title, subtitle, description].every(
          (v) => v === ""
        );
        if (isEmpty || !title) return null;
        return {
          imageUrl: imageUrl || undefined,
          title,
          subtitle,
          description,
          discountPercent,
        } as Product;
      })
      .filter(Boolean) as Product[];
    return products.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function OffersPreview() {
  const products = await readLatestOffers();

  if (!products || products.length === 0) {
    return null; // Don't render the section if no products
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Специальные предложения</h2>
          <p className={styles.subtitle}>
            Откройте для себя наши лучшие акции и эксклюзивные скидки.
          </p>
        </header>

        <OffersGridClient products={products} />

        <div className={styles.cta}>
          <Link href="/blog" className={styles.ctaButton}>
            Посмотреть все акции
          </Link>
        </div>
      </div>
    </section>
  );
}
