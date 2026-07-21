import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Keeps a `page` value in sync with the ?page= URL search param so
 * listing pages are shareable and back/forward-button friendly.
 */
export const usePagination = (defaultLimit = 12) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [limit] = useState(defaultLimit);

  const setPage = useCallback(
    (nextPage) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", nextPage);
      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  return { page, limit, setPage };
};
