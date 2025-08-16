import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>VESSEN</div>
        <div className={styles.meta}>
          © {new Date().getFullYear()} VESSEN. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
