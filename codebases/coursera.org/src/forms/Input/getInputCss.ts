import { SerializedStyles, css } from '@emotion/react';

import { ValidationStatus } from '@core/forms/FormControl/types';
import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { InputProps } from './Input';

export const { classes, classNames } = generateEmotionClassNames('input', [
  'focused',
  'notchedOutline',
  'root',
  'input',
  'multiline',
  'adornedStart',
  'adornedEnd',
  'valid',
  'invalid',
  'error',
  'onDark',
  'onLight',
  'placeholder',
]);

export const getOutlineStyles = (theme: Theme): SerializedStyles => css`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 4px;
    z-index: 0;
    user-select: none;
    transform: scale(1, 1);
    box-shadow: 0 0 0 1px ${theme.palette.purple[600]},
      0 0 0 2px ${theme.palette.blue[50]};
  }
`;

export const getFocusedStyle = (
  theme: Theme,
  props: InputProps
): SerializedStyles | undefined => {
  return !props.hideOutline ? getOutlineStyles(theme) : undefined;
};

/**
 * Return maxWidth rule value as string
 */
export const calculateMaxWidth = (
  theme: Theme,
  maxLength?: string | number
): string => {
  // as per the design spec, there should be space for an additional W
  const numberOfCharacters = Math.ceil(Number(maxLength)) + 1;
  // 4.624 (px) is the difference in width between '0' and 'W', which is defined by the design spec as the <purpose>(example: estimated single character space)
  const adjustment = numberOfCharacters * 4.624;
  // adjust for the input's padding
  const paddingAdjustment = theme.spacing(24);

  return maxLength
    ? `calc(${numberOfCharacters}ch + ${paddingAdjustment} + ${theme.typography.pxToRem(
        adjustment
      )})`
    : 'initial';
};

export const getRootStyles = (
  theme: Theme,
  props: InputProps
): SerializedStyles => css`
  font-family: ${theme.typography.fontFamily};
  background: ${theme.palette.white};
  align-self: ${props.inputProps?.maxLength && !props.fullWidth
    ? 'flex-start'
    : 'stretch'};
  max-width: ${props.fullWidth
    ? 'initial'
    : calculateMaxWidth(theme, props.inputProps?.maxLength)};
  width: ${props.inputProps?.maxLength ? '100%' : 'initial'};

  &:focus {
    outline: none;
  }

  &:hover {
    background: ${theme.palette.blue[50]};
    color: ${theme.palette.black[500]};

    & ${classNames.input} {
      color: inherit;

      &::placeholder,
      & ${classNames.placeholder} {
        color: inherit;
      }

      &:focus {
        &::placeholder {
          color: ${theme.palette.gray[400]};
        }
      }
    }

    & ${classNames.notchedOutline} {
      border-color: ${theme.palette.blue[700]};
    }
  }

  &${classNames.focused} {
    & ${classNames.notchedOutline} {
      border-color: ${theme.palette.gray[700]};
      border-width: 1px;
    }

    &:hover {
      background: ${theme.palette.white};

      & ${classNames.notchedOutline} {
        border-color: ${theme.palette.gray[700]};
      }
    }
  }
`;

export const getInputStyles = (theme: Theme): SerializedStyles => css`
  position: relative;
  padding: ${theme.spacing(12)};
  color: ${theme.palette.black[500]};
  height: ${theme.spacing(24)};

  ${theme.typography.body1}

  &::placeholder, 
  & ${classNames.placeholder} {
    color: ${theme.palette.gray[700]};
    opacity: 1;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &:focus {
    color: ${theme.palette.black[500]};
    background: unset;

    &::placeholder {
      color: ${theme.palette.gray[400]};
    }

    & ${classNames.placeholder} {
      color: inherit;
    }
  }
`;

export const getOnLightValidationStyles = (
  theme: Theme,
  validationStatus: NonNullable<ValidationStatus>
): SerializedStyles => {
  const colorMap: Record<string, 'green' | 'red'> = {
    success: 'green',
    error: 'red',
  };

  const color = colorMap[validationStatus];

  return css`
    & ${classNames.notchedOutline} {
      border-color: ${theme.palette[color][700]};
    }

    &:hover {
      background: ${theme.palette[color][50]};

      & ${classNames.notchedOutline} {
        border-color: ${theme.palette[color][800]};
      }
    }

    &${classNames.focused} {
      background: ${theme.palette.white};

      & ${classNames.notchedOutline} {
        border-color: ${theme.palette[color][800]};
      }

      &:hover {
        & ${classNames.notchedOutline} {
          border-color: ${theme.palette[color][800]};
        }
      }
    }
  `;
};

export const getOnDarkValidationStyles = (
  theme: Theme,
  validationStatus: NonNullable<ValidationStatus>
): SerializedStyles => {
  const colorMap: Record<string, 'green' | 'red'> = {
    success: 'green',
    error: 'red',
  };

  const color = colorMap[validationStatus];

  return css`
    & ${classNames.notchedOutline} {
      border-color: ${theme.palette[color][50]};
    }

    &:hover {
      background: ${theme.palette[color][100]};
      & ${classNames.notchedOutline} {
        border-color: ${theme.palette[color][100]};
      }
    }

    &${classNames.focused} {
      background: ${theme.palette.white};

      & ${classNames.notchedOutline} {
        border-color: ${theme.palette[color][100]};
      }

      &:hover {
        background: ${theme.palette.white};

        & ${classNames.notchedOutline} {
          border-color: ${theme.palette[color][100]};
        }
      }
    }
  `;
};

export default (theme: Theme, props: InputProps): SerializedStyles => css`
  &${classNames.root} {
    ${getRootStyles(theme, props)}
  }

  ${classNames.input} {
    ${getInputStyles(theme)}
  }

  &${classNames.multiline} {
    padding: 0;

    & ${classNames.input} {
      height: auto;
      min-height: 144px;
    }
  }

  ${classNames.notchedOutline} {
    border-color: ${theme.palette.gray[700]};
    border-width: 1px;
  }

  &${classNames.adornedStart} {
    padding-left: 0;
  }

  &${classNames.adornedEnd} {
    padding-right: 0;

    &${classNames.multiline} ${classNames.input} {
      padding-right: 42px;
    }
  }

  &${classNames.focused} {
    ${getFocusedStyle(theme, props)}
  }

  &${classNames.error} {
    &${classNames.invalid} {
      & ${classNames.notchedOutline} {
        border-color: ${theme.palette['red'][700]};
      }
    }
  }

  &${classNames.onDark} {
    & ${classNames.notchedOutline} {
      border-color: transparent;
    }

    &:hover {
      & ${classNames.notchedOutline} {
        border-color: transparent;
      }
    }

    &${classNames.focused} {
      & ${classNames.notchedOutline} {
        border-color: transparent;
      }

      &:hover {
        & ${classNames.notchedOutline} {
          border-color: transparent;
        }
      }
    }

    &${classNames.valid} {
      ${getOnDarkValidationStyles(theme, 'success')}
    }

    &${classNames.invalid} {
      ${getOnDarkValidationStyles(theme, 'error')}
    }
  }

  &${classNames.onLight} {
    &${classNames.valid} {
      ${getOnLightValidationStyles(theme, 'success')}
    }

    &${classNames.invalid} {
      ${getOnLightValidationStyles(theme, 'error')}
    }
  }
`;
