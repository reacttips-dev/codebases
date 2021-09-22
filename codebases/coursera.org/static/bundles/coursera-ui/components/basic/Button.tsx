/* eslint-disable no-use-before-define, quote-props */
import PropTypes from 'prop-types';

import React from 'react';
import { StyleSheet, css, color, transition } from '@coursera/coursera-ui';
import { darken, fade } from 'bundles/coursera-ui/utils/colorUtils';

const CONFIG = {
  size: {
    sm: {
      fontSize: '0.8rem',
      padding: '0.5rem 0.9rem',
    },
    md: {
      fontSize: '1rem',
      padding: '0.7rem 2rem',
    },
    lg: {
      fontSize: '1.2rem',
      padding: '1rem 2.6rem',
    },
  },
};

const BUTTON_TYPES = {
  primary: 'primary',
  accent: 'accent', // Currently mainly used for SuperUser
  secondary: 'secondary',
  default: 'default',
  noStyle: 'noStyle',
  disabled: 'disabled',
  link: 'link',
  icon: 'icon',
};

const BUTTON_SIZES = {
  zero: 'zero',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

/**
 * A generic Button that accepts children,
 * can be rendered as link, can use together with svgIcons
 * Sample Usage:
 * <Button type="primary" size="sm" label={'sm'}/>
 *
 * <Button isThemeDark={isThemeDark} type="accent">
 *   <SvgMembers isThemeDark={isThemeDark} hoverColor={color.white} />
 * </Button>
 */
const Button = ({
  children,
  htmlAttributes = {},
  isThemeDark,
  label,
  disabled,
  isTransparent,
  isChildrenOnRight,
  onClick,
  size = 'md',
  type: typeAlt,
  style,
  tag = 'button',
  refAlt,
}: $TSFixMe) => {
  const dynamicStyles = getStyles({ size });
  const mergedStyles = { ...dynamicStyles.Button, ...style };
  const Tag = tag;
  // @ts-ignore ts-migrate(2339) FIXME: Property 'disabled' does not exist on type '{}'.
  const type = disabled || htmlAttributes.disabled ? BUTTON_TYPES.disabled : typeAlt;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'disabled' does not exist on type '{}'.
  const isDisabled = disabled || type === 'disabled' || htmlAttributes.disabled;
  const disabledAttribute = tag === 'button' ? { disabled: isDisabled } : {};

  return (
    <Tag
      {...htmlAttributes}
      {...disabledAttribute}
      ref={refAlt}
      onClick={onClick}
      {...css(
        styles.Button,
        styles[type],
        styles[size],
        isThemeDark && styles[`${type}ThemeDark`],
        isThemeDark && styles[`${size}ThemeDark`],
        tag !== 'button' && (isThemeDark ? styles[`${type}LinkThemeDark`] : styles[`${type}Link`]),
        isTransparent && styles.isTransparent
      )}
      style={mergedStyles}
    >
      <span className="horizontal-box align-items-absolute-center">
        {!isChildrenOnRight && children}
        {label}
        {isChildrenOnRight && children}
      </span>
    </Tag>
  );
};

// Explicity declare the default props for documentation purpose,
Button.defaultProps = {
  htmlAttributes: {},
  size: 'md',
  style: {},
  type: BUTTON_TYPES.default,
  tag: 'button',
};

Button.propTypes = {
  /**
   * Override the inline-styles of the root element
   */
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /**
   * Additional control for the root element, can add data-e2e, ariaLabel...
   */
  htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /**
   * Whether button has dark bg parent element
   */
  isThemeDark: PropTypes.bool,
  /**
   * Render the children inside the button, good for icons
   */
  children: PropTypes.node,
  /**
   * The text for the button
   */
  label: PropTypes.string,
  /**
   * click event
   */
  onClick: PropTypes.func,
  /**
   * If disabled, we'll use disabled type
   */
  disabled: PropTypes.bool,
  /**
   * Sometimes you want to remove the background so you can have full control of the styles
   */
  isTransparent: PropTypes.bool,
  /**
   * Render children on the right side if children exists and isChildrenOnRight
   */
  isChildrenOnRight: PropTypes.bool,
  /**
   * Decide the general padding, can be overwritten by style prop
   */
  size: PropTypes.oneOf(Object.keys(BUTTON_SIZES)),
  /**
   * Button types
   */
  type: PropTypes.oneOf(Object.keys(BUTTON_TYPES)),
  /**
   * Allow rendering of different tags, e.g. 'a', 'button', Link
   */
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Dom ref
   */
  refAlt: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

// Dynamic styles
function getStyles({ size }: $TSFixMe) {
  return {
    Button: {},
    icon: {},
  };
}

export default Button;

export { BUTTON_TYPES, BUTTON_SIZES };

const styles = StyleSheet.create({
  Button: {
    borderRadius: 2,
    transition: transition.easeOut(),
    lineHeight: '1rem',
    userSelect: 'none',
    position: 'relative',
    textAlign: 'center',
    display: 'inline-block',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    backgroundImage: 'none',
    cursor: 'pointer',
    filter: 'none',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'none !important',
    },
  },
  isTransparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  primary: {
    color: color.white,
    backgroundColor: color.primary,
    border: `1px solid ${color.primary}`,
    ':hover': {
      backgroundColor: color.darkPrimary,
    },
  },
  primaryThemeDark: {
    color: color.primary,
    backgroundColor: color.white,
    border: `1px solid ${color.white}`,
    ':hover': {
      color: color.white,
      backgroundColor: fade(color.white, 0.5),
      borderColor: fade(color.white, 0.5),
    },
  },
  primaryLink: {
    color: `${color.white} !important `,
  },
  primaryLinkThemeDark: {
    color: `${color.primary} !important`,
  },
  accent: {
    color: color.white,
    backgroundColor: color.accent,
    border: `1px solid ${color.accent}`,
    ':hover': {
      backgroundColor: darken(color.accent, 0.2),
    },
  },
  accentThemeDark: {
    color: color.white,
    backgroundColor: color.accent,
    border: `1px solid ${color.accent}`,
    ':hover': {
      color: color.white,
      border: `1px solid ${darken(color.accent, 0.2)}`,
      backgroundColor: darken(color.accent, 0.2),
    },
  },
  accentLink: {
    color: `${color.white} !important `,
  },
  accentLinkThemeDark: {
    color: `${color.accent} !important`,
  },
  secondary: {
    color: color.primary,
    backgroundColor: color.white,
    border: `1px solid ${color.primary}`,
    ':hover': {
      color: color.white,
      backgroundColor: color.darkPrimary,
    },
  },
  secondaryThemeDark: {
    color: color.white,
    backgroundColor: 'transparent',
    border: `1px solid ${color.white}`,
    ':hover': {
      borderColor: fade(color.white, 0.2),
      color: color.white,
      backgroundColor: fade(color.white, 0.2),
    },
  },
  secondaryLink: {
    color: `${color.primary} !important `,
    ':hover': {
      backgroundColor: fade(color.white, 0.2),
      color: color.white,
    },
  },
  secondaryLinkThemeDark: {
    color: `${color.white} !important`,
    ':hover': {
      backgroundColor: fade(color.white, 0.2),
      borderColor: fade(color.white, 0.2),
      color: `${color.white} !important `,
    },
  },
  default: {
    color: color.primaryText,
    backgroundColor: color.white,
    border: `1px solid ${color.divider}`,
    ':hover': {
      color: color.white,
      backgroundColor: color.darkPrimary,
      border: `1px solid ${color.primary}`,
    },
  },
  defaultThemeDark: {
    color: color.primaryText,
    backgroundColor: color.white,
    border: `1px solid ${color.divider}`,
    ':hover': {
      backgroundColor: fade(color.white, 0.2),
      borderColor: fade(color.white, 0.2),
    },
  },
  defaultLink: {
    color: `${color.primaryText} !important`,
    ':hover': {
      color: `${color.white} !important`,
    },
  },
  defaultLinkThemeDark: {
    color: `${color.primaryText} !important`,
    ':hover': {
      backgroundColor: fade(color.white, 0.2),
      color: `${color.white} !important `,
    },
  },
  noStyle: {
    backgroundColor: 'transparent',
    color: color.primaryText,
    border: 'none',
    ':hover': {
      color: color.primary,
    },
  },
  noStyleThemeDark: {
    color: color.white,
    border: 'none',
    ':hover': {
      backgroundColor: fade(color.white, 0.2),
      color: `${color.white} !important `,
    },
  },
  noStyleLink: {
    color: `${color.primaryText} !important `,
    border: 'none',
    ':hover': {
      color: `${color.primary} !important `,
    },
  },
  noStyleLinkThemeDark: {
    color: `${color.white} !important`,
    border: 'none',
    ':hover': {
      color: `${color.primary} !important `,
    },
  },
  icon: {
    color: color.primaryText,
    backgroundColor: 'transparent',
    border: 'none',
    ':hover': {
      color: color.primary,
    },
  },
  iconThemeDark: {
    color: color.white,
    backgroundColor: 'transparent',
    border: 'none',
    ':hover': {
      color: `${color.white} !important `,
    },
  },
  iconLink: {
    backgroundColor: 'transparent',
    color: `${color.primaryText} !important `,
    border: 'none',
    ':hover': {
      color: `${color.primary} !important `,
    },
  },
  iconLinkThemeDark: {
    backgroundColor: 'transparent',
    color: `${color.white} !important`,
    border: 'none',
    ':hover': {
      color: `${color.primary} !important `,
    },
  },
  link: {
    backgroundColor: 'transparent',
    color: color.primary,
    border: 'none',
    ':hover': {
      color: color.darkPrimary,
    },
  },
  linkThemeDark: {
    color: color.white,
    ':hover': {
      color: `${color.white} !important `,
      backgroundColor: fade(color.white, 0.2),
    },
  },
  linkLink: {
    color: `${color.primaryText} !important `,
    ':hover': {
      color: `${color.primary} !important `,
    },
  },
  linkLinkThemeDark: {
    color: `${color.white} !important`,
    ':hover': {
      color: `${color.primary} !important `,
      backgroundColor: fade(color.white, 0.2),
    },
  },
  disabled: {
    backgroundColor: color.disabled,
    border: `1px solid ${color.disabled}`,
    color: color.disabledText,
    cursor: 'not-allowed !important', // TODO(Audrey): remove once fully migrated
  },
  disabledThemeDark: {
    backgroundColor: 'transparent',
    border: `1px solid ${color.disabledTextThemeDark}`,
    color: color.disabledTextThemeDark,
  },
  disabledLink: {
    color: `${color.disabledText} !important `,
  },
  disabledLinkThemeDark: {
    color: `${color.disabledText} !important `,
  },
  zero: {
    padding: 0,
  },
  sm: {
    padding: CONFIG.size.sm.padding,
    fontSize: CONFIG.size.sm.fontSize,
  },
  md: {
    padding: CONFIG.size.md.padding,
    fontSize: CONFIG.size.md.fontSize,
  },
  lg: {
    padding: CONFIG.size.lg.padding,
    fontSize: CONFIG.size.lg.fontSize,
  },
});
