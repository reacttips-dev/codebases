/* eslint-disable import/no-default-export */
import React, { CSSProperties } from 'react';
import cx from 'classnames';
import styles from './Avatar.less';
import { isHighDPI } from '@trello/browser';
interface AvatarProps {
  avatarSource?: 'atlassianAccount' | 'gravatar' | 'upload' | 'none' | null;
  className?: string;
  backgroundColor?: string;
  deactivated?: boolean;
  img?: string | null;
  img2x?: string | null;
  initials?: string | null;
  lightBackground?: boolean;
  size?: number;
  title?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarSource,
  children,
  className,
  deactivated,
  img,
  img2x,
  initials,
  lightBackground,
  size = 28,
  title = '',
}) => {
  const avatarClasses = cx(
    styles.avatar,
    deactivated && styles.deactivated,
    lightBackground && styles.lightBackground,
    avatarSource === 'atlassianAccount' && styles.atlassianAccount,
    className,
  );
  const dynamicStyles: CSSProperties = {};

  // Set background image
  if (img2x && isHighDPI()) {
    dynamicStyles.backgroundImage = `url(${img2x})`;
  } else if (img) {
    dynamicStyles.backgroundImage = `url(${img})`;

    // Set font size for initials if there's no image
  } else if (initials && initials.length) {
    let fontSize = size / 2 - 2;
    if (initials.length >= 4) {
      fontSize *= 0.5; // 2/4
    } else if (initials.length === 3) {
      fontSize *= 0.66; // 2/3
    }
    if (size <= 20) {
      fontSize -= 2;
    }
    dynamicStyles.fontSize = `${Math.floor(fontSize)}px`;
  }

  // Show deactivated avatar images at low opacity
  if ((img || img2x) && deactivated) {
    dynamicStyles.opacity = 0.2;
  }

  // Overall size
  if (size) {
    dynamicStyles.height = `${size}px`;
    dynamicStyles.width = `${size}px`;
  }

  // Adjust lineHeight if necessary
  if (size || lightBackground) {
    if (lightBackground) {
      dynamicStyles.lineHeight = `${size ? size - 2 : '26'}px`;
    } else {
      dynamicStyles.lineHeight = `${size ? size : '28'}px`;
    }
  }

  return (
    <span title={title} className={avatarClasses} style={dynamicStyles}>
      {!img && !img2x && initials}
      {children}
    </span>
  );
};
