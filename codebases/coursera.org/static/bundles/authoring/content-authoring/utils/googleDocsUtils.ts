/*
  this contains utility functions for dealing with copy-paste via google docs, see `rules.ts` for usage.
*/

// google docs markup has a unique id `docs-internal-guid-{uuid}` to differentiate from other external content,
// if there's an ancestor node with that unique id we consider this as google docs content and handle accordingly.
export const isGoogleDocsContent = (el: HTMLElement | null): boolean =>
  el && el.closest ? !!el.closest('b[id^="docs-internal-guid"]') : false;

// parse style string for text formatting attributes - Safari maintains the space between the attribute key-value pairs.
export const isBold = (style: string): boolean =>
  style.includes('font-weight:700') || style.includes('font-weight: 700') || false;
export const isItalic = (style: string): boolean =>
  style.includes('font-style:italic') || style.includes('font-style: italic') || false;
export const isUnderline = (style: string): boolean =>
  style.includes('text-decoration:underline') || style.includes('text-decoration: underline') || false;
