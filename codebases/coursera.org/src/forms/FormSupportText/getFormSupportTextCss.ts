import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('formSupportText', ['root']);

export default (theme: Theme, invert?: boolean): SerializedStyles => css`
  &${classNames.root} {
    text-align: left;
    color: ${invert ? theme.palette.white : theme.palette.black[500]};
    ${theme.typography.body2};
  }
`;
