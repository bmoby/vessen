import styles from "./strengths.module.css";

type Strength = {
  title: string;
  subtitle: string;
  description: string;
};

const strengths: Strength[] = [
  {
    title: "Ваш бренд — наши ресурсы",
    subtitle: "От выпуска под брендом до поштучной замены элементов коллекций",
    description:
      "Производим под вашим брендом, кастомизируем серии и при необходимости поставляем точную замену поштучно, чтобы сохранить ваш имидж и укреплять лояльность клиентов.",
  },
  {
    title: "Доверие 500+ партнёров",
    subtitle: "B2B-сеть, которая растёт каждый месяц",
    description:
      "Мы обеспечиваем стабильные поставки и контроль качества — вы удерживаете маржу. Чёткие сроки, надёжная упаковка, прозрачные условия.",
  },
  {
    title: "Начать с нами просто",
    subtitle: "Личный менеджер, от подбора до первого заказа",
    description:
      "Встречаемся у вас или у нас, показываем образцы, фиксируем спецификации. Пока идёт проверка, готовим договор, визуалы и логистику, вы движетесь по понятному плану.",
  },
];

export default function Strengths() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Почему выбирают VESSEN</h2>
          <p className={styles.subtitle}>
            Надёжное партнёрство для роста вашего бизнеса
          </p>
        </header>

        <div className={styles.grid}>
          {strengths.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSubtitle}>{item.subtitle}</p>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
