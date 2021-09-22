import { SerializedStyles, css } from '@emotion/react';

import { FormControlContextProps } from '@core/forms/FormControl';
import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const getBackgroundColor = (
  theme: Theme,
  props: FormControlContextProps,
  invert = false
): string => {
  const colorLevel = invert ? 100 : 50;

  return props.validationStatus === 'success'
    ? theme.palette.green[colorLevel]
    : theme.palette.red[colorLevel];
};

export const {
  classes,
  classNames,
} = generateEmotionClassNames('formValidationLabel', [
  'root',
  'valid',
  'invalid',
  'icon',
  'onLight',
  'onDark',
]);

export default (
  theme: Theme,
  props: FormControlContextProps
): SerializedStyles => css`
  &${classNames.root} {
    fill: transparent;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: ${theme.spacing(4, 8)};
    background-color: ${getBackgroundColor(theme, props)};
    ${theme.typography.h4bold}
  }

  ${classNames.icon} {
    flex: 0 0 auto;
    margin-right: ${theme.spacing(8)};
  }

  &${classNames.valid} {
    ${classNames.icon} {
      color: ${theme.palette.green[700]};
    }
  }

  &${classNames.invalid} {
    ${classNames.icon} {
      color: ${theme.palette.red[700]};
    }
  }

  &${classNames.onDark} {
    background-color: ${getBackgroundColor(theme, props, true)};
  }

  &${classNames.onLight} {
    background-color: ${getBackgroundColor(theme, props)};
  }
`;
