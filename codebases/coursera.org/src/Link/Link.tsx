/** @jsx jsx */
import React from 'react';

import { Link as MuiLink } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { IconProps } from '@core/SvgIcon';
import { useTheme } from '@core/theme';
import { OverrideProps, OverridableComponent } from '@core/types';

import getLinkCss, {
  classes,
  getAfterIconCss,
  getBeforeIconCss,
} from './getLinkCss';

type BaseProps = {
  /**
   * Render an icon next to the link.
   */
  icon?: React.ReactElement<IconProps>;

  /**
   * Specify positioning of the icon relative to the link.
   * @default after
   */
  iconPosition?: 'before' | 'after';

  /**
   * Render the link standalone (outside of inline text). Adds padding to ensure bigger hit area for the link.
   * @default false
   */
  standalone?: boolean;

  /**
   * Enable distinct styling for `:visited` state of link.
   * @default false
   */
  enableVisitedState?: boolean;

  /**
   * The link variant to use
   * @default standard
   */
  variant?: 'standard' | 'quiet';

  /**
   * The typography variant to use.
   * @default inherit
   */
  typographyVariant?:
    | 'd1'
    | 'd1semibold'
    | 'd2'
    | 'd2semibold'
    | 'h1'
    | 'h1semibold'
    | 'h2'
    | 'h2semibold'
    | 'h3semibold'
    | 'h3bold'
    | 'h4bold'
    | 'body1'
    | 'body2'
    | 'inherit';

  /**
   * Invert the color scheme. Use when displaying over dark backgrounds
   * @default false
   */
  invert?: boolean;

  children: React.ReactNode;
};

export interface LinkTypeMap<D extends React.ElementType = 'a'> {
  props: BaseProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = LinkTypeMap['defaultComponent']
> = OverrideProps<LinkTypeMap<D>, D> & { component?: React.ElementType };

/**
 * Links are navigational elements that direct users to different pages or further information.
 *
 * See [Props](__storybookUrl__/navigation-link--default#props)
 */
const Link: OverridableComponent<LinkTypeMap> = React.forwardRef(function Link(
  props: Props,
  ref: React.Ref<HTMLAnchorElement>
) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    icon,
    iconPosition,
    enableVisitedState,
    standalone,
    variant,
    children,
    typographyVariant,
    invert,
    ...rest
  } = props;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const theme = useTheme();

  const css = getLinkCss(theme, props);
  const afterIconCss = getAfterIconCss(theme);
  const beforeIconCss = getBeforeIconCss(theme);

  return (
    <MuiLink ref={ref} classes={classes} css={css} {...rest}>
      {icon && iconPosition === 'before' && (
        <span css={beforeIconCss}>{icon}</span>
      )}

      {children}

      {icon && iconPosition === 'after' && (
        <span css={afterIconCss}>{icon}</span>
      )}
    </MuiLink>
  );
});

Link.defaultProps = {
  variant: 'standard',
  iconPosition: 'after',
  typographyVariant: 'inherit',
};

export default Link;
