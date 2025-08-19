import Header from "@/components/navbar/Header";
import styles from "@/components/sections/image.module.css";
import OffersGridClient from "../../components/sections/OffersGridClient";
import PageGate from "@/components/shared/PageGate";
import { driveDirectUrl } from "@/helpers/drive";
import * as XLSX from "xlsx";

export const revalidate = 600;

type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

function buildTrendsXlsxUrl(): string {
  const url = process.env.TREND_SHEET_URL?.trim();
  if (!url) return "";
  const driveUrl = driveDirectUrl(url, { mode: "download" });
  return driveUrl || url;
}

async function fetchXlsxArrayBuffer(): Promise<ArrayBuffer | null> {
  try {
    const url = buildTrendsXlsxUrl();
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return await res.arrayBuffer();
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

function parseXlsxRows(buffer: ArrayBuffer): string[][] {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  return (rows as unknown as unknown[][]).map((r) =>
    (r ?? []).map((c) => (c == null ? "" : String(c)))
  );
}

async function readTrends(): Promise<Product[]> {
  const buffer = await fetchXlsxArrayBuffer();
  if (!buffer) return [];
  try {
    const rows = parseXlsxRows(buffer);
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
    return products;
  } catch {
    return [];
  }
}

export default async function TrendsPage() {
  const products = await readTrends();

  return (
    <main>
      <PageGate>
        <Header />
        <section className={styles.section}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1 className={styles.title}>Тренды</h1>
              <p className={styles.subtitle}>Актуальные тренды.</p>
            </header>
            <OffersGridClient products={products} />
          </div>
        </section>
      </PageGate>
    </main>
  );
}
