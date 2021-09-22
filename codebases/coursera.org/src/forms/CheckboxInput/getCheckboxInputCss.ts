import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('checkboxInput', ['checked', 'disabled']);

export default (
  theme: Theme,
  focusVisibleClassName?: string
): SerializedStyles => css`
  &:hover,
  &:active,
  &${classNames.disabled}, &${classNames.checked}:hover {
    background-color: transparent;
  }

  &.${focusVisibleClassName} {
    svg {
      border-radius: 2px;
      box-shadow: ${theme.palette.white} 0 0 0 2px,
        ${theme.palette.purple[600]} 0 0 0 3px,
        ${theme.palette.blue[200]} 0 0 0 4px;
    }
  }
`;
