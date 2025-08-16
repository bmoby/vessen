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
    const pathEl = svgEl?.querySelector("path");
    // Cibler l'image pour le fade-in
    const photoEl = container.parentElement;
    const imgEl = photoEl?.querySelector(
      `.${styles.img}`
    ) as HTMLElement | null;

    if (!pathEl) return;

    // Nettoyer toute animation existante
    pathEl.style.animation = "none";
    let currentAnim: Animation | null = null;
    let timeoutId: NodeJS.Timeout;

    try {
      const length = pathEl.getTotalLength();
      console.log("Path length:", length);

      // Style initial - TOUJOURS commencer masqué
      const baseWidth = 7;
      pathEl.style.fill = "none";
      pathEl.style.stroke = "transparent"; // transparent par défaut
      pathEl.style.strokeWidth = String(baseWidth);
      pathEl.style.strokeLinecap = "round";
      pathEl.style.strokeLinejoin = "round";
      pathEl.style.mixBlendMode = "screen"; // effet lumineux
      pathEl.style.filter = ""; // pas de filtre par défaut
      pathEl.style.strokeOpacity = "0"; // forcer invisible

      // Préparer l'image pour le fade-in rapide
      if (imgEl) {
        imgEl.style.opacity = "0";
        imgEl.style.transition = "opacity 400ms ease";
      }

      // Préparer l'animation: n'afficher qu'un petit segment qui se déplace
      const segment = Math.max(100, Math.min(360, length * 0.015));
      const travelInit = length + segment;
      pathEl.style.strokeDasharray = `${segment} ${length}`;
      pathEl.style.strokeDashoffset = String(travelInit);
      pathEl.style.setProperty("--path-length", String(length));

      // Fonction pour démarrer l'animation
      const startAnimation = () => {
        // Annuler toute animation en cours puis redémarrer proprement avec WAAPI
        if (currentAnim) {
          currentAnim.cancel();
        }

        // Rendre le container visible pour l'animation
        container.style.display = "block";

        // Déclencher le fade-in de l'image EN MÊME TEMPS
        if (imgEl) {
          imgEl.style.opacity = "1";
        }

        // Activer le stroke SEULEMENT pour l'animation
        pathEl.style.stroke = "#ffffff";
        pathEl.style.filter =
          "blur(1.5px) drop-shadow(0 0 24px rgba(255,255,255,0.98)) drop-shadow(0 0 48px rgba(255,255,255,0.9))";

        const travel = length + segment; // parcourir tout le path
        pathEl.style.strokeDashoffset = String(travel);
        currentAnim = pathEl.animate(
          [
            {
              strokeDashoffset: travel,
              strokeOpacity: 0.08,
              strokeWidth: baseWidth - 3,
            },
            {
              strokeDashoffset: travel * 0.75,
              strokeOpacity: 1,
              strokeWidth: baseWidth + 4,
            },
            {
              strokeDashoffset: travel * 0.5,
              strokeOpacity: 0.6,
              strokeWidth: baseWidth + 1,
            },
            {
              strokeDashoffset: travel * 0.25,
              strokeOpacity: 0.2,
              strokeWidth: baseWidth - 1,
            },
            {
              strokeDashoffset: 0,
              strokeOpacity: 0,
              strokeWidth: baseWidth - 3,
            },
          ],
          {
            duration: 2800,
            easing: "ease-out",
            iterations: 1,
            fill: "forwards",
          }
        );
        if (currentAnim) {
          currentAnim.onfinish = () => {
            // masquer totalement après l'animation
            container.style.display = "none";
            pathEl.style.strokeOpacity = "0";
            pathEl.style.stroke = "transparent";
            pathEl.style.filter = "";

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
      if (pathEl) {
        pathEl.style.animation = "none";
        if (currentAnim) {
          currentAnim.cancel();
          currentAnim = null;
        }
      }
    };
  }, [pathData]);

  // Create clean SVG with extracted path - animation élégante
  const svgMarkup = pathData
    ? `
    <svg viewBox="0 0 805 962" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathData}" fill="none" stroke="white" stroke-width="2" opacity="0.8" />
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
