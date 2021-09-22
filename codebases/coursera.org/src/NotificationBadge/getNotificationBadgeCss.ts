import { css, SerializedStyles } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('notificationBadge', [
  'content',
  'inline',
  'top',
  'default',
  'invert',
]);

export default (theme: Theme): SerializedStyles => {
  return css`
    display: inline-flex;
    flex-shrink: 0;
    flex-direction: row;

    ${classNames.content} {
      height: 20px;
      min-width: 20px;
      max-width: 42px;
      padding: 0 6px;
      border-radius: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: center;

      ${theme.typography.h4bold}
    }

    ${classNames.default} {
      background-color: ${theme.palette.red[700]};
      color: ${theme.palette.white};
    }

    ${classNames.invert} {
      background-color: ${theme.palette.white};
      color: ${theme.palette.black[500]};
    }

    ${classNames.inline} {
      margin-left: ${theme.spacing(8)};
      align-self: center;
    }

    ${classNames.top} {
      margin-left: -10px;
      transform: translateY(-50%);
      align-self: flex-start;
    }
  `;
};
