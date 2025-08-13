import styles from "./hero.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 className={styles.title}>Art de la table d’exception</h1>
          <p className={styles.subtitle}>
            Pièces artisanales, finitions précieuses et détails intemporels pour
            sublimer vos tables.
          </p>
          <div className={styles.actions}>
            <Link href="#collection" className={styles.ctaPrimary}>
              Voir la collection
            </Link>
            <Link href="#conseil" className={styles.ctaGhost}>
              Conseils sur mesure
            </Link>
          </div>
        </div>
        <div className={styles.media}>
          <div className={styles.photo}>
            <Image
              src="/window.svg"
              alt="Service de table haut de gamme"
              width={640}
              height={480}
              className={styles.img}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
