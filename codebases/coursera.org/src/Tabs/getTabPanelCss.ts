import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';

export default (theme: Theme): SerializedStyles => css`
  padding: ${theme.spacing(0)};
`;
