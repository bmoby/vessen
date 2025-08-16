import styles from "./strengths.module.css";
import { IconLaurel, IconPlate, IconShield } from "@/components/shared/Icons";

type Strength = {
  title: string;
  subtitle: string;
  description: string;
};

const strengths: Strength[] = [
  {
    title: "Надёжный ассортимент",
    subtitle: "Сертифицированная продукция и проверенные поставки",
    description:
      "Тщательно отобранные позиции у надёжных партнёров. Сертификация, прослеживаемость и строгий контроль качества для стабильного результата.",
  },
  {
    title: "Гибкие решения",
    subtitle: "Под задачи вашего бизнеса",
    description:
      "Подбираем позиции под ваши требования: материалы, объёмы, сроки. Оптимальные условия и долгосрочный подход к сотрудничеству.",
  },
  {
    title: "Поддержка и сервис",
    subtitle: "Прозрачно и своевременно",
    description:
      "Личный менеджер, оперативная коммуникация и аккуратная логистика. От запроса до отгрузки — всё предсказуемо и без лишних хлопот.",
  },
];

export default function Strengths() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        {strengths.map((item, idx) => (
          <article key={item.title} className={styles.block}>
            <header className={styles.blockHeader}>
              {idx === 0 && (
                <IconLaurel size={32} className={styles.blockIcon} />
              )}
              {idx === 1 && (
                <IconPlate size={32} className={styles.blockIcon} />
              )}
              {idx === 2 && (
                <IconShield size={32} className={styles.blockIcon} />
              )}
              <div>
                <h2 className={styles.blockTitle}>{item.title}</h2>
                <p className={styles.blockSubtitle}>{item.subtitle}</p>
              </div>
            </header>
            <div className={styles.blockBody}>{item.description}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
