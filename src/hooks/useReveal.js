import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal — adds a fade-up animation the first time an
 * element enters the viewport. Used sparingly for section-level reveals,
 * never on every individual card (keeps the motion feeling orchestrated
 * rather than scattered).
 */
export const useReveal = (options = { threshold: 0.15 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
};
