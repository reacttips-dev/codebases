import { Theme } from '@core/theme';
import { Typography, TypographyStyle } from '@core/types';

const isLeftToRight = (theme: Theme): boolean => theme.direction === 'ltr';

const fontFamily = (theme: Theme): React.CSSProperties['fontFamily'] => {
  if (isLeftToRight(theme)) {
    return ['"Source Sans Pro"', 'Arial', 'sans-serif'].join(', ');
  }

  return ['Boutros Coursera', 'Tahoma', 'sans-serif'].join(', ');
};

type FontWeightType = 'regular' | 'semibold' | 'bold';

const fontWeight = (
  theme: Theme,
  type: FontWeightType = 'regular'
): React.CSSProperties['fontWeight'] => {
  switch (type) {
    case 'regular':
      return 400;
    case 'semibold':
      return isLeftToRight(theme) ? 600 : 700;
    case 'bold':
      return 700;
  }
};

const letterSpacing = (theme: Theme): string | number =>
  isLeftToRight(theme) ? '-0.1px' : 0;

const d1 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '5.25rem',
  lineHeight: '5.75rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme, type),
  letterSpacing: isLeftToRight(theme) ? '-0.2px' : 0,

  [theme.breakpoints.down('md')]: {
    fontSize: '4rem',
    lineHeight: '4.5rem',
  },

  [theme.breakpoints.down('xs')]: {
    fontSize: '3rem',
    lineHeight: '3.5rem',
  },
});

const d2 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '2.75rem',
  lineHeight: '3.2rem',
  fontFamily: fontFamily(theme),
  letterSpacing: letterSpacing(theme),
  fontWeight: fontWeight(theme, type),

  [theme.breakpoints.down('md')]: {
    fontSize: '2.25rem',
    lineHeight: '3rem',
  },

  [theme.breakpoints.down('xs')]: {
    fontSize: '2rem',
    lineHeight: '2.5rem',
  },
});

const h1 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '1.75rem',
  lineHeight: '2.25rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme, type),
  letterSpacing: letterSpacing(theme),

  [theme.breakpoints.down('xs')]: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
});

const h2 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme, type),
  letterSpacing: letterSpacing(theme),
});

const h3 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '1rem',
  lineHeight: '1.5rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme, type),
  letterSpacing: letterSpacing(theme),
});

const h4 = (
  theme: Theme,
  type: FontWeightType = 'regular'
): TypographyStyle => ({
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme, type),
  letterSpacing: letterSpacing(theme),
});

const body1 = (theme: Theme): TypographyStyle => ({
  letterSpacing: 0,
  fontSize: '1rem',
  lineHeight: '1.5rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme),
});

const body2 = (theme: Theme): TypographyStyle => ({
  letterSpacing: 0,
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  fontFamily: fontFamily(theme),
  fontWeight: fontWeight(theme),
});

export default (theme: Theme): Typography => ({
  fontFamily: fontFamily(theme),
  fontWeight: 400,

  inherit: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
  },

  d1: d1(theme),
  d1semibold: d1(theme, 'semibold'),

  d2: d2(theme),
  d2semibold: d2(theme, 'semibold'),

  h1: h1(theme),
  h1semibold: h1(theme, 'semibold'),

  h2: h2(theme),
  h2semibold: h2(theme, 'semibold'),

  h3semibold: h3(theme, 'semibold'),
  h3bold: h3(theme, 'bold'),

  h4bold: h4(theme, 'bold'),

  body1: body1(theme),
  body2: body2(theme),

  pxToRem: theme.typography.pxToRem,
});
