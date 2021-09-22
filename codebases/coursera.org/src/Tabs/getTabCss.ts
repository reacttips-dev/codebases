import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { Props as TabProps } from './Tab';

export const { classes, classNames } = generateEmotionClassNames('tab', [
  'focusVisible',
  'wrapper',
  'selected',
]);

const variants = {
  primary: (theme: Theme): SerializedStyles => css`
    margin-right: ${theme.spacing(32)};
  `,

  section: (theme: Theme): SerializedStyles => css`
    margin-right: ${theme.spacing(24)};
  `,
};

export default (theme: Theme, props: TabProps): SerializedStyles => css`
  opacity: 1;
  min-height: 48px;
  min-width: 44px;
  max-width: none;
  overflow: visible;
  text-align: left;
  text-transform: none;
  align-self: flex-end;
  padding: ${theme.spacing(12, 8)};
  margin-bottom: ${theme.spacing(4)};
  color: ${theme.palette.black[500]};

  ${theme.typography.h3semibold};
  ${variants[props.variant as NonNullable<TabProps['variant']>](theme)};

  &:hover {
    border-radius: 4px;
    text-decoration: none;
    color: ${theme.palette.blue[700]};
    background-color: ${theme.palette.blue[50]};
  }

  &${classNames.selected} {
    color: ${theme.palette.blue[600]};
  }

  &${classNames.focusVisible} {
    flip: false;
    border: none;
    border-radius: 4px;
    color: ${theme.palette.blue[700]};
    background-color: ${theme.palette.blue[50]};
    box-shadow: inset ${theme.palette.blue[200]} 0 0 0 1px,
      inset 0 0 0 2px ${theme.palette.purple[600]};
  }

  ${classNames.wrapper} {
    flex-direction: row;

    & > *:first-of-type {
      min-width: 20px;
      margin: ${theme.spacing(0, 8, 0, 0)};
    }
  }

  ${theme.breakpoints.down('xs')} {
    max-width: 160px;
  }
`;
