export const WIDE = '@media only screen and (min-width: 1200px)';
export const DESKTOP = '@media only screen and (min-width: 993px)';
export const NON_MOBILE = '@media only screen and (min-width: 769px)';

export const MEDIUM = '@media only screen and (max-width: 1199px)';
export const LAPTOP = '@media only screen and (max-width: 992px)';
export const PHONE_LANDSCAPE = '@media only screen and (max-width: 812px)';
export const TABLET = '@media only screen and (max-width: 768px)';
export const PHONE = '@media only screen and (max-width: 480px)';
export const CUSTOM_BREAKPOINT = breakpoint =>
  `@media only screen and (max-width: ${breakpoint}px)`;

export const HOVER = '@media (hover: hover)';
