import Header from "@/components/navbar/Header";
import styles from "@/components/sections/image.module.css";
import ProductList, {
  type Product,
} from "../../components/sections/ProductList";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

function buildProductsSheetExportUrl(): string {
  const sheetId = process.env.PRODUCTS_SHEET_ID || process.env.BLOG_SHEET_ID; // Fallback to blog sheet for now
  const gid = process.env.PRODUCTS_SHEET_GID || process.env.BLOG_SHEET_GID; // optional
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
  // Accept formats like "10", "-10", "10%"
  const m = str.match(/-?\d{1,3}/);
  if (!m) return undefined;
  const n = parseInt(m[0], 10);
  if (Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(90, Math.abs(n)));
}

async function readFeaturedProducts(): Promise<{
  products: Product[];
  downloadUrl: string;
}> {
  const url = buildProductsSheetExportUrl();
  const downloadUrl = url || "#";
  try {
    const fileBuffer = await fetchWorkbookBuffer();
    if (!fileBuffer) return { products: [], downloadUrl };

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return { products: [], downloadUrl };

    const aoa = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });

    if (!aoa || aoa.length < 2) return { products: [], downloadUrl };

    // First row is header per spec
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

    return { products, downloadUrl };
  } catch {
    return { products: [], downloadUrl };
  }
}

export default async function FeaturedProductsPage() {
  const { products } = await readFeaturedProducts();

  return (
    <main>
      <Header />
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Акции</h1>
            <p className={styles.subtitle}>Лучшие предложения сегодня.</p>
          </header>

          <ProductList products={products} />
        </div>
      </section>
    </main>
  );
}
