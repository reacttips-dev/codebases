import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { Props as ButtonProps } from './Button';

export const { classes, classNames } = generateEmotionClassNames('button', [
  'label',
  'endIcon',
  'startIcon',
  'disabled',
  'focusVisible',
  'disableElevation',
]);

const disableElevation = css`
  &${classNames.disableElevation} {
    &::after {
      content: unset;
    }
  }
`;

export const variants = {
  primary: (theme: Theme): SerializedStyles => css`
    color: ${theme.palette.white};
    background-color: ${theme.palette.blue[600]};
    box-shadow: inset 0 0 0 1px ${theme.palette.blue[600]};

    &:hover {
      border-color: ${theme.palette.blue[700]};
      background-color: ${theme.palette.blue[700]};
    }

    &:active {
      border-color: ${theme.palette.purple[800]};
      background-color: ${theme.palette.purple[800]};

      ${disableElevation}
    }

    &${classNames.disabled} {
      color: ${theme.palette.gray[300]};
      background: ${theme.palette.gray[400]};
    }
  `,

  primaryInvert: (theme: Theme): SerializedStyles => css`
    color: ${theme.palette.blue[600]};
    background-color: ${theme.palette.white};

    &:hover {
      color: ${theme.palette.blue[700]};
      background-color: ${theme.palette.blue[50]};
    }

    &${classNames.focusVisible} {
      background-color: ${theme.palette.blue[50]};
      color: ${theme.palette.blue[700]};
    }

    &:active {
      color: ${theme.palette.purple[800]};
      background-color: ${theme.palette.purple[50]};

      ${disableElevation}
    }

    &${classNames.disabled} {
      color: ${theme.palette.gray[400]};
      background: ${theme.palette.gray[100]};
    }
  `,

  secondary: (theme: Theme): SerializedStyles => css`
    color: ${theme.palette.blue[600]};
    background-color: ${theme.palette.white};
    box-shadow: inset 0 0 0 1px ${theme.palette.blue[600]};

    &:hover {
      color: ${theme.palette.blue[700]};
      box-shadow: inset 0 0 0 1px ${theme.palette.blue[700]};
      background-color: ${theme.palette.blue[50]};
    }

    &${classNames.focusVisible} {
      box-shadow: inset 0 0 0 1px ${theme.palette.blue[700]};
      background-color: ${theme.palette.blue[50]};
      color: ${theme.palette.blue[700]};
    }

    &:active {
      color: ${theme.palette.purple[800]};
      box-shadow: inset 0 0 0 1px ${theme.palette.purple[800]};
      background-color: ${theme.palette.purple[50]};

      ${disableElevation}
    }

    &${classNames.disabled} {
      color: ${theme.palette.gray[400]};
      background: ${theme.palette.gray[100]};
      box-shadow: inset 0 0 0 1px ${theme.palette.gray[400]};
    }
  `,

  ghost: (theme: Theme): SerializedStyles => css`
    text-decoration: none;
    color: ${theme.palette.blue[600]};

    &:hover {
      text-decoration: underline;
      color: ${theme.palette.blue[700]};
      background-color: ${theme.palette.blue[50]};
    }

    &${classNames.focusVisible} {
      text-decoration: underline;
      background-color: ${theme.palette.blue[50]};
      color: ${theme.palette.blue[700]};
    }

    &:active {
      text-decoration: underline;
      color: ${theme.palette.purple[800]};
      background-color: ${theme.palette.purple[50]};

      ${disableElevation}
    }

    &${classNames.disabled} {
      color: ${theme.palette.gray[400]};
    }
  `,

  ghostInvert: (theme: Theme): SerializedStyles => css`
    background: transparent;
    color: ${theme.palette.white};

    &:hover {
      background: transparent;
      text-decoration: underline;
    }

    &${classNames.focusVisible} {
      text-decoration: underline;
    }

    &:active {
      text-decoration: underline;
      ${disableElevation}
    }

    &${classNames.disabled} {
      background: transparent;
      text-decoration: underline;
      color: ${theme.palette.gray[400]};
    }
  `,
};

export const sizes = {
  small: (theme: Theme, props: ButtonProps): SerializedStyles => css`
    ${theme.typography.h4bold};

    padding: ${props.variant === 'ghost'
      ? theme.spacing(8)
      : theme.spacing(8, 16)};
  `,

  medium: (theme: Theme, props: ButtonProps): SerializedStyles => css`
    ${theme.typography.h3bold};

    padding: ${props.variant === 'ghost'
      ? theme.spacing(12, 16)
      : theme.spacing(12, 32)};
  `,
};

export default (theme: Theme, props: ButtonProps): SerializedStyles => css`
  border-radius: 4px;
  text-transform: none;
  text-align: center;
  max-width: ${props.fullWidth ? 'none' : '320px'};
  min-width: unset;
  transition: none;

  ${variants[props.variant as NonNullable<ButtonProps['variant']>](theme)};
  ${sizes[props.size as NonNullable<ButtonProps['size']>](theme, props)};

  ${classNames.label} {
    text-transform: none;
  }

  &:focus {
    outline: none;
  }

  &${classNames.focusVisible} {
    &${classNames.disableElevation} {
      &::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 4px;
        box-shadow: 0 0 0 1px ${theme.palette.purple[600]},
          0 0 0 2px ${theme.palette.blue[50]};
      }
    }
  }

  ${classNames.endIcon} {
    margin-right: 0;
  }

  ${classNames.startIcon} {
    margin-left: 0;
  }
`;
