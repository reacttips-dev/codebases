import classNames from 'classnames';
import React from 'react';

import { InformationIcon } from '@trello/nachos/icons/information';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Yellow100 } from '@trello/colors';
import styles from './Banner.less';

interface BannerProps {
  children: React.ReactNode;
  inlinePadding?: boolean;
  onDismiss?: () => void;
  bannerColor?: string;
  className?: string;
  textClassName?: string;
  infoUrl?: string;
  useLightText?: boolean;
  alignCloseTop?: boolean;
  shadow?: boolean;
  roundedCorners?: boolean;
}

export const Banner = ({
  children,
  inlinePadding,
  infoUrl,
  onDismiss,
  bannerColor = Yellow100,
  className = '',
  textClassName = '',
  useLightText,
  alignCloseTop,
  shadow,
  roundedCorners,
}: BannerProps) => {
  return (
    <div
      className={classNames(
        styles.bannerContainer,
        { [styles.inlinePadding]: inlinePadding },
        { [styles.bannerShadow]: shadow },
        { [styles.roundedCorners]: roundedCorners },
        className,
      )}
      style={{
        backgroundColor: bannerColor,
      }}
    >
      <div
        className={classNames(
          styles.textContent,
          {
            [styles.lightText]: useLightText,
          },
          textClassName,
        )}
      >
        {children}{' '}
      </div>
      {infoUrl && (
        <a
          className={classNames(styles.actionButton, {
            [styles.alignTop]: alignCloseTop,
          })}
          href={infoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InformationIcon dangerous_className={styles.help} />
        </a>
      )}
      {onDismiss && (
        <button
          className={classNames(styles.actionButton, {
            [styles.alignTop]: alignCloseTop,
          })}
          onClick={onDismiss}
          data-test-id="bannerCloseButton"
        >
          <CloseIcon
            dangerous_className={styles.icon}
            size="large"
            color={useLightText ? 'light' : 'dark'}
          />
        </button>
      )}
    </div>
  );
};
