import { css, SerializedStyles } from '@emotion/react';

import type { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('HeaderSupportText', ['icon']);

export const getHeaderSupportTextCss = (theme: Theme): SerializedStyles => {
  return css`
    margin-top: ${theme.spacing(4)};
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-shrink: 1;

    ${classNames.icon} {
      color: inherit;
      margin: 2px 8px 0 0;
      vertical-align: middle;
      flex-shrink: 0;
    }
  `;
};
