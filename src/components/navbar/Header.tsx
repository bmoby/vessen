"use client";

import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          VESSEN
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/products">Produits</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
