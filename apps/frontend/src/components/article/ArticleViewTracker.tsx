"use client";

import { useEffect, useRef } from "react";
import { getApiUrl } from "@/lib/env";

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!articleId || sent.current) return;
    sent.current = true;
    const url = `${getApiUrl()}/articles/${articleId}/view`;
    fetch(url, { method: "POST", mode: "cors" }).catch(() => {});
  }, [articleId]);

  return null;
}
