import classNames from 'classnames';
import React from 'react';
import { forNamespace } from '@trello/i18n';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Yellow100 } from '@trello/colors';
import styles from './NarrowBanner.less';

const format = forNamespace('');

interface NarrowBannerProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  bannerColor?: string;
  useLightText?: boolean;
  shadow?: boolean;
  roundedCorners?: boolean;
  header?: React.ReactNode;
  dismissIconClass?: string;
  containerClass?: string;
  smallDismissIcon?: boolean;
}

const DismissButton = ({
  useLightText,
  onDismiss,
  dismissIconClass,
  smallDismissIcon,
}: {
  useLightText: boolean;
  onDismiss: () => void;
  dismissIconClass?: string;
  smallDismissIcon?: boolean;
}) => {
  return (
    //TODO: WLRS-355, replace div with IconButton to build for accessibility
    <div
      className={classNames(styles.closeButton)}
      onClick={onDismiss}
      role="button"
      aria-label={format('close')}
    >
      <CloseIcon
        dangerous_className={classNames(styles.icon, dismissIconClass)}
        size={smallDismissIcon ? 'small' : 'large'}
        color={useLightText ? 'light' : 'dark'}
      />
    </div>
  );
};

export const NarrowBanner = ({
  children,
  onDismiss,
  bannerColor = Yellow100,
  useLightText = false,
  shadow,
  roundedCorners,
  header,
  dismissIconClass,
  containerClass,
  smallDismissIcon,
}: NarrowBannerProps) => {
  return (
    <div
      className={classNames(
        styles.narrowBannerContainer,
        {
          [styles.noHeader]: !header,
        },
        {
          [styles.bannerShadow]: shadow,
        },
        {
          [styles.roundedCorners]: roundedCorners,
        },
        containerClass,
      )}
      style={{ backgroundColor: bannerColor }}
    >
      {header && (
        <div className={classNames(styles.topRow)}>
          <div
            className={classNames(styles.headerBody, {
              [styles.lightText]: useLightText,
            })}
          >
            {header}
          </div>
          {onDismiss && (
            <DismissButton
              useLightText={useLightText}
              onDismiss={onDismiss}
              dismissIconClass={dismissIconClass}
              smallDismissIcon={smallDismissIcon}
            />
          )}
        </div>
      )}
      <div
        className={classNames(styles.textContent, {
          [styles.lightText]: useLightText,
        })}
      >
        {children}{' '}
      </div>
      {onDismiss && !header && (
        <DismissButton
          useLightText={useLightText}
          onDismiss={onDismiss}
          dismissIconClass={dismissIconClass}
          smallDismissIcon={smallDismissIcon}
        />
      )}
    </div>
  );
};
