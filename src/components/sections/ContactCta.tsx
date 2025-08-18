import Link from "next/link";
import styles from "./contactCta.module.css";
import { ArrowRight, Mail, MessageCircle, Send, Instagram } from "lucide-react";

export default function ContactCta() {
  return (
    <section className={styles.section} aria-labelledby="contact-cta-title">
      <div className={styles.container}>
        <div className={styles.copy}>
          <h2 id="contact-cta-title" className={styles.title}>
            Свяжитесь с нами
          </h2>
          <p className={styles.subtitle}>
            Мы оперативно ответим и поможем подобрать нужное. Выберите удобный
            канал связи.
          </p>
        </div>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link href="mailto:vessenware@gmail.com" className={styles.link}>
              <span className={styles.linkLeft}>
                <Mail size={22} className={styles.linkIcon} />
                <span className={styles.linkText}>vessenware@gmail.com</span>
              </span>
              <ArrowRight size={18} className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://wa.me/79380203131"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <MessageCircle size={22} className={styles.linkIcon} />
                <span className={styles.linkText}>WhatsApp</span>
              </span>
              <ArrowRight size={18} className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://t.me/+79380203131"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <Send size={22} className={styles.linkIcon} />
                <span className={styles.linkText}>Telegram</span>
              </span>
              <ArrowRight size={18} className={styles.linkArrow} />
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              href="https://www.instagram.com/vessen__official"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLeft}>
                <Instagram size={22} className={styles.linkIcon} />
                <span className={styles.linkText}>Instagram</span>
              </span>
              <ArrowRight size={18} className={styles.linkArrow} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
