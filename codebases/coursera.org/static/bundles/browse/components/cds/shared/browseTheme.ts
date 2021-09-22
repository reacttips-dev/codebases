import type { Theme, SerializedStyles } from '@emotion/react';

/**
 * These shared config items eliminate the need for non-performant calls to the theme.
 * This should help reduce the time it takes to calculate Emotion styles.
 * See this blog post for more: https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce
 */

export const config = {
  sizes: {
    down: {
      xs: 599,
      sm: 1023,
      md: 1439,
    },
    up: {
      xs: 0,
      sm: 600,
      md: 1024,
    },
  },
  colors: {
    white: '#FFF',
    black: '#1F1F1F',
    grey100: '#F5F7F8',
    grey300: '#E5E7E8',
    grey400: '#C3C5C6',
    grey500: '#929599',
    grey700: '#636363',
    blue600: '#0056D2',
    blue900: '#00255D',
    purple800: '#382D8B',
    yellow500: '#F2D049',
  },
  typography: {
    fontFamily: '"Source Sans Pro",Arial,sans-serif',
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      fontFamily: '"Source Sans Pro",Arial,sans-serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
  },
} as const;
