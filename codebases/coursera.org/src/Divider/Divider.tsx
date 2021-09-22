/** @jsx jsx */
import React from 'react';

import { Divider as MuiDivider } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import { ComponentPropsWithRef } from '@core/types';

import { default as getDividerCss, Color } from './getDividerCss';

export type Props = {
  /**
   * Defines the color of the divider.
   * @default light
   */
  color?: Color;
  /**
   * Defines the divider orientation.
   * @default horizontal
   */
  orientation?: 'horizontal' | 'vertical';
} & ComponentPropsWithRef<'hr'>;

/**
 * A divider is a visual aid to create intentional hierarchy between individual chunks
 * of content within a layout, content group, or component.
 *
 * See [Props](__storybookUrl__/data-display-divider--default#props)
 */
const Divider = React.forwardRef(function Divider(
  props: Props,
  ref: React.Ref<HTMLHRElement>
) {
  const theme = useTheme();
  const { 'aria-hidden': ariaHidden = true, color, ...rest } = props;
  const dividerCss = getDividerCss(theme, color as NonNullable<Color>);
  const flexItem = props.orientation === 'vertical';

  return (
    <MuiDivider
      ref={ref}
      aria-hidden={ariaHidden}
      css={dividerCss}
      flexItem={flexItem}
      {...rest}
    />
  );
});

Divider.defaultProps = {
  orientation: 'horizontal',
  color: 'light',
};

export default Divider;
