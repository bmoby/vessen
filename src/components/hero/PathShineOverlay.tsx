"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

export default function PathShineOverlay() {
  const [pathData, setPathData] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Extract path data from SVGATOR animation.svg
  useEffect(() => {
    let isCancelled = false;
    fetch("/vectors/animation.svg")
      .then((r) =>
        r.ok ? r.text() : Promise.reject(new Error("Failed to load SVG"))
      )
      .then((text) => {
        if (!isCancelled) {
          console.log("SVG loaded successfully:", text.length, "characters");

          // Parse SVG and extract the main path
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(text, "image/svg+xml");
          const mainPath = svgDoc.querySelector('path[id="eDy3ORKlikG3"]');

          if (mainPath) {
            const pathD = mainPath.getAttribute("d");
            console.log("Extracted path data:", pathD ? "✓" : "✗");
            setPathData(pathD);
          } else {
            console.error("Main path not found in SVG");
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load SVG:", error);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Setup path animation when path data is available
  useEffect(() => {
    if (!pathData || !wrapperRef.current) return;

    const container = wrapperRef.current;
    const svgEl = container.querySelector("svg");
    const strokeEl = svgEl?.querySelector(
      'path[data-stroke="1"]'
    ) as SVGPathElement | null;
    // Cibler l'image pour le léger warm-up
    const photoEl = container.parentElement;
    const imgEl = photoEl?.querySelector(
      `.${styles.img}`
    ) as HTMLElement | null;

    if (!strokeEl) return;

    // Nettoyer toute animation existante
    strokeEl.style.animation = "none";
    let currentAnim: Animation | null = null;
    let timeoutId: NodeJS.Timeout;

    try {
      const length = strokeEl.getTotalLength();
      console.log("Path length:", length);

      // Style initial - TOUJOURS commencer masqué
      const baseWidth = 6;
      strokeEl.style.fill = "none";
      strokeEl.style.strokeWidth = String(baseWidth);
      strokeEl.style.strokeLinecap = "round";
      strokeEl.style.strokeLinejoin = "round";
      // Trait lumineux doré plus doux
      strokeEl.style.stroke = "#f0d99a";
      strokeEl.style.mixBlendMode = "screen";
      strokeEl.style.filter =
        "blur(0.8px) drop-shadow(0 0 12px rgba(240,217,154,0.65)) drop-shadow(0 0 24px rgba(240,217,154,0.45))";
      strokeEl.style.opacity = "0.75";

      // Préparer l'image pour un fondu progressif global (opacité)
      if (imgEl) {
        imgEl.style.opacity = "0";
        imgEl.style.transition = "opacity 400ms ease, filter 400ms ease";
      }

      // Préparer l'animation: segment lumineux
      const segment = Math.max(160, Math.min(520, length * 0.02));
      const travelInit = length + segment;
      strokeEl.style.strokeDasharray = `${segment} ${length}`;
      strokeEl.style.strokeDashoffset = String(travelInit);

      // Fonction pour démarrer l'animation
      const startAnimation = () => {
        // Annuler toute animation en cours puis redémarrer proprement avec WAAPI
        if (currentAnim) {
          currentAnim.cancel();
        }

        // Rendre le container visible pour l'animation
        container.style.display = "block";

        const travel = length + segment; // parcourir tout le path

        strokeEl.style.strokeDashoffset = String(travel);

        currentAnim = strokeEl.animate(
          [
            {
              strokeDashoffset: travel,
              strokeOpacity: 0.25,
              strokeWidth: baseWidth - 2,
            },
            {
              strokeDashoffset: travel * 0.75,
              strokeOpacity: 1,
              strokeWidth: baseWidth + 6,
            },
            {
              strokeDashoffset: travel * 0.5,
              strokeOpacity: 0.7,
              strokeWidth: baseWidth + 2,
            },
            {
              strokeDashoffset: travel * 0.25,
              strokeOpacity: 0.2,
              strokeWidth: baseWidth,
            },
            {
              strokeDashoffset: 0,
              strokeOpacity: 0,
              strokeWidth: baseWidth - 2,
            },
          ],
          {
            duration: 3200,
            easing: "ease-in-out",
            iterations: 1,
            fill: "forwards",
          }
        );
        // Fondu global de l'image via opacité (pas d'effet vertical)
        if (imgEl) {
          imgEl.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 3200,
            easing: "ease-in-out",
            fill: "forwards",
          });
        }
        if (currentAnim) {
          currentAnim.onfinish = () => {
            // masquer totalement après l'animation
            container.style.display = "none";
            strokeEl.style.strokeOpacity = "0";
            strokeEl.style.stroke = "transparent";
            strokeEl.style.filter = "";

            console.log("🔒 Animation terminée, container masqué");
          };
        }
      };

      // Démarrer l'animation après un délai fixe (remplace la dépendance à PageAssemble)
      const animationDelay = 1500; // délai en ms pour laisser le temps à la page de se charger
      console.log(`⏱️ Démarrage de l'animation dans ${animationDelay}ms`);

      timeoutId = setTimeout(() => {
        console.log("🚀 Démarrage de l'animation de brillance");
        startAnimation();
      }, animationDelay);
    } catch (e) {
      console.warn("Failed to setup path animation:", e);
    }

    // Nettoyage à la destruction du composant
    return () => {
      clearTimeout(timeoutId);
      if (strokeEl) {
        strokeEl.style.animation = "none";
        if (currentAnim) {
          currentAnim.cancel();
          currentAnim = null;
        }
      }
    };
  }, [pathData]);

  // Create SVG overlay: only the golden stroke, no background cover
  const svgMarkup = pathData
    ? `
    <svg viewBox="0 0 805 962" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <path data-stroke="1" d="${pathData}" fill="none" stroke="#f0d99a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" />
    </svg>
  `
    : null;

  return (
    <div
      ref={wrapperRef}
      className={styles.pathOverlay}
      aria-hidden="true"
      suppressHydrationWarning
      style={{ display: "none" }} // masqué par défaut
    >
      {svgMarkup ? (
        <div
          className={styles.svgContainer}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : null}
    </div>
  );
}
