import { css, SerializedStyles } from '@emotion/react';

import { Theme } from '@core/theme';

export type IconColor =
  | 'default'
  | 'support'
  | 'invert'
  | 'interactive'
  | 'warning'
  | 'error'
  | 'success';

const getIconColor = (theme: Theme, color: IconColor): string | undefined => {
  const colorMap: Record<IconColor, string | undefined> = {
    default: theme.palette.black[500],
    support: theme.palette.gray[700],
    invert: theme.palette.white,
    interactive: theme.palette.blue[600],
    warning: theme.palette.yellow[800],
    error: theme.palette.red[700],
    success: theme.palette.green[700],
  };

  return colorMap[color];
};

export default (theme: Theme, color: IconColor): SerializedStyles => css`
  color: ${getIconColor(theme, color)};
`;
