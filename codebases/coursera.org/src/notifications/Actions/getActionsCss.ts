import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';

export default (theme: Theme): SerializedStyles => css`
  margin: ${theme.spacing(24, 0, 0)};

  ${theme.breakpoints.up('sm')} {
    & button:first-of-type {
      margin: ${theme.spacing(0, 16, 0, 0)};
    }
  }

  ${theme.breakpoints.down('xs')} {
    margin: ${theme.spacing(24, 0, 0)};
    text-align: center;

    & button {
      width: 100%;
      max-width: none;
    }

    & button:nth-of-type(2) {
      margin: ${theme.spacing(12, 0, 0, 0)};
    }
  }
`;
