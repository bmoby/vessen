import styles from "./spinner.module.css";

export default function Spinner() {
  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.spinner} />
      <span className={styles.label}>Chargement…</span>
    </div>
  );
}
