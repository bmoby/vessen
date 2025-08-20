"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./offersPreview.module.css";
import modal from "./offersModal.module.css";
import SmartImage from "../shared/SmartImage";

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
  const [modalImageReady, setModalImageReady] = useState<boolean>(true); // Start ready
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const selected = useMemo(
    () => (selectedIndex != null ? products[selectedIndex] : null),
    [selectedIndex, products]
  );

  useEffect(() => {
    if (typeof document !== "undefined") setPortalRoot(document.body);
  }, []);

  const closeDirect = useCallback(() => setSelectedIndex(null), []);

  // Open with history integration for natural back-close
  const openModal = useCallback(async (idx: number) => {
    setSelectedIndex(idx);
    if (typeof window !== "undefined") {
      window.history.pushState({ modal: true }, "", window.location.href);
    }
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setModalImageReady(true);
    }
  }, []);

  const close = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.modal) {
      window.history.back();
    } else {
      closeDirect();
    }
  }, [closeDirect]);

  useEffect(() => {
    if (selectedIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPop = () => {
      closeDirect();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedIndex, close, closeDirect]);

  useEffect(() => {
    if (selectedIndex == null) return;
    let raf = 0;
    const SAFE_TOP = 72;
    const SAFE_BOTTOM = 48;
    const recompute = () => {
      const viewportH = window.innerHeight;
      const availableH = viewportH - SAFE_TOP - SAFE_BOTTOM;
      const detailsH = detailsRef.current?.offsetHeight ?? 0;
      const chrome = 24;
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

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (typeof window === "undefined" || window.innerWidth > 768) return;
    const atTop = (contentRef.current?.scrollTop ?? 0) <= 0;
    if (!atTop) return;
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (typeof window === "undefined" || window.innerWidth > 768) return;
      if (touchStartYRef.current == null) return;
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartYRef.current;
      touchStartYRef.current = null;
      if (deltaY > 80) close();
    },
    [close]
  );

  const modalNode = selected ? (
    <div className={modal.overlay} onClick={close}>
      <div
        className={modal.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={selected.title}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "auto" }}
        ref={dialogRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button className={modal.close} onClick={close} aria-label="Close">
          ×
        </button>
        <div className={modal.content} ref={contentRef}>
          <div className={modal.mediaWrap}>
            {selected.imageUrl ? (
              <div
                style={{
                  position: "relative",
                  opacity: modalImageReady ? 1 : 0,
                  transition: "opacity 180ms ease-out",
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
              </div>
            ) : null}
          </div>
          <div
            className={modal.details}
            ref={detailsRef}
            style={{
              opacity: modalImageReady ? 1 : 0,
              transition: "opacity 180ms ease-out",
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
  ) : null;

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

      {portalRoot && modalNode ? createPortal(modalNode, portalRoot) : null}
    </>
  );
}
