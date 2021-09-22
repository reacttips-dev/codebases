import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames('formLabel', [
  'root',
  'asterisk',
  'focused',
  'error',
  'optionalLabel',
  'onLight',
  'onDark',
]);

export default (theme: Theme): SerializedStyles => css`
  &${classNames.root} {
    position: relative;
    transform: initial;

    ${theme.typography.h3semibold}
  }

  ${classNames.asterisk} {
    display: none;
  }

  &${classNames.focused}, &${classNames.error} {
    &${classNames.root} {
      color: unset;
    }
  }

  ${classNames.optionalLabel} {
    display: inline-block;
  }

  &${classNames.onDark} {
    &${classNames.root} {
      color: ${theme.palette.white};
    }
  }

  &${classNames.onLight} {
    &${classNames.root} {
      color: ${theme.palette.black[500]};
    }
  }
`;
