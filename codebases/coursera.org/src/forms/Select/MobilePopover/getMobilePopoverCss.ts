import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('mobilePopover', [
  'root',
  'paper',
  'topBar',
  'container',
]);

export default (theme: Theme): SerializedStyles => css`
  background: rgba(0, 0, 0, 0.5);

  ${classNames.paper} {
    padding: ${theme.spacing(24, 12, 0, 12)};
    bottom: 0;

    /*! @noflip */
    left: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 16px 16px 0 0;
  }

  ${classNames.topBar} {
    text-align: right;
    margin-bottom: ${theme.spacing(8)};
  }

  ${classNames.container} {
    padding: ${theme.spacing(0, 12)};
    margin-bottom: ${theme.spacing(24)};
  }
`;
