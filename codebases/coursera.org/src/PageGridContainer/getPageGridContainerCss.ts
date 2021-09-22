import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/types';

export default (theme: Theme): SerializedStyles => css`
  ${theme.breakpoints.up('xs')} {
    padding: ${theme.spacing(0, 16)};
  }

  ${theme.breakpoints.up('md')} {
    padding: ${theme.spacing(0, 48)};
  }
`;
