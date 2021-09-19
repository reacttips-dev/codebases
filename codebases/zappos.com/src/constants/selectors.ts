export const TABBABLE_ELEMENTS_SELECTOR = `
  a:not([tabindex="-1"]),
  area[href]:not([tabindex="-1"]),
  input:not([disabled]):not([tabindex="-1"]),
  select:not([disabled]):not([tabindex="-1"]),
  textarea:not([disabled]):not([tabindex="-1"]),
  button:not([disabled]):not([tabindex="-1"]),
  iframe:not([tabindex="-1"]),
  [tabindex]:not([tabindex="-1"]),
  [contentEditable=true]:not([tabindex="-1"])`;
