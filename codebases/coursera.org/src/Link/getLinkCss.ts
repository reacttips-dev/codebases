import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { Props as LinkProps } from './Link';

export const { classes, classNames } = generateEmotionClassNames('link', [
  'focusVisible',
]);

export const getBeforeIconCss = (theme: Theme): SerializedStyles => css`
  vertical-align: text-top;
  margin-right: ${theme.spacing(8)};
`;

export const getAfterIconCss = (theme: Theme): SerializedStyles => css`
  vertical-align: text-top;
  margin-left: ${theme.spacing(8)};
`;

export default (theme: Theme, props: LinkProps): SerializedStyles => css`
  vertical-align: baseline;
  display: ${props.standalone
    ? props.iconPosition === 'before'
      ? 'inline-flex'
      : 'inline-block'
    : 'inline'};
  color: ${props.invert ? theme.palette.white : theme.palette.blue[600]};
  padding: ${props.standalone ? theme.spacing(12, 0) : 0};
  text-decoration: ${props.variant === 'standard' ? 'underline' : 'none'};

  &:hover {
    color: ${props.invert ? theme.palette.white : theme.palette.blue[700]};
    text-decoration: ${props.variant === 'standard' ? 'none' : 'underline'};
  }

  &:focus {
    outline: none;
  }

  &:visited:not(${classNames.focusVisible}) {
    color: ${props.invert
      ? theme.palette.white
      : props.enableVisitedState
      ? theme.palette.purple[800]
      : theme.palette.blue[600]};
  }

  ${theme.typography[
    props.typographyVariant as NonNullable<LinkProps['typographyVariant']>
  ]};

  &${classNames.focusVisible} {
    outline: none;
    border-radius: 4px;
    text-decoration: underline;
    color: ${props.invert ? theme.palette.white : theme.palette.blue[700]};
    box-shadow: 0 0 0 1px ${theme.palette.purple[600]},
      0 0 0 2px ${theme.palette.blue[50]};
  }
`;
