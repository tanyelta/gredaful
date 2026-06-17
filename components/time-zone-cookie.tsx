"use client";

import { useEffect } from "react";

const COOKIE_NAME = "gredaful-time-zone";

export function TimeZoneCookie() {
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timeZone) {
      return;
    }

    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(timeZone)}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return null;
}
