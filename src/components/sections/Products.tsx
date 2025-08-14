"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./products.module.css";

export type ProductRow = Record<string, unknown>;

interface ProductsProps {
  columns: string[];
  rows: ProductRow[];
  labels?: string[];
}

function normalize(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return JSON.stringify(value);
}

export default function Products({ columns, rows, labels }: ProductsProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const PAGE_SIZE = 300;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    // Reset pagination when data set or query changes
    setVisibleCount(PAGE_SIZE);
  }, [submittedQuery, rows]);

  const filteredRows = useMemo(() => {
    if (!submittedQuery.trim()) return rows;
    const q = submittedQuery.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => normalize(v).toLowerCase().includes(q))
    );
  }, [rows, submittedQuery]);

  const total = filteredRows.length;
  const visibleRows = filteredRows.slice(0, visibleCount);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <input
          className={styles.search}
          type="search"
          placeholder="Rechercher un produit…"
          ref={inputRef}
          onChange={(e) => {
            if (e.currentTarget.value.trim() === "") {
              setSubmittedQuery("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSubmittedQuery(inputRef.current?.value ?? "");
            }
          }}
          aria-label="Rechercher"
        />
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => setSubmittedQuery(inputRef.current?.value ?? "")}
        >
          Rechercher
        </button>
        <div className={styles.count}>{filteredRows.length} éléments</div>
      </div>

      {columns.length === 0 ? (
        <div className={styles.empty}>Aucune donnée trouvée.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={col}>{labels?.[i] ?? col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, colIdx) => {
                    const value = normalize(row[col]);
                    const isLast = colIdx === columns.length - 1;
                    if (isLast) {
                      const trimmed = value.trim();
                      const match = trimmed.match(/^(\d{10,})\s+(\d{10,})$/);
                      if (match) {
                        const parts = trimmed.split(/\s+/);
                        return (
                          <td key={col}>
                            {parts.map((part, i) => (
                              <span key={i}>
                                {part}
                                {i < parts.length - 1 ? <br /> : null}
                              </span>
                            ))}
                          </td>
                        );
                      }
                    }
                    return <td key={col}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.footerTools}>
            <span className={styles.range}>
              {Math.min(visibleCount, total)} / {total}
            </span>
            {visibleCount < total && (
              <button
                type="button"
                className={styles.loadMore}
                onClick={() =>
                  setVisibleCount((c) => Math.min(total, c + PAGE_SIZE))
                }
              >
                Charger plus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
