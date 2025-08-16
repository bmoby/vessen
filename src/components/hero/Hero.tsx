import styles from "./hero.module.css";
import Link from "next/link";
import Image from "next/image";
import PathShineOverlay from "./PathShineOverlay";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 className={styles.title}>Посуда и всё необходимое оптом</h1>
          <p className={styles.subtitle}>
            Качество, на которое можно положиться, цены, которые приятно удивят
          </p>
          <Link href="/products" className={styles.cta}>
            Перейти к продукции
          </Link>
        </div>
        <div className={styles.media}>
          <div className={styles.photo}>
            <Image
              src="/homepageimg2.png"
              alt="Service de table haut de gamme"
              width={640}
              height={480}
              className={styles.img}
              priority
            />
            <PathShineOverlay />
          </div>
        </div>
      </div>
    </section>
  );
}
