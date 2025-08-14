"use client";

import { useMemo, useState } from "react";
import styles from "./products.module.css";

export type ProductRow = Record<string, unknown>;

interface ProductsProps {
  columns: string[];
  rows: ProductRow[];
}

function normalize(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return JSON.stringify(value);
}

export default function Products({ columns, rows }: ProductsProps) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => normalize(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <input
          className={styles.search}
          type="search"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher"
        />
        <div className={styles.count}>{filteredRows.length} éléments</div>
      </div>

      {columns.length === 0 ? (
        <div className={styles.empty}>Aucune donnée trouvée.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col}>{normalize(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
