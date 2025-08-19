"use client";

import styles from "./contactContent.module.css";

export type Location = {
  city: string;
  address: string;
  phone: string;
  mapUrl?: string;
};

function normalizeRuPhone(raw: string): string {
  const only = raw.replace(/[^0-9+]/g, "");
  if (only.startsWith("+7")) return `+7${only.replace(/[^0-9]/g, "").slice(1)}`;
  if (only.startsWith("8")) return `+7${only.slice(1)}`;
  if (only.startsWith("7")) return `+${only}`;
  if (only.startsWith("+")) return only;
  return only.length === 11 && only.startsWith("8")
    ? `+7${only.slice(1)}`
    : `+7${only.replace(/^0+/, "")}`;
}

function formatRuPhoneForDisplay(raw: string): string {
  const e164 = normalizeRuPhone(raw).replace(/[^0-9+]/g, "");
  const m = e164.match(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (!m) return e164;
  return `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}`;
}

function buildTelHref(raw: string): string {
  return `tel:${normalizeRuPhone(raw)}`;
}

function buildFallbackMapUrl(address: string): string {
  return `https://yandex.com/maps/?text=${encodeURIComponent(address)}`;
}

const DEFAULT_LOCATIONS: Location[] = [
  {
    city: "Грозный",
    address: "Город Грозный, Петропавловское шоссе 2а",
    phone: "89380203131",
    mapUrl:
      "https://yandex.com/maps/1106/grozniy/house/petropavlovskoye_shosse_2a/YEwYcQdgT0YGQFppfX91cH1lYw==/?ll=45.700632%2C43.341168&z=17",
  },
  {
    city: "Хасавюрт",
    address: "Город Хасавюрт, улица Батырмурзаева 3",
    phone: "89380203030",
    mapUrl:
      "https://yandex.com/maps/11011/khasavurt/?ll=46.579634%2C43.256535&mode=whatshere&si=zxwuexnk251ccrf07h0k200mur&utm_source=share&whatshere%5Bpoint%5D=46.579372%2C43.256590&whatshere%5Bzoom%5D=17&z=19.2",
  },
  {
    city: "Махачкала",
    address: "Город Махачкала, проспект Имама Шамиля 13в",
    phone: "+7 928 529-31-31",
    mapUrl:
      "https://yandex.com/maps/28/makhachkala/house/prospekt_imama_shamilya_13v/YE4Ycg9gQUUCQFpofXV2dnljYg==/?ll=47.480805%2C42.977507&z=17",
  },
];

export default function ContactContent({
  locations = DEFAULT_LOCATIONS,
}: {
  locations?: Location[];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Контакты и пункты отгрузки</h1>
          <p className={styles.subtitle}>
            У нас 3 пункта отгрузки для оптовых заказов. Выберите удобный адрес,
            позвоните или откройте карту для навигации.
          </p>
        </header>

        <ul className={styles.list}>
          {locations.map((loc) => (
            <li key={loc.address} className={styles.row}>
              <div className={styles.rowPrimary}>
                <h3 className={styles.city}>{loc.city}</h3>
                <span className={styles.separator}>—</span>
                <p className={styles.address}>{loc.address}</p>
              </div>
              <div className={styles.actions}>
                <a
                  className={styles.phone}
                  href={buildTelHref(loc.phone)}
                  aria-label={`Позвонить: ${formatRuPhoneForDisplay(
                    loc.phone
                  )}`}
                >
                  <span className={styles.phoneIcon}>☎</span>{" "}
                  {formatRuPhoneForDisplay(loc.phone)}
                </a>
                <a
                  className={styles.mapLink}
                  href={loc.mapUrl || buildFallbackMapUrl(loc.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть в Яндекс.Картах
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
