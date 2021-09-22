import { css, SerializedStyles } from '@emotion/react';

import type { Theme } from '@core/theme';

export const getAccordionPanelCss = (theme: Theme): SerializedStyles => {
  return css`
    margin: ${theme.spacing(0, 16, 16, 16)};
  `;
};
