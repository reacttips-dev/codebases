import { css } from '@emotion/core';

import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { PODCAST_COLORS } from 'client/utils';

export const adsByAnchorPageStyles = css`
  html,
  body {
    background: ${COLOR_GREEN};
  }

  main > main {
    background: ${PODCAST_COLORS.WHITE.color};
  }
`;
