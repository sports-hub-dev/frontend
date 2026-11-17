import React, { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile check. Waits for the Turnstile script to finish loading
 * (it loads async, so it may not exist on first render) and never crashes the
 * page if the site key is missing or Cloudflare rejects the current domain.
 */
const TurnstileWidget = ({ onVerify, onExpire }) => {
  const ref = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    const sitekey = process.env.REACT_APP_TURNSTILE_SITE_KEY;
    if (!sitekey) {
      // eslint-disable-next-line no-console
      console.warn("Turnstile: REACT_APP_TURNSTILE_SITE_KEY is not set for this environment.");
      return undefined;
    }

    let cancelled = false;
    let tries = 0;
    let timer;

    const render = () => {
      if (cancelled || !ref.current) return;
      if (!window.turnstile) {
        if (tries++ < 50) timer = setTimeout(render, 200); // wait up to ~10s for the script
        return;
      }
      try {
        widgetRef.current = window.turnstile.render(ref.current, {
          sitekey,
          callback: onVerify,
          "expired-callback": onExpire,
          theme: "light",
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Turnstile failed to render:", err);
      }
    };
    render();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (widgetRef.current !== undefined && window.turnstile) {
        try {
          window.turnstile.remove(widgetRef.current);
        } catch (err) {
          // widget already gone
        }
      }
    };
  }, [onVerify, onExpire]);

  return <div ref={ref} />;
};

export default TurnstileWidget;
