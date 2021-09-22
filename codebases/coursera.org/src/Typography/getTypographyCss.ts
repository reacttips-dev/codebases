import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/types';
import { TypographyProps } from '@core/Typography';

type TypographyColor = NonNullable<TypographyProps['color']>;

export const getColor = (
  theme: Theme,
  typographyColor: TypographyColor = 'body'
): string => {
  const colors: Record<TypographyColor, string> = {
    inherit: 'inherit',
    body: theme.palette.black[500],
    invertBody: theme.palette.white,
    supportText: theme.palette.gray[700],
    primaryHeadline: theme.palette.purple[800],
    error: theme.palette.red[700],
    success: theme.palette.green[700],
    highlightBlue: theme.palette.blue[800],
    highlightPurple: theme.palette.purple[800],
    eyebrowYellow: theme.palette.yellow[500],
    eyebrowAqua: theme.palette.aqua[300],
    eyebrowPurple: theme.palette.purple[800],
  };

  return colors[typographyColor];
};

export default (theme: Theme, props: TypographyProps): SerializedStyles => css`
  color: ${getColor(theme, props.color)};

  ${theme.typography[props.variant as NonNullable<TypographyProps['variant']>]};
`;
