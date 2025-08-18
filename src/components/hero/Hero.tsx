import styles from "./hero.module.css";
import Link from "next/link";
import Image from "next/image";
import PathShineOverlay from "./PathShineOverlay";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 className={styles.title}>Больше, чем посуда</h1>
          <p className={styles.subtitle}>
            Мы делаем так, чтобы ваш бренд звучал в каждом изделии, а наша
            главная ценность, доверие между вами и вашими клиентами.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/products" className={styles.cta}>
              Прайслист
            </Link>
            <Link href="/blog" className={styles.cta}>
              Акции
            </Link>
          </div>
        </div>
        <div className={styles.media}>
          <div className={styles.photo}>
            <Image
              src="/homepageimg6.png"
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
