import styles from "./brandStory.module.css";

export default function BrandStory() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.overline}>VESSEN</span>
          <h2 className={styles.title}>О бренде VESSEN</h2>
        </header>
        <div className={styles.content}>
          <div className={styles.prose}>
            <p className={styles.lede}>
              Бренд VESSEN создан в 2019 году — из любви к красивой сервировке и
              искреннего желания сделать повседневную кухню эстетичной и
              вдохновляющей.
            </p>

            <div className={styles.ornament}></div>

            <p className={styles.display}>
              В переводе с эльфийского языка VESSEN означает «душа хозяйки»
            </p>

            <p>
              Отражая тепло, заботу и вдохновение, которые мы вкладываем в
              каждое изделие. Изначально мы создавали коллекции керамических и
              фарфоровых столовых сервизов. Каждый набор был продуман до
              мелочей: от плавных линий тарелок до благородных оттенков глазури.
            </p>
            <p>
              Эти сервизы находили своё место и в уютных семейных домах, и на
              торжественных столах. Со временем мы расширили границы. В
              ассортимент вошли чугунные, эмалированные и нержавеющие кастрюли,
              сочетающие в себе прочность, функциональность и утончённый дизайн.
            </p>
            <p>
              Следующим шагом стало вдохновляющее разнообразие: мы добавили
              декор для дома, изящную посуду из нержавеющей стали и множество
              аксессуаров, которые помогают создавать атмосферу уюта и гармонии.
            </p>
            <blockquote className={styles.pull}>
              VESSEN — больше, чем посуда. Это стиль жизни, в котором красота и
              практичность идут рука об руку.
            </blockquote>
            <p>
              Сегодня VESSEN — это средний ценовой сегмент, где доступность
              сочетается с высоким качеством и эстетикой. Каждое изделие мы
              создаём так, чтобы оно радовало глаз, было надёжным в
              использовании и становилось частью вашей особенной истории.
            </p>
            <p className={styles.inlineList}>
              В ассортимент бренда входят: <span>Столовые сервизы</span>
              <span className={styles.sep}>•</span>
              <span>Бытовая техника</span>
              <span className={styles.sep}>•</span>
              <span>Посуда для приготовления</span>
              <span className={styles.sep}>•</span>
              <span>Стеклянные изделия</span>
              <span className={styles.sep}>•</span>
              <span>Столовые приборы</span>
              <span className={styles.sep}>•</span>
              <span>Предметы для сервировки</span>
              <span className={styles.sep}>•</span>
              <span>Декор для дома</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
