import { SerializedStyles, css } from '@emotion/react';

import { ValidationStatus } from '@core/forms/FormControl';
import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('checkboxAndRadio', [
  'label',
  'input',
  'labelText',
  'supportText',
  'focusVisible',
]);

const validationCss = (
  theme: Theme,
  status: ValidationStatus,
  checked: boolean
): SerializedStyles => {
  const success = status === 'success';

  return css`
    ${classNames.label} {
      ${classNames.input},
      ${classNames.labelText} {
        color: ${success ? theme.palette.green[700] : theme.palette.red[700]};
      }

      ${classNames.focusVisible} {
        color: ${success ? theme.palette.green[800] : theme.palette.red[800]};
        fill: ${checked
          ? 'transparent'
          : success
          ? theme.palette.green[50]
          : theme.palette.red[50]};

        & + ${classNames.labelText} {
          color: ${success ? theme.palette.green[800] : theme.palette.red[800]};
        }
      }

      &:hover,
      &:active {
        ${classNames.input},
        ${classNames.labelText} {
          color: ${success ? theme.palette.green[800] : theme.palette.red[800]};
        }

        ${classNames.input} {
          fill: ${checked
            ? 'transparent'
            : success
            ? theme.palette.green[50]
            : theme.palette.red[50]};
        }
      }
    }
  `;
};

const disabledCss = (theme: Theme): SerializedStyles => css`
  ${classNames.label} {
    cursor: default;

    ${classNames.input} {
      fill: transparent;
      color: ${theme.palette.gray[400]};
    }

    ${classNames.labelText} {
      color: ${theme.palette.gray[400]};
    }

    &:hover,
    &:active {
      ${classNames.input} {
        fill: transparent;
        color: ${theme.palette.gray[400]};
      }

      ${classNames.labelText} {
        color: ${theme.palette.gray[400]};
      }
    }
  }

  ${classNames.supportText} {
    color: ${theme.palette.gray[400]};
  }
`;

export default (
  theme: Theme,
  {
    disabled,
    checked,
    validationStatus,
  }: {
    disabled?: boolean;
    checked?: boolean;
    validationStatus?: ValidationStatus;
  }
): SerializedStyles => css`
  margin-top: ${theme.spacing(4)};

  ${classNames.label} {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    cursor: pointer;
    margin: ${theme.spacing(0, 0, 8, 0)};
    word-break: break-word;

    ${classNames.input} {
      fill: transparent;
      color: ${checked ? theme.palette.blue[600] : theme.palette.gray[700]};
      padding: ${theme.spacing(8, 12, 0, 0)};

      & input + svg {
        fill: inherit;
      }
    }

    ${classNames.labelText} {
      margin: ${theme.spacing(8, 0, 0, 0)};
      color: ${checked ? theme.palette.blue[600] : theme.palette.black[500]};
    }

    ${classNames.focusVisible} {
      color: ${theme.palette.blue[700]};
      fill: ${checked ? 'transparent' : theme.palette.blue[50]};

      & + ${classNames.labelText} {
        color: ${theme.palette.blue[600]};
      }
    }

    &:hover {
      ${classNames.input} {
        color: ${theme.palette.blue[700]};
        fill: ${checked ? 'transparent' : theme.palette.blue[50]};
      }

      ${classNames.labelText} {
        color: ${theme.palette.blue[700]};
      }
    }

    &:active {
      ${classNames.input} {
        color: ${theme.palette.purple[800]};
        fill: ${checked ? 'transparent' : theme.palette.purple[50]};
      }

      ${classNames.labelText} {
        color: ${theme.palette.purple[800]};
      }
    }
  }

  ${classNames.supportText} {
    margin: ${theme.spacing(0, 0, 8, 0)};
    margin-top: -4px;
    margin-left: 36px;
    color: ${theme.palette.gray[700]};
  }

  ${disabled ? disabledCss(theme) : undefined}

  ${!disabled && validationStatus !== undefined
    ? validationCss(theme, validationStatus, !!checked)
    : undefined}
`;
