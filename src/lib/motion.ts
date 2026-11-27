import type { CSSProperties } from "react";

/** Inline style for a staggered reveal / entrance delay (used with data-reveal and animate-rise). */
export const delay = (ms: number) => ({ "--d": `${ms}ms`, animationDelay: `${ms}ms` }) as CSSProperties;
