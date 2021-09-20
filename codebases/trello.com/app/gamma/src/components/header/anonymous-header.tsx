/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';

import { ScreenBreakpoints } from 'app/src/components/Responsive';
import React from 'react';
import Media from 'react-media';
import { escapeReturnUrl } from 'app/gamma/src/util/url';
import DesktopPlaceholder from './desktop-placeholder';
import HeaderLogo from './header-logo';
import styles from './header.less';
import printStyles from './print.less';

const formatPromo = forTemplate('header_promo_nav');
const formatSignUpLogin = forTemplate('header_signup_login');

const AnonymousHeader: React.FunctionComponent = () => {
  const returnUrl = escapeReturnUrl(location.href);

  return (
    <div
      className={classNames(
        styles.header,
        styles.anonymous,
        printStyles.noPrint,
      )}
      data-test-id={HeaderTestIds.Container}
    >
      <Media query={ScreenBreakpoints.MediumMin}>
        {(matches: boolean) =>
          matches && (
            <div className={styles.leftSection}>
              <a href="/" className={styles.textLink}>
                {formatPromo('home')}
              </a>
              <a href="/tour" className={styles.textLink}>
                {formatPromo('tour')}
              </a>
              <a href="https://blog.trello.com" className={styles.textLink}>
                {formatPromo('blog')}
              </a>
            </div>
          )
        }
      </Media>
      <Media query={ScreenBreakpoints.MediumMin}>
        {(matches: boolean) => (
          <HeaderLogo skipRouter={true} isLeftAligned={!matches} />
        )}
      </Media>
      <div className={styles.rightSection}>
        <a
          href={`/signup?returnUrl=${returnUrl}`}
          className={classNames(styles.headerButton, styles['signUpColor'])}
        >
          {formatSignUpLogin('sign-up')}
        </a>
        <a
          href={`/login?returnUrl=${returnUrl}`}
          className={classNames(styles.headerButton, styles['normalColor'])}
        >
          {formatSignUpLogin('log-in')}
        </a>
        <DesktopPlaceholder />
      </div>
    </div>
  );
};

export default AnonymousHeader;
