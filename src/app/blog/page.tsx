import Header from "@/components/navbar/Header";
import styles from "@/components/sections/blog.module.css";
import BlogList, { type BlogArticle } from "../../components/sections/BlogList";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

function buildBlogSheetExportUrl(): string {
  const sheetId = process.env.BLOG_SHEET_ID;
  const gid = process.env.BLOG_SHEET_GID; // optional
  if (!sheetId) return "";
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  return gid ? `${base}&gid=${gid}` : base;
}

async function fetchWorkbookBuffer(): Promise<Buffer | null> {
  try {
    const url = buildBlogSheetExportUrl();
    if (!url) return null;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(new Uint8Array(arrayBuffer));
  } catch {
    return null;
  }
}

async function readBlogArticles(): Promise<{
  articles: BlogArticle[];
  downloadUrl: string;
}> {
  const url = buildBlogSheetExportUrl();
  const downloadUrl = url || "#";
  try {
    const fileBuffer = await fetchWorkbookBuffer();
    if (!fileBuffer) return { articles: [], downloadUrl };

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return { articles: [], downloadUrl };

    const aoa = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });

    if (!aoa || aoa.length < 2) return { articles: [], downloadUrl };

    // First row is header per spec
    const rows = aoa.slice(1);

    const articles: BlogArticle[] = rows
      .map((row) => {
        const imageUrl = String(row[0] ?? "").trim();
        const title = String(row[1] ?? "").trim();
        const subtitle = String(row[2] ?? "").trim();
        const description = String(row[3] ?? "").trim();
        const isEmpty = [imageUrl, title, subtitle, description].every(
          (v) => v === ""
        );
        if (isEmpty || !title) return null;
        return {
          imageUrl: imageUrl || undefined,
          title,
          subtitle,
          description,
        } as BlogArticle;
      })
      .filter(Boolean) as BlogArticle[];

    return { articles, downloadUrl };
  } catch {
    return { articles: [], downloadUrl };
  }
}

export default async function BlogPage() {
  const { articles } = await readBlogArticles();

  return (
    <main>
      <Header />
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Blog</h1>
            <p className={styles.subtitle}>
              Actualités et articles. Données chargées depuis Google Sheets.
            </p>
          </header>

          <BlogList articles={articles} />
        </div>
      </section>
    </main>
  );
}
