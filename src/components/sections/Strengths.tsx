import styles from "./strengths.module.css";

type Strength = {
  title: string;
  subtitle: string;
  description: string;
};

const strengths: Strength[] = [
  {
    title: "Sélection d'exception",
    subtitle: "Gemmes certifiées et traçables",
    description:
      "Des gemmes sélectionnées avec exigence auprès de partenaires de confiance. Certification, traçabilité et contrôle qualité rigoureux pour des pièces irréprochables.",
  },
  {
    title: "Savoir‑faire sur‑mesure",
    subtitle: "Exigence artisanale et finitions précieuses",
    description:
      "Chaque création est pensée dans le détail. Conception personnalisée, matériaux nobles et finitions durables pour sublimer vos projets d'exception.",
  },
  {
    title: "Accompagnement discret",
    subtitle: "Un service attentif et durable",
    description:
      "Conseil dédié, suivi transparent et confidentialité. Nous vous accompagnons de la sélection à la livraison pour une expérience sereine et haut de gamme.",
  },
];

export default function Strengths() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        {strengths.map((item) => (
          <article key={item.title} className={styles.block}>
            <header className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>{item.title}</h2>
              <p className={styles.blockSubtitle}>{item.subtitle}</p>
            </header>
            <div className={styles.blockBody}>{item.description}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
