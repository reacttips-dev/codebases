import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames(
  'selectOption',
  ['root', 'icon', 'focusVisible', 'button', 'selected', 'container']
);

const baseStyles = (theme: Theme) => css`
  background: ${theme.palette.blue[50]};
  color: ${theme.palette.blue[700]};
`;

export default (theme: Theme): SerializedStyles => css`
  padding: ${theme.spacing(4)} 2px;
  overflow: visible;
  white-space: unset;
  border-radius: 4px;

  ${theme.typography.body1}

  & ${classNames.container} {
    display: flex;
    padding: ${theme.spacing(8)} 6px;
    flex: 1 0 100%;
    max-width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    border-radius: 3px;
    box-sizing: border-box;
    color: ${theme.palette.black[500]};
  }

  &${classNames.selected} {
    background: ${theme.palette.blue[50]};

    ${classNames.container} {
      background: ${theme.palette.blue[50]};
      color: ${theme.palette.blue[700]};
    }
  }

  &${classNames.focusVisible} {
    position: relative;
    z-index: 1;
    background: none;

    & ${classNames.container} {
      font-weight: 400;

      ${baseStyles(theme)}
    }

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      bottom: 2px;
      right: 0;
      left: 0;
      border-radius: ${theme.spacing(4)};
      box-shadow: 0 0 0 1px ${theme.palette.purple[600]},
        0 0 0 2px ${theme.palette.blue[50]};
    }
  }

  ${classNames.icon} {
    margin-top: 2px;
    margin-left: ${theme.spacing(12)};
    & > svg {
      display: block;
    }
  }

  &${classNames.button} {
    transition: none;
  }

  &${classNames.root} {
    &:hover {
      background: ${theme.palette.blue[50]};

      & ${classNames.container} {
        ${baseStyles(theme)}
      }
    }
  }
`;
