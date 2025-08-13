import styles from "./hero.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 className={styles.title}>Excellence joaillière, sur-mesure</h1>
          <p className={styles.subtitle}>
            Des créations uniques, des gemmes d'exception, un accompagnement
            discret et attentif pour vos projets les plus précieux.
          </p>
          <Link href="#contact" className={styles.cta}>
            Demander un rendez-vous
          </Link>
        </div>
        <div className={styles.media}>
          <Image
            src="/window.svg"
            alt="Atelier joaillier"
            width={560}
            height={420}
            priority
          />
        </div>
      </div>
    </section>
  );
}
