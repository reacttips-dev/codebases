import { SerializedStyles, css } from '@emotion/react';

import {
  getOutlineStyles,
  classNames as inputClassNames,
} from '@core/forms/Input/getInputCss';
import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import constants from './constants';
import { Props as SelectProps } from './Select';

export const { classes, classNames } = generateEmotionClassNames('select', [
  'select',
  'opened',
  'focusVisible',
  'paper',
  'mobileMenu',
  'list',
  'icon',
  'valid',
  'invalid',
]);

export const getListStyles = (
  theme: Theme,
  count: number,
  visibleCount = constants.DEFAULT_VISIBLE_ITEM_COUNT
): SerializedStyles => {
  return css`
    padding: ${count > visibleCount ? theme.spacing(12) : theme.spacing(16)};
    max-height: ${constants.OPTION_HEIGHT * visibleCount +
    constants.OPTIONS_DIVIDER_HEIGHT * (visibleCount - 1)}px;
  `;
};

export const getDropdownCss = (
  theme: Theme,
  props: SelectProps
): SerializedStyles => css`
  ${classNames.paper} {
    overflow: hidden;
    box-sizing: border-box;
    margin-top: ${theme.spacing(12)};
    border: 1px solid ${theme.palette.blue[700]};

    /*! @noflip */
    ${theme.direction === 'rtl' ? 'padding-left: 0;' : 'padding-right: 0;'}
  }

  ${classNames.list} {
    overflow: auto;

    ${getListStyles(
      theme,
      Array.isArray(props.children) ? props.children.length : 1,
      props.visibleItemCount
    )}

    & > li + li {
      margin-top: ${theme.spacing(4)};
    }
  }

  ${classNames.valid} {
    &${classNames.paper} {
      border-color: ${theme.palette.green[800]};
    }
  }

  ${classNames.invalid} {
    &${classNames.paper} {
      border-color: ${theme.palette.red[800]};
    }
  }
`;

export default (theme: Theme): SerializedStyles => css`
  ${classNames.select} {
    padding-right: 44px;

    &:focus {
      background: unset;
    }
  }

  ${classNames.icon} {
    top: 50%;
    color: ${theme.palette.black[500]};
    right: ${theme.spacing(12)};
    left: auto;
    transform: translate(0, -50%);

    & svg {
      display: block;
    }
  }

  &${classNames.opened} {
    ${classNames.select} {
      & span {
        color: ${theme.palette.black[500]};
      }
    }

    ${inputClassNames.notchedOutline} {
      border-color: ${theme.palette.blue[700]};
    }

    &${inputClassNames.valid} {
      ${inputClassNames.notchedOutline} {
        border-color: ${theme.palette.green[800]};
      }
    }

    &${inputClassNames.invalid} {
      ${inputClassNames.notchedOutline} {
        border-color: ${theme.palette.red[800]};
      }
    }
  }

  &${classNames.focusVisible} {
    ${getOutlineStyles(theme)}
  }
`;
