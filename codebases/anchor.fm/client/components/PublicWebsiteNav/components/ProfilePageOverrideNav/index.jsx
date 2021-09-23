import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { ADJUST_URL } from 'helpers/constants';
import { AppStoreButton, PlayStoreButton } from '../../../AppDownloadButtons';

import styles from './styles.sass';
import { AnchorLogoWithWordmark } from '../../../svgs/AnchorLogoWithWordmark';

const NEW_PLATFORM_BUTTON_CAMPAIGN = 'Website-ProfilePage-2019-04-25';

const cx = classnames.bind(styles);

const SignupLink = ({ isAndroidChrome, isIOS }) => {
  if (isAndroidChrome) {
    return (
      <span key="appLinkContainer" className={styles.appButtonWrapper}>
        <PlayStoreButton
          height={38}
          campaign={NEW_PLATFORM_BUTTON_CAMPAIGN}
          to={`${ADJUST_URL}/v5huld9?redirect=https%3A%2F%2Fanchor.fm%2Fapp`}
        />
      </span>
    );
  }
  if (isIOS) {
    return (
      <span key="appLinkContainer" className={styles.appButtonWrapper}>
        <AppStoreButton
          height={38}
          campaign={NEW_PLATFORM_BUTTON_CAMPAIGN}
          to={`${ADJUST_URL}/v7dtqg5?redirect=https%3A%2F%2Fanchor.fm%2Fapp`}
        />
      </span>
    );
  }
  return (
    <div key="linksContainer" className={styles.linksContainer}>
      <a
        className={styles.cta}
        href={`${ADJUST_URL}/fnbja9k?redirect=https%3A%2F%2Fanchor.fm%2Fapp`}
      >
        <span className={styles.ctaCopy}>Make your own podcast for free</span>
      </a>
    </div>
  );
};

const ProfilePageOverrideNav = ({
  didMount,
  isAndroidChrome,
  isIOS,
  profileColor,
}) => {
  // do not flash mobile/desktop before client is known (didMount)
  if (!didMount) {
    return <div className={styles.container} />;
  }
  if (isAndroidChrome || isIOS) {
    return (
      <div
        className={cx({
          container: true,
          containerWithMobileCTA: true,
        })}
      >
        <div>
          <a href="/" className={styles.logoLink}>
            <AnchorLogoWithWordmark includeSpotify={true} />
          </a>
        </div>
        <SignupLink
          isAndroidChrome={isAndroidChrome}
          isIOS={isIOS}
          profileColor={profileColor}
        />
      </div>
    );
  }
  return (
    <div className={styles.outerContainer}>
      <div
        className={styles.container}
        style={{ backgroundColor: profileColor }}
      >
        <div className={styles.innerContainer}>
          <div className={styles.logoContainer}>
            <a href="/" className={styles.logoLink}>
              <AnchorLogoWithWordmark includeSpotify={true} />
            </a>
          </div>
          <SignupLink
            isAndroidChrome={isAndroidChrome}
            isIOS={isIOS}
            profileColor={profileColor}
          />
        </div>
      </div>
    </div>
  );
};

ProfilePageOverrideNav.defaultProps = {
  isAndroidChrome: false,
  isIOS: false,
};
ProfilePageOverrideNav.propTypes = {
  isAndroidChrome: PropTypes.bool,
  isIOS: PropTypes.bool,
};
export { ProfilePageOverrideNav };
