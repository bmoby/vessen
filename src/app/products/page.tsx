import Header from "@/components/navbar/Header";
import styles from "@/components/sections/products.module.css";
import Products from "../../components/sections/Products";
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

function buildGoogleSheetsExportUrl(): string {
  const sheetId = process.env.PRICE_SHEET_ID;
  const gid = process.env.PRICE_SHEET_GID; // optional specific tab
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  return gid ? `${base}&gid=${gid}` : base;
}

async function fetchWorkbookBuffer(): Promise<Buffer | null> {
  try {
    const url = buildGoogleSheetsExportUrl();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(new Uint8Array(arrayBuffer));
  } catch {
    return null;
  }
}

async function readProductsFromXls() {
  try {
    const fileBuffer = await fetchWorkbookBuffer();
    if (!fileBuffer)
      return {
        columns: [],
        rows: [],
        displayLabels: [],
        downloadUrl: buildGoogleSheetsExportUrl(),
      };
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet)
      return {
        columns: [],
        rows: [],
        displayLabels: [],
        downloadUrl: buildGoogleSheetsExportUrl(),
      };

    // Read as an array of arrays to better control headers/empty rows
    const aoa = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    if (!aoa || aoa.length === 0)
      return {
        columns: [],
        rows: [],
        displayLabels: [],
        downloadUrl: buildGoogleSheetsExportUrl(),
      };

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

    const rawHeaderRow = (aoa[headerIndex] || []).map((h) =>
      String(h ?? "").trim()
    );
    // If 5th header is empty due to merged header across cols 4-5, use col 4 title
    if (rawHeaderRow.length > 4 && rawHeaderRow[4] === "" && rawHeaderRow[3]) {
      rawHeaderRow[4] = rawHeaderRow[3];
    }
    const headerRowWithFallback = rawHeaderRow.map(
      (h, i) => h || `Colonne ${i + 1}`
    );
    const initialColumns = makeUniqueHeaders(headerRowWithFallback);
    // Ignore only first (index 0) column by position
    const ignoreIndices = new Set([0]);
    const selectedIndices = initialColumns
      .map((_, i) => i)
      .filter((i) => !ignoreIndices.has(i));
    let columns = selectedIndices.map((i) => initialColumns[i]);
    // Convert following rows to objects
    const body = aoa.slice(headerIndex + 1);
    let mapped = body
      .map((row) => {
        const obj: Record<string, unknown> = {};
        for (let k = 0; k < columns.length; k++) {
          const colIndex = selectedIndices[k];
          const value = row && row[colIndex] != null ? row[colIndex] : "";
          obj[columns[k]] = typeof value === "string" ? value.trim() : value;
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

    // Build display labels from current columns
    const displayLabels = columns.map((name) => name.replace(/ \(\d+\)$/g, ""));

    // If two adjacent labels are exactly "Номенклатура", fix semantic titles for the next columns
    for (let i = 0; i < displayLabels.length - 1; i++) {
      if (
        displayLabels[i] === "Номенклатура" &&
        displayLabels[i + 1] === "Номенклатура"
      ) {
        // Keep the first as "Номенклатура"
        displayLabels[i + 1] = "Цена";
        if (i + 2 < displayLabels.length) displayLabels[i + 2] = "Остаток";
        if (i + 3 < displayLabels.length) {
          // If the next column looks like a barcode, name it accordingly
          const colKey = columns[i + 3];
          const looksBarcode = mapped.some((r) =>
            /^(\d{10,14})$/.test(String(r[colKey] ?? "").trim())
          );
          displayLabels[i + 3] = looksBarcode
            ? "Штрихкод"
            : displayLabels[i + 3];
        }
        break;
      }
    }

    return {
      columns,
      rows: mapped,
      displayLabels,
      downloadUrl: buildGoogleSheetsExportUrl(),
    };
  } catch (error) {
    console.error("Failed to read pricelist.xls", error);
    return {
      columns: [],
      rows: [],
      displayLabels: [],
      downloadUrl: buildGoogleSheetsExportUrl(),
    };
  }
}

export default async function ProductsPage() {
  const { columns, rows, displayLabels, downloadUrl } =
    await readProductsFromXls();

  return (
    <main>
      <Header />
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Каталог продукции</h1>
          </header>

          <Products
            columns={columns}
            rows={rows}
            labels={displayLabels}
            downloadUrl={downloadUrl}
          />
        </div>
      </section>
    </main>
  );
}
