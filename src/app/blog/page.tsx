import Header from "@/components/navbar/Header";
import styles from "@/components/sections/image.module.css";
import OffersGridClient from "../../components/sections/OffersGridClient";
import PageGate from "@/components/shared/PageGate";

export const revalidate = 600;
type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

function buildProductsSheetExportUrl(): string {
  const sheetId = process.env.PRODUCTS_SHEET_ID || process.env.BLOG_SHEET_ID; // Fallback to blog sheet for now
  const gid = process.env.PRODUCTS_SHEET_GID || process.env.BLOG_SHEET_GID; // optional
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

function parseDiscount(value: unknown): number | undefined {
  if (value == null) return undefined;
  const str = String(value).trim();
  if (!str) return undefined;
  // Accept formats like "10", "-10", "10%"
  const m = str.match(/-?\d{1,3}/);
  if (!m) return undefined;
  const n = parseInt(m[0], 10);
  if (Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(90, Math.abs(n)));
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

async function readFeaturedProducts(): Promise<{
  products: Product[];
  downloadUrl: string;
}> {
  const url = buildProductsSheetExportUrl();
  const downloadUrl = url || "#";
  try {
    const csv = await fetchCsvText();
    if (!csv) return { products: [], downloadUrl };
    const rows = parseCsv(csv);
    if (!rows || rows.length < 2) return { products: [], downloadUrl };
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

    return { products, downloadUrl };
  } catch {
    return { products: [], downloadUrl };
  }
}

export default async function FeaturedProductsPage() {
  const { products } = await readFeaturedProducts();

  return (
    <main>
      <PageGate>
        <Header />
        <section className={styles.section}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1 className={styles.title}>Акции</h1>
              <p className={styles.subtitle}>Лучшие предложения сегодня.</p>
            </header>
            <OffersGridClient products={products} />
          </div>
        </section>
      </PageGate>
    </main>
  );
}
