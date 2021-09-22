import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('mobileMenuList', ['root']);

export default (theme: Theme): SerializedStyles => css`
  outline: none;
  overflow: auto;
  max-height: 350px;
  padding: ${theme.spacing(0, 4)};

  & > li + li {
    margin-top: ${theme.spacing(4)};
  }

  & > li:last-child {
    margin-bottom: ${theme.spacing(24)};
  }
`;
