"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./offersPreview.module.css";
import modal from "./offersModal.module.css";
import SmartImage from "../shared/SmartImage";
import { fetchBlobWithCache } from "@/helpers/blobCache";

export type Product = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountPercent?: number;
};

type OffersGridClientProps = {
  products: Product[];
};

export default function OffersGridClient({ products }: OffersGridClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [imageMaxHeight, setImageMaxHeight] = useState<number | null>(null);
  const [modalImageReady, setModalImageReady] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const selected = useMemo(
    () => (selectedIndex != null ? products[selectedIndex] : null),
    [selectedIndex, products]
  );

  const close = useCallback(() => setSelectedIndex(null), []);

  // Navigation between products inside the modal is disabled by design

  const openModal = useCallback(async (idx: number) => {
    // No need to prefetch - the image is already loaded in the grid
    // Just open the modal immediately
    setSelectedIndex(idx);
  }, []);

  useEffect(() => {
    if (selectedIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Optional: lock scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedIndex, close]);

  // Recompute a safe max height for the image, so the dialog never touches header/footer
  useEffect(() => {
    if (selectedIndex == null) return;
    let raf = 0;
    const SAFE_TOP = 72; // match overlay padding top baseline
    const SAFE_BOTTOM = 48; // match overlay padding bottom baseline
    const recompute = () => {
      const viewportH = window.innerHeight;
      const availableH = viewportH - SAFE_TOP - SAFE_BOTTOM;
      const detailsH = detailsRef.current?.offsetHeight ?? 0;
      const chrome = 24; // borders/margins buffer
      const maxH = Math.max(160, availableH - detailsH - chrome);
      setImageMaxHeight(maxH);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(recompute);
    };
    schedule();
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, [selectedIndex]);

  // Check if modal image is already loaded from grid
  useEffect(() => {
    if (selectedIndex != null && selected?.imageUrl) {
      const isAlreadyLoaded = loadedImages.has(selected.imageUrl);
      setModalImageReady(isAlreadyLoaded);
    }
  }, [selectedIndex, selected?.imageUrl, loadedImages]);

  return (
    <>
      <div className={styles.grid}>
        {products.map((product, idx) => (
          <article
            key={`${product.title}-${idx}`}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => openModal(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openModal(idx);
            }}
          >
            {product.imageUrl && (
              <div className={styles.media}>
                <SmartImage
                  src={product.imageUrl}
                  alt={product.title}
                  className={styles.cover}
                  critical
                  onLoad={() => {
                    if (product.imageUrl) {
                      setLoadedImages((prev) =>
                        new Set(prev).add(product.imageUrl!)
                      );
                    }
                  }}
                />
                <span className={styles.mediaGlow} />
                {product.discountPercent && product.discountPercent > 0 && (
                  <div className={styles.badge}>
                    −{product.discountPercent}%
                  </div>
                )}
              </div>
            )}
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{product.title}</h3>
              {product.subtitle && (
                <p className={styles.cardSubtitle}>{product.subtitle}</p>
              )}
              {product.description && (
                <p className={styles.cardDescription}>{product.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className={modal.overlay} onClick={close}>
          <div
            className={modal.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "auto" }}
          >
            <button className={modal.close} onClick={close} aria-label="Close">
              ×
            </button>
            <div className={modal.content}>
              <div className={modal.mediaWrap}>
                {selected.imageUrl ? (
                  <div
                    style={{
                      position: "relative",
                      opacity: modalImageReady ? 1 : 0,
                      transition: "opacity 220ms ease",
                    }}
                  >
                    <SmartImage
                      src={selected.imageUrl}
                      alt={selected.title}
                      className={`${modal.media}${
                        imageMaxHeight ? ` max-h-[${imageMaxHeight}px]` : ""
                      }`}
                      loading="eager"
                      critical
                      onLoad={() => setModalImageReady(true)}
                    />
                    {!modalImageReady && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(0,0,0,0.1)",
                        }}
                      >
                        {/* Lightweight inline spinner */}
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            border: "3px solid rgba(255,255,255,0.6)",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div
                className={modal.details}
                ref={detailsRef}
                style={{
                  opacity: modalImageReady ? 1 : 0,
                  transition: "opacity 220ms ease",
                }}
              >
                <h3 className={modal.title}>{selected.title}</h3>
                {selected.subtitle ? (
                  <p className={modal.subtitle}>{selected.subtitle}</p>
                ) : null}
                {selected.description ? (
                  <p className={modal.description}>{selected.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
