/** @jsx jsx */
import React from 'react';

import { Typography as MuiTypography } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import {
  OverrideProps,
  OverridableComponent,
  TypographyVariant,
} from '@core/types';

import getTypographyCss from './getTypographyCss';

type BaseProps = {
  /**
   * Set the text-align on the component.
   * @default inherit
   **/
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';

  /**
   * Controls the display type.
   * @default initial
   **/
  display?: 'initial' | 'block' | 'inline';

  /**
   * Applies the theme typography styles.
   * @default body1
   **/
  variant?: TypographyVariant;

  /**
   * The color for the text. It supports the theme colors relevant for this component.
   * @default body
   */
  color?:
    | 'body'
    | 'invertBody'
    | 'supportText'
    | 'primaryHeadline'
    | 'error'
    | 'success'
    | 'highlightBlue'
    | 'highlightPurple'
    | 'eyebrowYellow'
    | 'eyebrowAqua'
    | 'eyebrowPurple'
    | 'inherit';
};

export interface TypographyTypeMap<D extends React.ElementType = 'p'> {
  props: BaseProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = TypographyTypeMap['defaultComponent']
> = OverrideProps<TypographyTypeMap<D>, D> & { component?: React.ElementType };

const variantMapping: Record<TypographyVariant, React.ElementType> = {
  d1: 'h1',
  d1semibold: 'h1',
  d2: 'h2',
  d2semibold: 'h2',
  h1: 'h1',
  h1semibold: 'h1',
  h2: 'h2',
  h2semibold: 'h2',
  h3semibold: 'h3',
  h3bold: 'h3',
  h4bold: 'h4',
  body1: 'p',
  body2: 'p',
  inherit: 'p',
};

/**
 * Use to display headings and copy text
 *
 * See [Props](__storybookUrl__/theme-typography--default#props)
 */
const Typography: OverridableComponent<TypographyTypeMap> = React.forwardRef(
  function Typography(props: Props, ref: React.Ref<HTMLSpanElement>) {
    const theme = useTheme();
    const css = getTypographyCss(theme, props);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { color, variant, component, ...rest } = props;

    return (
      <MuiTypography
        ref={ref}
        component={
          component || variantMapping[variant as NonNullable<TypographyVariant>]
        }
        css={css}
        {...rest}
      />
    );
  }
);

Typography.defaultProps = {
  color: 'body',
  variant: 'body1',
};

export default Typography;
