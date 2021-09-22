import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames(
  'select-field',
  ['formValidationLabel', 'formSupportText', 'root']
);

export default (theme: Theme): SerializedStyles => css`
  ${classNames.root} {
    margin-top: ${theme.spacing(16)};
  }

  ${classNames.formValidationLabel} {
    margin-top: ${theme.spacing(16)};

    & + ${classNames.root} {
      margin-top: ${theme.spacing(12)};
    }
  }

  ${classNames.formSupportText} {
    margin: ${theme.spacing(8, 0, 0)};
  }
`;
