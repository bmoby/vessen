"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css";

type HeaderProps = {
  variant?: "default" | "over-hero";
};

export default function Header({ variant = "default" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "over-hero") return;

    const handleScroll = () => {
      // Détecter si on a dépassé le Hero (environ 600px)
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const headerVariant =
    variant === "over-hero" && !isScrolled ? "over-hero" : "default";

  return (
    <header className={styles.header} data-variant={headerVariant}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <svg
            width="74.59259"
            height="9.750885"
            viewBox="0 0 74.59259 9.750885"
            className={styles.logo}
            aria-label="Logo VESSEN"
          >
            <path
              d="m 4.7453204,9.2549817 c 0.254277,0.287232 0.568887,0.452403 0.942407,0.4959 0.37938,-0.0435 0.69339,-0.205987 0.94248,-0.487786 0.1681,-0.189406 0.3955,-0.568889 0.68291,-1.137391 L 11.376027,0.01640172 H 9.7508074 l -3.65668,7.29667998 c -0.15712,0.30861 -0.29002,0.463303 -0.39832,0.463303 -0.10809,0 -0.2407,-0.154693 -0.398,-0.463303 L 1.6084204,0.01640172 H 3.8281541e-7 L 4.0626304,8.1257047 c 0.28169,0.552309 0.50937,0.929288 0.68269,1.129277 z M 46.592207,8.1254937 h -1.10501 -7.5734 l 0.0162,1.60909 h 5.68819 2.84388 c 1.89611,0 2.8441,-0.812483 2.8441,-2.437695 l -0.0162,-0.828781 v -0.795725 -1.609478 -1.06e-4 h -9.7462 l 0.004,-1.226997 c 0.005,-0.817598 0.36562,-1.226714 1.08081,-1.226714 h 1.10521 7.57298 L 49.290567,-2.2782687e-6 h -5.68819 -2.84392 c -1.8959,0 -2.84409,0.8127999982687 -2.84409,2.4376939782687 l 0.0162,0.828816 v 0.796291 1.608914 6.7e-4 h 9.73469 v 1.218106 c 0,0.823419 -0.3575,1.235005 -1.07251,1.235005 z m -12.64349,0 h -1.10511 -7.57329 l 0.0164,1.60909 h 5.68798 2.84413 c 1.89569,0 2.84367,-0.812483 2.84367,-2.437695 l -0.0158,-0.828781 v -0.795725 -1.609478 -1.06e-4 h -9.74679 l 0.004,-1.226997 c 0.006,-0.817598 0.3658,-1.226714 1.08113,-1.226714 h 1.10507 7.5728 L 36.647107,-2.2782687e-6 h -5.68798 -2.84452 c -1.8959,0 -2.84388,0.8127999982687 -2.84388,2.4376939782687 l 0.0164,0.828816 v 0.796291 1.608914 6.7e-4 h 9.73438 v 1.218106 c 0,0.823419 -0.35758,1.235005 -1.07238,1.235005 z m 30.87698,-5.118912 7.21572,5.850114 c 0.59581,0.563492 1.0723,0.85591 1.4296,0.877994 h 0.30878 c 0.54212,0 0.8128,-0.324909 0.8128,-0.974902 V 6.4517037 0.01661372 h -1.625 l -0.0164,6.76006898 -7.41038,-6.24028598 c -0.4553,-0.325015 -0.8236,-0.498299 -1.10529,-0.519783 h -0.42242 c -0.54169,0 -0.81301,0.324873 -0.81301,0.974866 v 2.30773098 6.435479 h 1.6256 z m -2.8926,5.118912 h -11.35958 v 1.625388 h 11.35958 z M 61.949497,-2.2782687e-6 H 50.573507 V 1.6251037 h 11.37599 z M 61.933097,4.0629047 h -11.35958 v 1.625282 h 11.35958 z m -37.9301,4.062589 h -11.35958 v 1.625388 h 11.35958 z m 0,-4.062589 h -11.35958 v 1.625282 h 11.35958 z m 0.0161,-4.0629069782687 h -11.3757 V 1.6251037 h 11.3757 z"
              fill="currentColor"
            />
          </svg>
        </Link>

        <button
          className={styles.menuToggle}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          data-open={isMenuOpen ? "true" : "false"}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className={styles.burger} />
        </button>

        <nav
          id="primary-nav"
          className={styles.nav}
          aria-label="Primary"
          data-open={isMenuOpen ? "true" : "false"}
          onClick={() => setIsMenuOpen(false)}
        >
          <Link href="/">Главная</Link>
          <Link href="/products">Прайслист</Link>
          <Link href="/blog">Акции</Link>
          <Link href="/contact">Контакт</Link>
        </nav>
      </div>
    </header>
  );
}
