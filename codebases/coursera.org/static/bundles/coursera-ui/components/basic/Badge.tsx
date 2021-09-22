import PropTypes from 'prop-types';
import React from 'react';
import { css, StyleSheet, color } from '@coursera/coursera-ui';

const styles = StyleSheet.create({
  Badge: {
    position: 'relative',
    display: 'inline-block',
  },
  badge: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: '50%',
    color: color.white,
  },
  primary: { backgroundColor: color.primary },
  secondary: { backgroundColor: color.accent },
  info: { backgroundColor: color.info },
  danger: { backgroundColor: color.danger },
  warning: { backgroundColor: color.warning },
  success: { backgroundColor: color.success },
});

export const BADGE_TYPES = {
  primary: 'primary',
  secondary: 'secondary',
  info: 'info',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
};

export const BADGE_SIZES = {
  sm: 8,
  md: 12,
  lg: 16,
};

type BadgeType = 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'success';
type BadgeSizeType = 'sm' | 'md' | 'lg';
type RootClassName = Record<string, any> | string;
type Props = {
  rootClassName?: RootClassName;
  htmlAttributes?: { [htmlAttr: string]: string | number };
  style?: { [styleAttr: string]: string | number };
  badgeContent?: React.ReactNode;
  badgeStyle?: { [styleAttr: string]: string | number };
  children?: React.ReactNode;
  type: BadgeType;
  size: BadgeSizeType;
};

export default function Badge({
  rootClassName,
  htmlAttributes,
  style,
  badgeContent,
  badgeStyle,
  children,
  type,
  size,
}: Props) {
  const radius = BADGE_SIZES[size] || BADGE_SIZES.md;
  const radius2x = Math.floor(2 * radius);
  return (
    <div
      {...htmlAttributes}
      {...css(rootClassName, styles.Badge)}
      style={{
        padding: `${radius2x}px ${radius2x}px ${radius}px ${radius}px`,
        ...style,
      }}
    >
      {children}
      <span
        {...css(styles.badge, styles[type])}
        style={{
          fontSize: radius,
          width: radius2x,
          height: radius2x,
          ...badgeStyle,
        }}
      >
        {badgeContent}
      </span>
    </div>
  );
}

Badge.defaultProps = {
  type: 'primary',
  style: {},
  badgeStyle: {},
  size: BADGE_SIZES.md,
};

Badge.propTypes = {
  rootClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  badgeContent: PropTypes.node.isRequired,
  badgeStyle: PropTypes.object,
  children: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(BADGE_TYPES)),
  size: PropTypes.oneOf(Object.keys(BADGE_SIZES)),
};
