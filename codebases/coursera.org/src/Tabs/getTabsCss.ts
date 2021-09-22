import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames('tab-list', [
  'indicator',
  'scrollable',
]);

export default (theme: Theme): SerializedStyles => css`
  min-height: auto;
  overflow: visible;
  position: relative;
  border-bottom: 1px solid ${theme.palette.gray[400]};

  ${classNames.indicator} {
    height: ${theme.spacing(4)};
    background-color: ${theme.palette.blue[600]};
    border-radius: 2px 2px 0 0;
  }

  ${classNames.scrollable} {
    padding: ${theme.spacing(0)};
  }
`;
