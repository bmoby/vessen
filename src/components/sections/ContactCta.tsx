import Link from "next/link";
import Image from "next/image";
import styles from "./contactCta.module.css";
import { IconArrowRight } from "@/components/shared/Icons";

export default function ContactCta() {
  return (
    <section className={styles.section} aria-labelledby="contact-cta-title">
      <div className={styles.container}>
        <div className={styles.copy}>
          <h2 id="contact-cta-title" className={styles.title}>
            Parlons de votre projet
          </h2>
          <p className={styles.subtitle}>
            Un accompagnement discret et attentif. Choisissez le canal qui vous
            convient.
          </p>
        </div>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link href="tel:+33600000000" className={styles.link}>
              <span className={styles.linkLeft}>
                <Image
                  src="/vectors/phone.png"
                  width={20}
                  height={20}
                  alt="Téléphone"
                  className={styles.linkIcon}
                />
                <span className={styles.linkText}>+33 6 00 00 00 00</span>
              </span>
              <IconArrowRight className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://wa.me/33600000000"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <Image
                  src="/vectors/whatsapp.png"
                  width={20}
                  height={20}
                  alt="WhatsApp"
                  className={styles.linkIcon}
                />
                <span className={styles.linkText}>WhatsApp</span>
              </span>
              <IconArrowRight className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://t.me/username"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <Image
                  src="/vectors/telegram.png"
                  width={20}
                  height={20}
                  alt="Telegram"
                  className={styles.linkIcon}
                />
                <span className={styles.linkText}>Telegram</span>
              </span>
              <IconArrowRight className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://instagram.com/yourbrand"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <Image
                  src="/vectors/instagram.png"
                  width={20}
                  height={20}
                  alt="Instagram"
                  className={styles.linkIcon}
                />
                <span className={styles.linkText}>Instagram</span>
              </span>
              <IconArrowRight className={styles.linkArrow} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
