import Header from "@/components/navbar/Header";
import styles from "@/components/sections/products.module.css";
import Products from "@/components/sections/Products";
import path from "node:path";
import { promises as fs } from "node:fs";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

function makeUniqueHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((name) => {
    const base = name.trim() || "Colonne";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base} (${count + 1})`;
  });
}

async function readProductsFromXls() {
  try {
    const filePath = path.join(process.cwd(), "public", "pricelist.xls");
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return { columns: [], rows: [] };

    // Read as an array of arrays to better control headers/empty rows
    const aoa = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    if (!aoa || aoa.length === 0) return { columns: [], rows: [] };

    // Choose the header row as the one with the highest number of non-empty cells within the top 30 rows
    let headerIndex = 0;
    let bestScore = -1;
    const scanLimit = Math.min(aoa.length, 30);
    for (let i = 0; i < scanLimit; i++) {
      const row = aoa[i] || [];
      const nonEmpty = row.filter((c) => String(c ?? "").trim() !== "").length;
      if (nonEmpty > bestScore) {
        bestScore = nonEmpty;
        headerIndex = i;
      }
    }

    const headerRow = (aoa[headerIndex] || []).map(
      (h, i) => String(h ?? "").trim() || `Colonne ${i + 1}`
    );
    let columns = makeUniqueHeaders(headerRow);

    // Convert following rows to objects
    const body = aoa.slice(headerIndex + 1);
    let mapped = body
      .map((row) => {
        const obj: Record<string, unknown> = {};
        for (let i = 0; i < columns.length; i++) {
          const value = row && row[i] != null ? row[i] : "";
          obj[columns[i]] = typeof value === "string" ? value.trim() : value;
        }
        return obj;
      })
      // remove fully empty rows
      .filter((obj) =>
        Object.values(obj).some((v) => String(v ?? "").trim() !== "")
      );

    // Drop columns that are entirely empty
    const nonEmptyColumns = columns.filter((col) =>
      mapped.some((row) => String(row[col] ?? "").trim() !== "")
    );
    if (nonEmptyColumns.length !== columns.length) {
      columns = nonEmptyColumns;
      mapped = mapped.map((row) => {
        const cleaned: Record<string, unknown> = {};
        for (const col of columns) cleaned[col] = row[col];
        return cleaned;
      });
    }

    return { columns, rows: mapped };
  } catch (error) {
    console.error("Failed to read pricelist.xls", error);
    return { columns: [], rows: [] };
  }
}

export default async function ProductsPage() {
  const { columns, rows } = await readProductsFromXls();

  return (
    <main>
      <Header />
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Liste des produits</h1>
            <p className={styles.subtitle}>
              Découvrez notre sélection. Données chargées depuis le fichier
              prix.
            </p>
          </header>

          <Products columns={columns} rows={rows} />
        </div>
      </section>
    </main>
  );
}
