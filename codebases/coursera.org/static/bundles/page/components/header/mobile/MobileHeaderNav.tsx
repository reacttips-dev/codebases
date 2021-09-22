import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _t from 'i18n!nls/page';
import { SvgClose, SvgList } from '@coursera/coursera-ui/svg';

import createLoadableComponent from 'js/lib/createLoadableComponent';
import user from 'js/lib/user';

import LazyLoadingHandler from 'bundles/page/components/shared/LazyLoadingHandler';

import { color } from '@coursera/coursera-ui';
import TrackedButton from 'bundles/page/components/TrackedButton';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type SwitcherSelectionsType from 'bundles/naptimejs/resources/programSwitcherSelections.v1';
import type UserAgentInfo from 'js/lib/useragent';
import HeaderMobileLogo from 'bundles/page/components/header/mobile/HeaderMobileLogo';
import type { Domain } from 'bundles/browse/components/types/MegaMenu';
import MobileAuthorizationButtons from 'bundles/page/components/header/mobile/MobileAuthorizationButtons';
import GoogleOneTap from 'bundles/authentication/shared/components/GoogleOneTap';

import 'css!bundles/page/components/header/mobile/__styles__/MobileHeaderNav';

const LoadableMobileLoggedInNav = createLoadableComponent(
  () => import('bundles/page/components/header/mobile/MobileLoggedInNav'),
  LazyLoadingHandler
);

const LoadableMobileLoggedOutNav = createLoadableComponent(
  () => import('bundles/page/components/header/mobile/MobileLoggedOutNav'),
  LazyLoadingHandler
);

type Props = {
  globalNavTest4Variant?: string;
  toggleMobileCourseMenu?: () => void;
  shouldSkipOptionalExternalDataFetch?: boolean;
  switcherSelections: SwitcherSelectionsType;
  userAgent?: UserAgentInfo;
  domains?: Array<Domain>;
};

type State = {
  menuIsOpen: boolean;
};

class MobileHeaderNav extends React.Component<Props, State> {
  bodyNode: HTMLBodyElement | null | undefined;

  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    menuIsOpen: false,
  };

  componentDidMount() {
    this.bodyNode = document.querySelector('body');
  }

  openHeaderMenu = () => {
    const { bodyNode } = this;

    this.setState({ menuIsOpen: true }, () => {
      if (bodyNode) bodyNode.classList.add('is-mobileMenuOpen');
    });
  };

  closeHeaderMenu = () => {
    const { bodyNode } = this;

    this.setState({ menuIsOpen: false }, () => {
      if (bodyNode) {
        bodyNode.classList.remove('is-mobileMenuOpen');
        bodyNode.classList.remove('is-mobileSubMenuOpen');
      }
    });
  };

  renderNav = () => {
    const isLoggedIn = user.isAuthenticatedUser();
    const { menuIsOpen } = this.state;
    const { shouldSkipOptionalExternalDataFetch, switcherSelections } = this.props;

    if (isLoggedIn) {
      return (
        <LoadableMobileLoggedInNav
          data-unit="logged-in-nav"
          showNav={menuIsOpen}
          // @ts-expect-error TODO: not being used? sorry I have no context here
          shouldSkipOptionalExternalDataFetch={shouldSkipOptionalExternalDataFetch}
          switcherSelections={switcherSelections}
          hasParentContainer
        />
      );
    } else {
      return (
        <LoadableMobileLoggedOutNav
          data-unit="logged-out-nav"
          // @ts-expect-error TODO: not being used? sorry I have no context here
          showNav={menuIsOpen}
          onAuth={this.closeHeaderMenu}
          hasParentContainer
        />
      );
    }
  };

  renderNavAuth = () => {
    const { menuIsOpen } = this.state;
    const isLoggedIn = user.isAuthenticatedUser();
    if (!isLoggedIn) {
      return <MobileAuthorizationButtons showNav={menuIsOpen} onAuth={this.closeHeaderMenu} hasParentContainer />;
    } else return null;
  };

  render() {
    const isLoggedIn = user.isAuthenticatedUser();
    const { menuIsOpen } = this.state;
    const { toggleMobileCourseMenu } = this.props;

    return (
      <nav>
        {!isLoggedIn && <GoogleOneTap />}
        <TrackedButton
          onClick={toggleMobileCourseMenu || this.openHeaderMenu} // toggle course menu instead of nav when in a course
          className="c-mobile-toggle-button"
          trackingName="mobile_header_nav_button"
          data={{ name: 'open-nav' }}
          aria-label={_t('Open Navigation Menu')}
        >
          <SvgList style={{ height: '26px', width: '26px' }} fill={color.black} />
        </TrackedButton>
        <span className="nostyle">
          <ul className={classNames('mobile-header-menu', { 'show-nav': menuIsOpen })}>
            {!toggleMobileCourseMenu && menuIsOpen && this.renderNav()}
          </ul>
          {menuIsOpen && this.renderNavAuth()}
          {menuIsOpen && (
            <div className="c-mobile-header-wrapper">
              <div className="c-mobile-header-controls horizontal-box" style={{ zIndex: 1000 }}>
                <HeaderMobileLogo />
              </div>
              <TrackedButton
                className="c-close-mobile-nav"
                onClick={this.closeHeaderMenu}
                data={{ name: 'close' }}
                aria-label={_t('Close Navigation Menu')}
                style={{ zIndex: 1000 }}
              >
                <SvgClose style={{ height: '26px', width: '26px', color: 'black' }} />
              </TrackedButton>
            </div>
          )}
        </span>
      </nav>
    );
  }
}

export default MobileHeaderNav;
