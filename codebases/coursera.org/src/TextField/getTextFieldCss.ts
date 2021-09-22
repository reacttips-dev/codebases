import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import createPalette from '@core/theme/createPalette';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { TextFieldProps } from './TextField';

export const { classes, classNames } = generateEmotionClassNames('text-field', [
  'root',
  'focused',
  'formValidationLabel',
  'formSupportText',
  'validationIcon',
  'valid',
  'invalid',
]);

const getValidationStyles = (
  theme: Theme,
  validationStatus: NonNullable<TextFieldProps['validationStatus']>
): SerializedStyles => {
  const colorMap: Record<
    string,
    keyof Pick<typeof createPalette, 'green' | 'red'>
  > = {
    success: 'green',
    error: 'red',
  };

  const color = colorMap[validationStatus];

  return css`
    &${classNames.focused} {
      & ${classNames.validationIcon} {
        color: ${theme.palette[color][800]};
      }
    }

    &:hover {
      background: ${theme.palette[color][50]};

      & ${classNames.validationIcon} {
        color: ${theme.palette[color][800]};
      }
    }
  `;
};

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

  &${classNames.valid}, &${classNames.invalid} {
    ${classNames.validationIcon} {
      padding-left: ${theme.spacing(0)};
    }
  }

  &${classNames.valid} {
    ${classNames.root} {
      ${getValidationStyles(theme, 'success')}
    }
  }

  &${classNames.invalid} {
    ${classNames.root} {
      ${getValidationStyles(theme, 'error')}
    }
  }
`;
