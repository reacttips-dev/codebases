import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';

import { loggedOutAuthButtons } from 'bundles/page/components/header/mobile/constants';
import { getTabIndex } from 'bundles/page/components/header/mobile/utils';
import { isNextJSApp } from 'bundles/next/utils/envUtils';
import 'css!./__styles__/MobileLoggedOutNav';

type Props = {
  onAuth: () => void;
  showNav: boolean;
  hasParentContainer?: boolean;
};

class MobileAuthorizationButtons extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
    getStore: PropTypes.func,
  };

  handleAuthClick = (e: React.MouseEvent, authMode: string) => {
    const { router } = this.context;
    const { onAuth } = this.props;

    // Closes header menu.
    onAuth();
    // Override so auth modal opens with a client-side transition.
    if (isNextJSApp) {
      e.preventDefault();

      router.push({ pathname: router?.pathname || '', query: { authMode } }, undefined, {
        shallow: true,
      });
    }
  };

  getCombinedQueryWithAuthMode = (authMode: string) =>
    Object.assign({}, this.context.router.location.query, { authMode });

  renderAuthorizationLinks = () => {
    const { showNav } = this.props;
    const { pathname } = this.context.router.location;
    const tabIndex = getTabIndex(showNav);
    const relAttr = pathname === '/' ? '' : 'nofollow';
    const authButtons = [...loggedOutAuthButtons()];

    return authButtons.map(({ label, authMode, linkClassName = '', wrapperClassName }) => (
      <li className={wrapperClassName} key={label}>
        <TrackedLink2
          href={
            !isNextJSApp
              ? {
                  pathname,
                  query: this.getCombinedQueryWithAuthMode(authMode),
                }
              : `?authMode=${authMode}`
          }
          onClick={(e: React.MouseEvent) => this.handleAuthClick(e, authMode)}
          trackingName="mobile_header_nav_auth_button"
          data={{ name: authMode }}
          className={authMode === 'signup' ? `${linkClassName} primary` : linkClassName}
          role="menuitem"
          rel={relAttr}
          tabIndex={tabIndex}
        >
          {label}
        </TrackedLink2>
      </li>
    ));
  };

  render() {
    const { showNav, hasParentContainer } = this.props;
    const menuClasses = classNames(
      { 'mobile-header-menu': !hasParentContainer },
      { 'show-nav': showNav && !hasParentContainer },
      { 'mobile-header-menu-child': hasParentContainer }
    );
    return <div className="logged-out-auth-buttons-wrap">{this.renderAuthorizationLinks()}</div>;
  }
}
export default MobileAuthorizationButtons;
