/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { useSharedState } from '@trello/shared-state';
import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './header.less';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { navigationState } from './navigationState';
import { headerState } from './headerState';
import { forwardRefComponent } from 'app/src/forwardRefComponent';

const format = forTemplate('header_back_menu_button');

interface Props {
  className?: string;

  // Set to true if we want to full page pop the redirect to '/', which
  // we do in the anonymous header so it takes us to the meta page.
  skipRouter?: boolean;

  isLeftAligned?: boolean;
  redesign?: boolean;
}

const HeaderLogo = forwardRefComponent<HTMLAnchorElement, Props>(
  'HeaderLogo',
  ({ className, isLeftAligned, skipRouter, redesign }, ref) => {
    const [{ isNavigating }] = useSharedState(navigationState);
    const [{ brandingLogo, brandingName }] = useSharedState(headerState);

    const classes = classNames(
      styles.logo,
      className,
      redesign && styles.logoRedesign,
      isLeftAligned && styles.narrowScreen,
      isNavigating && styles.throbbing,
      brandingLogo && !brandingName && styles.branded,
      !redesign && brandingName && styles.corporateVis,
    );

    const logo = (
      <>
        <div className={styles.logoContainer}>
          {!redesign && brandingLogo && (
            <img
              className={styles.brandingLogo}
              src={brandingLogo}
              alt=""
              role="presentation"
            />
          )}
          <div
            className={classNames(
              styles.newLogo,
              redesign && styles.newLogoRedesign,
            )}
            data-loading={isNavigating}
          />
        </div>
        {!redesign && <div className={styles.brandingName}>{brandingName}</div>}
      </>
    );

    return skipRouter ? (
      <a href="/" className={classes} aria-label={format('backToHome')}>
        {logo}
      </a>
    ) : (
      <RouterLink
        href="/"
        className={classes}
        aria-label={format('backToHome')}
        ref={ref}
      >
        {logo}
      </RouterLink>
    );
  },
);

export default HeaderLogo;
