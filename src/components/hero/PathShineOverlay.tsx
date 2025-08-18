"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

export default function PathShineOverlay() {
  const [pathData, setPathData] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Extract path data from SVGATOR animation.svg
  useEffect(() => {
    let isCancelled = false;
    console.log("🔄 Loading SVG animation data...");

    fetch("/vectors/animation.svg")
      .then((r) => {
        console.log("📡 SVG fetch response:", r.status, r.ok);
        return r.ok
          ? r.text()
          : Promise.reject(new Error(`Failed to load SVG: ${r.status}`));
      })
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
            // Fallback: try to find any path
            const anyPath = svgDoc.querySelector("path");
            if (anyPath) {
              const pathD = anyPath.getAttribute("d");
              console.log("Using fallback path:", pathD ? "✓" : "✗");
              setPathData(pathD);
            }
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

  // Wait for page to be fully loaded and visible before starting animation
  useEffect(() => {
    if (!wrapperRef.current) return;

    let isCancelled = false;

    // Function to check if page is ready
    const checkPageReady = () => {
      if (isCancelled) return;

      // Check if page is fully loaded
      if (document.readyState === "complete") {
        // Additional check: wait for images to be loaded
        const images = document.querySelectorAll("img[data-critical]");
        if (images.length === 0) {
          // No critical images, wait only for IntroOverlay
          waitForIntroOverlay();
          return;
        }

        // Wait for all critical images to load
        const imagePromises = Array.from(images).map((img) => {
          const imgElement = img as HTMLImageElement;
          if (imgElement.complete && imgElement.naturalWidth > 0) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            imgElement.addEventListener("load", () => resolve(), {
              once: true,
            });
            imgElement.addEventListener("error", () => resolve(), {
              once: true,
            });
          });
        });

        Promise.all(imagePromises).then(() => {
          if (!isCancelled) {
            console.log("🎯 Page fully loaded, waiting for IntroOverlay...");
            waitForIntroOverlay();
          }
        });
      } else {
        // Page not ready yet, check again in 100ms
        setTimeout(checkPageReady, 100);
      }
    };

    // Function to wait for IntroOverlay animation to finish
    const waitForIntroOverlay = () => {
      console.log("🔍 Looking for IntroOverlay element...");

      // Find the IntroOverlay element
      const findIntroOverlay = () => {
        const introOverlay = document.querySelector("[data-intro-overlay]");
        if (introOverlay) {
          console.log("✅ IntroOverlay found, waiting for it to disappear...");

          // Create a MutationObserver to watch for IntroOverlay class changes
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
              ) {
                const target = mutation.target as Element;
                if (
                  target === introOverlay &&
                  target.classList.contains("fadeOut")
                ) {
                  console.log(
                    "🎬 IntroOverlay started fading, starting Hero animation!"
                  );
                  observer.disconnect();
                  if (!isCancelled) {
                    setHasStarted(true);
                  }
                }
              }
            });
          });

          observer.observe(introOverlay, {
            attributes: true,
            attributeFilter: ["class"],
          });

          // Fallback: if IntroOverlay is still there after 5s, start anyway
          setTimeout(() => {
            if (introOverlay.isConnected) {
              console.log(
                "⏰ Fallback: IntroOverlay still visible after 5s, starting anyway"
              );
              observer.disconnect();
              if (!isCancelled) {
                setHasStarted(true);
              }
            }
          }, 5000);
        } else {
          // IntroOverlay not found, check again in 100ms
          setTimeout(findIntroOverlay, 100);
        }
      };

      findIntroOverlay();
    };

    // Start checking
    checkPageReady();

    // Fallback: if something goes wrong, start after 8 seconds max
    const fallbackTimer = setTimeout(() => {
      if (!isCancelled && !hasStarted) {
        console.log("⏰ Fallback: starting animation after 8s timeout");
        setHasStarted(true);
      }
    }, 1200);

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [hasStarted]);

  // Setup path animation when path data is available and component is ready
  useEffect(() => {
    console.log("🎬 Animation effect triggered:", {
      pathData: !!pathData,
      wrapperRef: !!wrapperRef.current,
      hasStarted,
    });

    if (!pathData || !wrapperRef.current || !hasStarted) {
      console.log("❌ Animation blocked:", {
        pathData: !!pathData,
        wrapperRef: !!wrapperRef.current,
        hasStarted,
      });
      return;
    }

    const container = wrapperRef.current;
    const svgEl = container.querySelector("svg");
    const strokeEl = svgEl?.querySelector(
      'path[data-stroke="1"]'
    ) as SVGPathElement | null;

    console.log("🔍 Elements found:", { svgEl: !!svgEl, strokeEl: !!strokeEl });

    // Cibler l'image pour le léger warm-up
    const photoEl = container.parentElement;
    const imgEl = photoEl?.querySelector(
      `.${styles.img}`
    ) as HTMLElement | null;

    if (!strokeEl) {
      console.error("❌ Stroke element not found");
      return;
    }

    // Animation started
    console.log("🚀 Animation started");

    // Nettoyer toute animation existante
    strokeEl.style.animation = "none";
    let currentAnim: Animation | null = null;

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

      // Démarrer l'animation immédiatement quand la section est visible
      console.log("🚀 Démarrage de l'animation de brillance - section visible");
      startAnimation();
    } catch (e) {
      console.warn("Failed to setup path animation:", e);
    }

    // Nettoyage à la destruction du composant
    return () => {
      if (strokeEl) {
        strokeEl.style.animation = "none";
        if (currentAnim) {
          currentAnim.cancel();
          currentAnim = null;
        }
      }
    };
  }, [pathData, hasStarted]);

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
