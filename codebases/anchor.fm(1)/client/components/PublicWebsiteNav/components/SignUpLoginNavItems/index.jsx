import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Link from '../../../Link';
import { clickSignupButton, clickedNavLinkGoogleAnalytics } from '../../events';
import { events } from '../../../../screens/WordpressScreen/events';
import styles from './styles.sass';
import LinkStyles from '../../LinkStyles.sass';
import { Button } from '../../../../shared/Button/NewButton';

const cxLinkStyles = classnames.bind(LinkStyles);

const SignUpLoginNavItems = ({ pathname }) => {
  const pathnameLowerCase = pathname.toLowerCase();
  const isWpLandingPage = pathnameLowerCase === '/wordpressdotcom';
  return (
    <div className={styles.wrapper}>
      <Link
        to="/login"
        onClick={() => {
          clickedNavLinkGoogleAnalytics('Log In');
        }}
        className={`${styles.link} ${cxLinkStyles({
          link: true,
          linkActive: pathnameLowerCase === '/login',
        })}`}
      >
        Sign in
      </Link>
      <Button
        kind="link"
        color="yellow"
        href={isWpLandingPage ? '/signup?ref=wp' : '/signup'}
        onClick={() => {
          clickSignupButton();
          clickedNavLinkGoogleAnalytics('Sign Up');
          if (isWpLandingPage) {
            events.clickWordPressSignUpCTA('nav');
          }
        }}
      >
        Get started
      </Button>
    </div>
  );
};

SignUpLoginNavItems.defaultProps = {
  pathname: null,
};

SignUpLoginNavItems.propTypes = {
  pathname: PropTypes.string,
};

export { SignUpLoginNavItems };
