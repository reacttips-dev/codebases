import React from 'react';
import classnames from 'classnames/bind';

import Icon from '../../shared/Icon';
import { trackEvent } from '../../modules/analytics';

import styles from './PlatformBadge.sass';
import { Button } from '../../shared/Button/NewButton';

const cx = classnames.bind(styles);
const noop = () => null;

function getPlatformData(platformName) {
  switch (platformName) {
    case 'apple':
      return {
        iconType: 'apple_logo',
        label: 'App Store',
        eventPlatformName: 'App Store',
      };
    case 'google':
      return {
        iconType: 'google_play_logo',
        label: 'Google Play',
        eventPlatformName: 'Play Store',
      };
    default:
      return null;
  }
}

const PlatformBadge = ({
  contentClass,
  platformName,
  url,
  clickEventLocation,
  clickEventSection,
}) => {
  const { iconType, label, eventPlatformName } = getPlatformData(platformName);
  return (
    <Button
      href={url}
      kind="link"
      target="_blank"
      color="onDark"
      rel="noopener noreferrer"
      onClick={() => {
        if (clickEventLocation) {
          const eventLabel = clickEventSection
            ? `${clickEventSection} ${eventPlatformName} Button`
            : `${eventPlatformName} Button`;
          trackEvent(
            null,
            {
              eventCategory: clickEventLocation,
              eventAction: 'Click',
              eventLabel,
            },
            // eslint-disable-next-line
            { providers: [ga] }
          );
        }
      }}
    >
      <div
        className={cx({
          platformBadgeContent: true,
          [contentClass]: true,
        })}
      >
        <div className={styles.platformBadgeIconContainer}>
          <Icon type={iconType} fillColor="#ffffff" />
        </div>
        <div className={styles.platformBadgeLabel}>{label}</div>
      </div>
    </Button>
  );
};

PlatformBadge.defaultProps = {
  contentClass: '',
  renderIcon: noop,
};

export { PlatformBadge };
