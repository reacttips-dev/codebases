/** @jsx jsx */
import React from 'react';

import { Button as MuiButton } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { IconProps } from '@core/SvgIcon';
import { useTheme } from '@core/theme';
import { OverrideProps, OverridableComponent } from '@core/types';

import getButtonCss, { classes, variants } from './getButtonCss';

type BaseProps = {
  /**
   * Render an icon next to the button text.
   */
  icon?: React.ReactElement<IconProps>;

  /**
   * Specify positioning of the icon relative to the button text.
   * @default after
   */
  iconPosition?: 'before' | 'after';

  /**
   * If true, the button will be disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Defines whether button should be full-width.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * The size of the button.
   * @default medium
   */
  size?: 'small' | 'medium';

  /**
   * The variant to use.
   * @default primary
   */
  variant?: keyof typeof variants;

  /**
   * Define text to display in the button.
   */
  children: React.ReactNode;
};

export interface ButtonTypeMap<D extends React.ElementType = 'button'> {
  props: BaseProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = ButtonTypeMap['defaultComponent']
> = OverrideProps<ButtonTypeMap<D>, D> & { component?: React.ElementType };

/**
 * Buttons are used to help users initiate an action or navigate to another page
 *
 * See [Props](__storybookUrl__/inputs-button--default#props)
 */
const Button: OverridableComponent<ButtonTypeMap> = React.forwardRef(
  function Button(props: Props, ref: React.Ref<HTMLButtonElement>) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { size, variant, icon, iconPosition, ...rest } = props;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const theme = useTheme();
    const css = getButtonCss(theme, props);

    return (
      <MuiButton
        ref={ref}
        disableElevation
        disableRipple
        disableTouchRipple
        classes={classes}
        css={css}
        endIcon={icon && iconPosition === 'after' ? icon : undefined}
        startIcon={icon && iconPosition === 'before' ? icon : undefined}
        {...rest}
      />
    );
  }
);

Button.defaultProps = {
  size: 'medium',
  variant: 'primary',
  iconPosition: 'after',
};

export default Button;
