import URI from 'jsuri';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import GoogleOneTap from 'bundles/authentication/shared/components/GoogleOneTap';
import epic from 'bundles/epic/client';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { setProfileCompleterCookieForExistingUsers } from 'bundles/onboarding-2018/utils/onboardingUtils';
import HeaderRightNavButton from 'bundles/page/components/header/HeaderRightNavButton';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import HeaderRightNavButtonShape from 'bundles/page/lib/HeaderRightNavButtonShape';
import Multitracker from 'js/app/multitrackerSingleton';
import { isNextJSApp } from 'bundles/next/utils/envUtils';

import logger from 'js/app/loggerSingleton';
import user from 'js/lib/user';

import _t from 'i18n!nls/page';

class UnauthenticatedAccountInfo extends React.Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    rightNavButtons: PropTypes.arrayOf(HeaderRightNavButtonShape),
    hideEnterprise: PropTypes.bool,
    q2ShowDesktopAltSignupLabel: PropTypes.func,
    isEnterprise: PropTypes.bool,
    experimentalStyles: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object,
    getStore: PropTypes.func,
  };

  state = {
    componentDidMount: false,
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  getLinkClassNames = (authMode: $TSFixMe, wrapperClassName: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideEnterprise' does not exist on type '... Remove this comment to see the full error message
    const { hideEnterprise } = this.props;
    return classNames('c-ph-right-nav-button', wrapperClassName, {
      'c-ph-right-nav-no-border': authMode === 'signup' || hideEnterprise,
    });
  };

  getCombinedQueryWithAuthMode = (authMode: $TSFixMe) => {
    const {
      router: {
        location: { query },
      },
    } = this.context;
    return Object.assign({}, query, { authMode });
  };

  /**
   * @param  {String} authMode signup|login
   */
  getAuthButtonHref = (authMode: $TSFixMe) => {
    if (typeof window === 'undefined') {
      logger.error('Cannot get auth button href without window');
      return '/?authMode=signup';
    }

    return new URI(window.location.href).addQueryParam('authMode', authMode).toString();
  };

  handleNextAuthClick = (e: $TSFixMe, authMode: $TSFixMe) => {
    const { router } = this.context;
    const { asPath, pathname, query } = router;

    if (isNextJSApp) {
      e.preventDefault();

      const pushQuery = { ...query, authMode };

      router.push(
        { pathname, query: pushQuery },
        { pathname: asPath.split('?')[0], query: pushQuery },
        {
          shallow: true,
        }
      );
    }
  };

  /**
   * @param  {String} authMode signup|login
   */
  bringUpUserModal = (authMode: $TSFixMe) => {
    if (user.isAuthenticatedUser()) {
      return true;
    }

    if (authMode === 'login') {
      Multitracker.pushV2(['open_course.user.login_modal.open']);
    } else if (authMode === 'signup') {
      Multitracker.pushV2(['open_course.user.signup_modal.open']);
    }

    return false;
  };

  renderRightNavButtons() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rightNavButtons' does not exist on type ... Remove this comment to see the full error message
    const { rightNavButtons } = this.props;
    let removeFirstRightNavButtonBorder = false;
    return rightNavButtons.map((navButtonProp: $TSFixMe) => {
      const newNavButtonProp = { ...navButtonProp };
      // removing the border of first visible right nav button
      if (!removeFirstRightNavButtonBorder && !newNavButtonProp.mobileOnly) {
        newNavButtonProp.noBorder = true;
        removeFirstRightNavButtonBorder = true;
      }

      return <HeaderRightNavButton {...newNavButtonProp} key={newNavButtonProp.label} />;
    });
  }

  renderAuthorizationLinks = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideEnterprise' does not exist on type '... Remove this comment to see the full error message
    const { hideEnterprise, isEnterprise, experimentalStyles } = this.props;

    const { componentDidMount } = this.state;
    const {
      router: {
        location: { pathname },
      },
    } = this.context;
    if (!pathname && !isNextJSApp) {
      logger.error('pathname is required to render unauthenticated auth buttons');
      return false;
    }

    // (quang)
    // If the page is SSR, we simply return links for Login and Sign Up.
    // If the page is CSR, links would not work due to an issue with react-router soft redirect.
    // Therefore, we manually pop up legacy authorization modal as a work-around.
    // Afaik, the only CSR page that is visible for non logged-in page left is
    // the public lecture page (ex. https://www.coursera.org/learn/hipython/lecture/AgEre/2-ndarray)

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssr' does not exist on type 'Window & ty... Remove this comment to see the full error message
    const csrEnabled = componentDidMount && !window.ssr && window.appName === 'ondemand' && !user.isAuthenticatedUser();

    const relAttr = pathname === '/' ? '' : 'nofollow';

    const itemClasses = {
      login: {
        wrapper: classNames({
          'authbutton-login': experimentalStyles,
          'join-btn': experimentalStyles,
          'c-ph-log-in': !experimentalStyles,
          isLohpRebrand: true,
        }),
      },
      signup: {
        wrapper: classNames({
          'authbutton-signup': experimentalStyles,
          'join-btn': experimentalStyles,
          'c-ph-sign-up': !experimentalStyles,
          isLohpRebrand: true,
        }),
        link: classNames('standardSignupBtnLink signup-jff-fp-btn', {
          'authlink-signup': experimentalStyles,
          'link-button': !experimentalStyles,
        }),
      },
      enterprise: {
        link: classNames({
          'enterpriselink-signup': experimentalStyles,
          'join-btn': !experimentalStyles,
          'link-button': !experimentalStyles,
          primary: !experimentalStyles,
          isLohpRebrand: true,
        }),
      },
    };

    let AUTH_BUTTON_DATA_LIST = [
      { label: _t('Log In'), authMode: 'login', wrapperClassName: itemClasses.login.wrapper },
      {
        label: _t('Join for Free'),
        authMode: 'signup',
        wrapperClassName: itemClasses.signup.wrapper,
        linkClassName: itemClasses.signup.link,
      },
    ];

    if (isEnterprise) {
      AUTH_BUTTON_DATA_LIST = [
        {
          label: _t('Log In'),
          authMode: 'login',
          wrapperClassName: itemClasses.signup.wrapper,
          linkClassName: itemClasses.enterprise.link,
        },
      ];
    }

    return AUTH_BUTTON_DATA_LIST.map(({ label, authMode, linkClassName = '', wrapperClassName }) => {
      if (csrEnabled) {
        return (
          <HeaderRightNavButton
            key={authMode}
            wrapperClassName={wrapperClassName}
            noBorder={authMode === 'signup' || hideEnterprise}
            label={label}
            href={this.getAuthButtonHref(authMode)}
            name={authMode}
            onClick={() => this.bringUpUserModal(authMode)}
            linkClassName={authMode === 'signup' ? `${linkClassName} primary` : linkClassName}
            linkRel={relAttr}
            data-e2e={authMode === 'signup' ? 'header-signup-button' : 'header-login-button'}
          >
            {label}
          </HeaderRightNavButton>
        );
      } else {
        const queryWithAuthMode = this.getCombinedQueryWithAuthMode(authMode);
        const queryStringWithAuthMode = Object.keys(queryWithAuthMode)
          .map((key) => `${key}=${queryWithAuthMode[key]}`)
          .join('&');

        const href = !isNextJSApp
          ? {
              pathname,
              query: queryWithAuthMode,
            }
          : `?${queryStringWithAuthMode}`;

        return (
          <li className={this.getLinkClassNames(authMode, wrapperClassName)} key={authMode}>
            <TrackedLink2
              href={href}
              onClick={(e: $TSFixMe) => this.handleNextAuthClick(e, authMode)}
              trackingName="header_right_nav_button"
              data={{ name: authMode }}
              className={authMode === 'signup' ? `${linkClassName} primary` : linkClassName}
              rel={relAttr}
              data-e2e={authMode === 'signup' ? 'header-signup-button' : 'header-login-button'}
            >
              {label}
            </TrackedLink2>
          </li>
        );
      }
    });
  };

  reloadPageWithOnboardingModal = (isNewUser: $TSFixMe) => {
    const appDenylist = epic.get('GrowthDiscovery', 'onboardingModalAppNameDenylist');
    if (isNewUser) {
      const url = new URI(window.location.href);
      url.addQueryParam('showOnboardingModal', '1');
      url.addQueryParam('isNewUser', 'true');
      window.location.replace(url.toString());
    } else {
      // So long as you're an applicable recipient of the rollout (not logging in from a place donated by the
      // denylist), add a cookie with short expiration date for use with onboarding modal.
      // This is to work in conjunction with the "Profile Completion Modal for Existing Users" experiment.
      if (appDenylist && !appDenylist.includes(window.appName)) setProfileCompleterCookieForExistingUsers();

      window.location.reload();
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'className' does not exist on type 'Reado... Remove this comment to see the full error message
    const { className } = this.props;

    return (
      <>
        <GoogleOneTap />
        <ul className={className}>
          {this.renderRightNavButtons()}
          {this.renderAuthorizationLinks()}
        </ul>
      </>
    );
  }
}

export default UnauthenticatedAccountInfo;
