import styles from "./strengths.module.css";

const strengths = [
  {
    title: "Sélection d'exception",
    text: "Des gemmes certifiées, sourcées avec exigence, qualité et traçabilité.",
  },
  {
    title: "Savoir‑faire sur‑mesure",
    text: "Conception et réalisation artisanales adaptées à vos envies.",
  },
  {
    title: "Accompagnement discret",
    text: "Un service attentif, confidentiel et durable pour chaque projet.",
  },
];

export default function Strengths() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        {strengths.map((item) => (
          <div key={item.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardText}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
