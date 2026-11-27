"use client";

import { useEffect, useState } from "react";

/** Renders a UTC instant in the viewer's own timezone (server render falls back to UTC). */
export function LocalTime({ iso, withZone = true }: { iso: string; withZone?: boolean }) {
  const [tz, setTz] = useState<string | undefined>(undefined);
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone), []);
  const text = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: tz ?? "UTC" }).format(new Date(iso));
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
      {withZone && <span className="font-normal text-muted"> ({(tz ?? "UTC").replace(/_/g, " ")})</span>}
    </time>
  );
}
