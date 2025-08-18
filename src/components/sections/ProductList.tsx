"use client";

import styles from "./blog.module.css";
import SmartImage from "@/components/shared/SmartImage";
import Skeleton from "@/components/shared/Skeleton";

export type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className={styles.wrapperGallery}>
      {!products || products.length === 0 ? (
        <div className={styles.empty}>
          Aucun produit disponible pour le moment.
        </div>
      ) : (
        <ul className={styles.grid}>
          {products.map((product, idx) => (
            <li key={`${product.title}-${idx}`} className={styles.card}>
              {product.imageUrl ? (
                <div className={styles.media}>
                  <SmartImage
                    src={product.imageUrl}
                    alt={product.title}
                    className={styles.cover}
                  />
                  <span className={styles.mediaGlow} />
                  {typeof product.discountPercent === "number" &&
                  product.discountPercent > 0 ? (
                    <span
                      className={styles.badgePromo}
                      aria-label={`Скидка ${product.discountPercent}%`}
                    >
                      −{product.discountPercent}%
                    </span>
                  ) : null}
                </div>
              ) : null}
              <div className={styles.cardBody}>
                <div className={styles.rule} />
                <h3 className={styles.cardTitle}>{product.title}</h3>
                {product.subtitle ? (
                  <p className={styles.cardSubtitle}>{product.subtitle}</p>
                ) : (
                  <Skeleton className={styles.skelSubtitle} />
                )}
                {product.description ? (
                  <p className={styles.cardDescription}>
                    {product.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
