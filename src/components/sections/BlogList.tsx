"use client";

import styles from "./blog.module.css";
import SmartImage from "@/components/shared/SmartImage";
import Skeleton from "@/components/shared/Skeleton";

export type BlogArticle = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export default function BlogList({ articles }: { articles: BlogArticle[] }) {
  return (
    <div className={styles.wrapperGallery}>
      {!articles || articles.length === 0 ? (
        <div className={styles.empty}>
          Aucun élément disponible pour le moment.
        </div>
      ) : (
        <ul className={styles.grid}>
          {articles.map((a, idx) => (
            <li key={`${a.title}-${idx}`} className={styles.card}>
              {a.imageUrl ? (
                <div className={styles.media}>
                  <SmartImage
                    src={a.imageUrl}
                    alt={a.title}
                    className={styles.cover}
                  />
                  <span className={styles.mediaGlow} />
                </div>
              ) : null}
              <div className={styles.cardBody}>
                <div className={styles.rule} />
                <h3 className={styles.cardTitle}>{a.title}</h3>
                {a.subtitle ? (
                  <p className={styles.cardSubtitle}>{a.subtitle}</p>
                ) : (
                  <Skeleton className={styles.skelSubtitle} />
                )}
                {a.description ? (
                  <p className={styles.cardDescription}>{a.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
