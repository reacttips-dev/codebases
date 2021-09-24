export const FONT_FAMILY = 'Open Sans, Helvetica Neue, Helvetica, Arial, sans';

export const WEIGHT = {
  ULTRA_THIN: '100',
  THIN: '200',
  LITE: '300',
  NORMAL: '400',
  DARK: '500',
  BOLD: '600',
  ULTRA_BOLD: '700',
  BLACK: '800',
  ULTRA_BLACK: '900'
};

export const BASE_TEXT = {
  fontFamily: FONT_FAMILY,
  fontWeight: WEIGHT.NORMAL,
  fontSize: 13,
  lineHeight: 1.7,
  letterSpacing: 'normal',
  WebkitFontSmoothing: 'antialiased'
};

export const TITLE_TEXT = {
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  fontSize: 15
};
