import React, { useEffect, useRef } from "react";

const TurnstileWidget = ({ onVerify, onExpire }) => {
  const ref       = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!window.turnstile || !ref.current) return;
    widgetRef.current = window.turnstile.render(ref.current, {
      sitekey:           process.env.REACT_APP_TURNSTILE_SITE_KEY,
      callback:          onVerify,
      "expired-callback": onExpire,
      theme:             "light",
    });
    return () => {
      if (widgetRef.current !== undefined) {
        window.turnstile.remove(widgetRef.current);
      }
    };
  }, [onVerify, onExpire]);

  return <div ref={ref} />;
};

export default TurnstileWidget;