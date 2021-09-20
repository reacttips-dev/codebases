import React, { CSSProperties, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Badge.less';

interface BasicBadgeProps {
  bgColor?: string;
  className?: string;
  fontColor?: string;
  title?: string;
}

export const Badge: React.FC<BasicBadgeProps> = ({
  bgColor,
  className,
  fontColor,
  children,
  title,
}) => {
  const dynamicStyles: CSSProperties = {};
  if (bgColor) {
    dynamicStyles.backgroundColor = bgColor;
  }
  if (fontColor) {
    dynamicStyles.color = fontColor;
  }

  return (
    <span
      {...(title ? { title: title } : {})} // if we have one
      className={cx(styles.badge, className)}
      style={dynamicStyles}
    >
      {children}
    </span>
  );
};

interface IconBadgeProps extends BasicBadgeProps {
  icon: ReactNode;
  iconHeight?: number;
  iconWidth?: number;
  dataTestClass?: string;
  iconClassName?: string;
  title?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  bgColor = '',
  children,
  className = '',
  iconClassName = '',
  fontColor = '',
  icon,
  dataTestClass,
  title,
  // iconHeight = 16,
  // iconWidth = 16,
}) => (
  <Badge
    title={title}
    bgColor={bgColor}
    className={className}
    fontColor={fontColor}
  >
    <div className={styles.flex} data-test-class={dataTestClass}>
      <span className={cx(styles.badgeIcon, iconClassName)}>{icon}</span>
      {children && (
        <span className={styles.badgeIconLabel} data-test-class={dataTestClass}>
          {children}
        </span>
      )}
    </div>
  </Badge>
);
