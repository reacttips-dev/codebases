import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';

import { SiteNotificationProps } from '.';

export const severities = {
  information: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.blue[50]};
  `,
  warning: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.red[50]};
  `,
};

export const getSiteNotificationCss = (
  theme: Theme,
  props: SiteNotificationProps
): SerializedStyles => css`
  ${theme.breakpoints.down('md')} {
    padding: ${theme.spacing(16, 24)};
  }
  ${theme.breakpoints.up('md')} {
    padding: ${theme.spacing(32, 48)};
  }
  ${severities[props.severity as NonNullable<keyof typeof severities>](theme)};
`;
