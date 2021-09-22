import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';

export type Color = 'light' | 'dark' | 'white';

const dividerColorMap = {
  light: (theme: Theme): string => theme.palette.gray[300],
  dark: (theme: Theme): string => theme.palette.gray[500],
  white: (theme: Theme): string => theme.palette.white,
};
export default (theme: Theme, color: Color): SerializedStyles => css`
  background: ${dividerColorMap[color || 'dark'](theme)};
`;
