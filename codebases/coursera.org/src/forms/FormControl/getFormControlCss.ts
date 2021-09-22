import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames(
  'formControl',
  [
    'root',
    'formLabel',
    'formValidationLabel',
    'formStatusText',
    'formSupportText',
  ]
);

export default (theme: Theme): SerializedStyles => css`
  &${classNames.root} {
    max-width: 100%;
  }

  ${classNames.formLabel} {
    margin: ${theme.spacing(0, 0, 4)};
  }

  ${classNames.formValidationLabel} {
    max-width: 100%;
    width: max-content;
    margin: ${theme.spacing(12, 0, 0)};
  }

  ${classNames.formStatusText} {
    margin: ${theme.spacing(0, 0, 4)};
  }

  ${classNames.formSupportText} {
    margin: ${theme.spacing(4, 0, 4)};
  }
`;
