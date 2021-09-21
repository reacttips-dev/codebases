import { css } from "@emotion/core"

export const visuallyHiddenCss = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute !important;
  width: 1px;
`
