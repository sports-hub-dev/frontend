import React, { useEffect, useState, useCallback } from "react";
import { cn } from "../../utils/cn";

/**
 * Auto-advancing crossfade image carousel, used as the Home hero background.
 * Pass an array of image URLs via the `images` prop — add your own links there.
 */
const HeroCarousel = ({ images, intervalMs = 6000, className }) => {
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index) => {
      setActive((index + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  return (
    <div className={cn("absolute inset-0", className)}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            i === active ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-amber" : "w-2 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;