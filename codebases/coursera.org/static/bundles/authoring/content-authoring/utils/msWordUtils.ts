/*
  this contains utility functions for dealing with copy-paste via MS Word, see `rules.ts` for usage.
*/

// MS Word markup either has `OutlineElement` or `TextRun` parent classes to differentiate from other external content,
// if there's an ancestor node with that unique id we consider this as MS Word content and handle accordingly.
export const isMsWordContent = (el: HTMLElement | null): boolean =>
  el && el.closest ? !!el.closest('div[class^="OutlineElement"]') || !!el.closest('span[class^="TextRun"]') : false;

// parse style string for text formatting attributes
export const isBold = (style: string): boolean =>
  style.includes('font-weight: 700') ||
  style.includes('font-weight: bold') ||
  style.includes('font-weight:bold') ||
  false;
export const isItalic = (style: string): boolean =>
  style.includes('font-style: italic') || style.includes('font-style:italic') || false;
export const isUnderline = (style: string): boolean =>
  style.includes('text-decoration: underline') || style.includes('text-decoration:underline') || false;
