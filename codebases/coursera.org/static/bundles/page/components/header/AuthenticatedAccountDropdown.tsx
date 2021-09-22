import React from 'react';
import isEmpty from 'lodash/isEmpty';
import _t from 'i18n!nls/page';
import user from 'js/lib/user';
import classNames from 'classnames';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ThirdPartyOrganizationsV1 from 'bundles/naptimejs/resources/thirdPartyOrganizations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';

import TrackedButton from 'bundles/page/components/TrackedButton';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ListWithKeyboardControls from 'bundles/phoenix/components/a11y/ListWithKeyboardControls';
import UserPortrait from 'bundles/page/components/header/UserPortrait';
import SignoutButton from 'bundles/page/components/header/SignoutButton';
import HeaderRightNavButton from 'bundles/page/components/header/HeaderRightNavButton';

import isAdminV2Enabled from 'bundles/admin-v2/utils/AdminV2ExperimentUtils';

import keys from 'bundles/phoenix/components/a11y/constants';
import { getAccountDropdownOptions } from 'bundles/page/utils/pageHeaderNavUtils';

import 'css!./__styles__/AuthenticatedAccountDropdown';

type NavButton = {
  href: string;
  label: string;
  name: string;
};

type Props = {
  isStaff: boolean;
  hideAvatarBorder: boolean;
  label: string;
  programs: Array<EnterpriseProgramsV1>;
  thirdPartyOrganizations?: Array<ThirdPartyOrganizationsV1>;
  degrees: Array<Record<string, string>>;
  showAdminLinks: boolean;
  showFullName?: boolean;
};

type State = {
  showNavMenu: boolean;
};

class AuthenticatedAccountDropdown extends React.Component<Props, State> {
  node: HTMLElement | null | undefined;

  dropdownButton: HTMLElement | null | undefined;

  firstButtonRef: HTMLElement | null | undefined;

  dropdownMenu: HTMLElement | null | undefined;

  state = { showNavMenu: false };

  componentDidUpdate(prevProps: Props, { showNavMenu: prevShowNavMenu }: State) {
    const { showNavMenu } = this.state;
    if (showNavMenu !== prevShowNavMenu) {
      if (showNavMenu) {
        // Set focus on the first menu item upon expansion so the user could navigate through the menu items
        const firstMenuItem = this.firstButtonRef?.querySelector('#c-ph-aai-dropdown > li > a') as HTMLElement;
        firstMenuItem.focus();

        // attach / remove event listner to monitor click and close/open menu accordingly.
        // When user click anywhere  after menu is opened, toggleMenu() will close when
        // user clicked outside of the DropDown
        document.addEventListener('click', this.handleClick, false);
      } else {
        document.removeEventListener('click', this.handleClick, false);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  /* Function monitor clicks in DOM. menu will not be toggled if click target element is within menu container */
  handleClick = (e: MouseEvent) => {
    if (this.node && this.node.contains(e.target as Node)) {
      return;
    }
    this.toggleMenu();
  };

  handleKeyPress = (e: React.KeyboardEvent) => {
    // find first/last item in nav dropdown and focus on element so you can traverse list without first tabbing in
    if (this.dropdownMenu) {
      const key = e.keyCode;
      const dropdownElements = this.dropdownMenu.querySelectorAll(`li > a, button`);

      if (dropdownElements.length) {
        const focusElement = (key === keys.down
          ? dropdownElements[0]
          : dropdownElements[dropdownElements.length - 1]) as HTMLElement;

        if (key === keys.up || key === keys.down) {
          focusElement.focus({
            preventScroll: true,
          });
        }
      }
    }
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      showNavMenu: !prevState.showNavMenu,
    }));
  };

  inEnterpriseOrDegree() {
    const { thirdPartyOrganizations, programs, degrees } = this.props;
    return !isEmpty(thirdPartyOrganizations) || !isEmpty(programs) || !isEmpty(degrees);
  }

  render() {
    const { hideAvatarBorder, showAdminLinks, showFullName = true } = this.props;
    const { showNavMenu } = this.state;
    const learnerName = user.get().full_name;
    const ariaLabel = _t('User dropdown menu for #{learnerName}', { learnerName });
    const listClassNames = classNames([
      'rc-AuthenticatedAccountDropdown',
      'c-ph-right-nav-button',
      'c-ph-right-nav-desktop-only',
      'c-ph-avatar-button',
      { 'c-ph-right-nav-no-border': hideAvatarBorder },
      { 'c-ph-right-nav-expanded': showNavMenu },
      { 'authenticated-dropdown-right-align': !showFullName },
    ]);

    const dropdownButtonClassName = classNames([
      'button-link',
      'horizontal-box',
      'switcher_trigger',
      'align-items-absolute-center',
      'c-authenticated-dropdown-button',
      'c-ph-slim',
      'in-rebrand',
      { 'dropdown-button-no-border': !showFullName },
    ]);

    const menuContainerClassNames = classNames([
      'bt3-dropdown',
      'c-authenticated-dropdown-menu-container',
      { 'authenticated-dropdown-auto-width': !showFullName },
    ]);

    // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'Readonly<Props> & Readonly<{ chi... Remove this comment to see the full error message
    const navButtons: NavButton[] = getAccountDropdownOptions(this.props);

    if (showAdminLinks && isAdminV2Enabled()) {
      return null;
    }

    // Add this to the front
    /* For user with admin role display `My Courses` link */
    if (!this.inEnterpriseOrDegree() || showAdminLinks) {
      navButtons.unshift({
        href: '/?skipBrowseRedirect=true',
        label: _t('My Courses'),
        name: 'my-courses',
      });
    }
    const trackingID = 'profile_drop_down_btn';
    const dropdownId = !showFullName ? 'right-nav-dropdown-btn-mini' : 'right-nav-dropdown-btn';
    return (
      <li className={listClassNames} role="none">
        <div
          className={menuContainerClassNames}
          ref={(node) => {
            this.node = node;
          }}
        >
          <TrackedButton
            type="button"
            id={dropdownId}
            onSetRef={(ref) => {
              this.dropdownButton = ref;
            }}
            className={dropdownButtonClassName}
            aria-haspopup={true}
            aria-expanded={showNavMenu}
            aria-label={ariaLabel}
            onClick={this.toggleMenu}
            onKeyDown={this.handleKeyPress}
            dataE2e="header-profile"
            trackingName={trackingID}
          >
            <UserPortrait
              {...{
                user: user.get(),
                showFullName,
                showCaret: true,
                isCaretUp: showNavMenu,
              }}
            />
          </TrackedButton>

          {showNavMenu && (
            <ListWithKeyboardControls
              id="c-ph-aai-dropdown"
              domRef={(ref: HTMLElement | null) => {
                this.dropdownMenu = ref;
              }}
              className="c-authenticated-dropdown-menu"
              role="menu"
              aria-labelledby={dropdownId}
              onEsc={this.toggleMenu}
              allowDefaultOnEnter
            >
              {navButtons.map((navInfo, index) => (
                <HeaderRightNavButton
                  domRef={(ref: HTMLElement | null) => {
                    if (index === 0) {
                      this.firstButtonRef = ref;
                    }
                  }}
                  wrapperClassName="dropdown-btn"
                  linkClassName="dropdown-link"
                  key={navInfo.name}
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  linkRole="menuitem"
                  {...navInfo}
                />
              ))}
              <SignoutButton />
            </ListWithKeyboardControls>
          )}
        </div>
      </li>
    );
  }
}

export default AuthenticatedAccountDropdown;
