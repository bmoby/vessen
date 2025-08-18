import Link from "next/link";
import styles from "./offersPreview.module.css";
import SmartImage from "../shared/SmartImage";
import * as XLSX from "xlsx";

export type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

function buildProductsSheetExportUrl(): string {
  const sheetId = process.env.PRODUCTS_SHEET_ID || process.env.BLOG_SHEET_ID;
  const gid = process.env.PRODUCTS_SHEET_GID || process.env.BLOG_SHEET_GID;
  if (!sheetId) return "";
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  return gid ? `${base}&gid=${gid}` : base;
}

async function fetchWorkbookBuffer(): Promise<Buffer | null> {
  try {
    const url = buildProductsSheetExportUrl();
    if (!url) return null;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(new Uint8Array(arrayBuffer));
  } catch {
    return null;
  }
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
    const fileBuffer = await fetchWorkbookBuffer();
    if (!fileBuffer) return [];

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return [];

    const aoa = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });

    if (!aoa || aoa.length < 2) return [];

    const rows = aoa.slice(1);

    const products: Product[] = rows
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

    // Return only the first 3 products
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

        <div className={styles.grid}>
          {products.map((product, idx) => (
            <article key={`${product.title}-${idx}`} className={styles.card}>
              {product.imageUrl && (
                <div className={styles.media}>
                  <SmartImage
                    src={product.imageUrl}
                    alt={product.title}
                    className={styles.cover}
                  />
                  <span className={styles.mediaGlow} />
                  {product.discountPercent && product.discountPercent > 0 && (
                    <div className={styles.badge}>
                      −{product.discountPercent}%
                    </div>
                  )}
                </div>
              )}
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{product.title}</h3>
                {product.subtitle && (
                  <p className={styles.cardSubtitle}>{product.subtitle}</p>
                )}
                {product.description && (
                  <p className={styles.cardDescription}>
                    {product.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/blog" className={styles.ctaButton}>
            Посмотреть все акции
          </Link>
        </div>
      </div>
    </section>
  );
}
