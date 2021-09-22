import React from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import user from 'js/lib/user';

import createLoadableComponent from 'js/lib/createLoadableComponent';
import type UserAgentInfo from 'js/lib/useragent';
import connectToRouter from 'js/lib/connectToRouter';

import { color, Box } from '@coursera/coursera-ui';

// eslint-disable-next-line no-restricted-syntax
import SmartScrollWrapper from 'bundles/coursera-ui/components/extended/SmartScrollWrapper';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type SwitcherSelectionsType from 'bundles/naptimejs/resources/programSwitcherSelections.v1';

import type { ProductDiscountPromoBannerProps, GetS12nCertificateBannerProps } from 'bundles/page/types/Program';
import MobileSearchContainerLite from 'bundles/page/components/header/mobile/MobileSearchContainerLite';
import MobileHeaderNav from 'bundles/page/components/header/mobile/MobileHeaderNav';
import HeaderMobileLogo from 'bundles/page/components/header/mobile/HeaderMobileLogo';
import HeaderMobileSearchIcon from 'bundles/page/components/header/mobile/HeaderMobileSearchIcon';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import { TRANSITION_DELAY } from 'bundles/page/components/header/mobile/constants';
import { showBanner } from 'bundles/promotions/utils/productDiscountPromoBannerUtils';

import { isAuthoringPathname, populateWithDegreesAndProgramsOnClientside } from 'bundles/page/utils/pageHeaderNavUtils';

import AuthenticatedAccountDropdown from 'bundles/page/components/header/AuthenticatedAccountDropdown';

import 'css!bundles/page/components/header/mobile/__styles__/MobileHeader';

const ProductDiscountPromoBanner = createLoadableComponent(
  () => import('bundles/promotions/components/ProductDiscountPromoBanner')
);
const GetS12nCertificateBanner = createLoadableComponent(
  () => import('bundles/enroll/components/common/GetS12nCertificateBanner')
);

// Populate dropdown with degrees and programs data to
// ensure access to the dropdown menu when viewing the program/course home
export const AuthenticatedAccountDropdownWithData = populateWithDegreesAndProgramsOnClientside()(
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'typeof AuthenticatedAccountDropd... Remove this comment to see the full error message
  AuthenticatedAccountDropdown
);

type State = {
  searchIsFocused: boolean;
  searchIsOpen: boolean;
  disableHideSearch: boolean;
  extraClassNames: Array<string>;
};

type PropsFromCaller = {
  toggleMobileCourseMenu?: () => void;
  isScrollable?: boolean;
  isSearchPage?: boolean;
  productDiscountPromoBannerProps?: ProductDiscountPromoBannerProps;
  getS12nCertificateBannerProps?: GetS12nCertificateBannerProps;
  showEnterpriseLogo?: boolean;
  hideNav?: boolean;
  hideSearch?: boolean;
  shouldSkipOptionalExternalDataFetch?: boolean;
  switcherSelections?: SwitcherSelectionsType;
  userAgent?: UserAgentInfo;
  pathname?: string;
  showAccountDropdown?: boolean;
};

type PropsToComponent = PropsFromCaller;

export class MobileHeader extends React.Component<PropsToComponent, State> {
  static defaultProps = {
    showEnterpriseLogo: false,
    hideNav: false,
    hideSearch: false,
  };

  state = {
    searchIsOpen: false,
    searchIsFocused: false,
    disableHideSearch: false,
    extraClassNames: [],
  };

  onSearchFocus = () => {
    this.setState({ searchIsFocused: true });
  };

  onSearchBlur = () => {
    this.setState({ searchIsFocused: false, disableHideSearch: true });
    setTimeout(() => this.setState({ disableHideSearch: false }), 10);
  };

  showSearch = () => {
    this.setState({ searchIsOpen: true, searchIsFocused: true });
  };

  hideSearch = () => {
    const { disableHideSearch } = this.state;
    if (!disableHideSearch) {
      this.setState({ searchIsOpen: false });
    }
  };

  addContainerClass = (extraClassName: string) => {
    this.setState(({ extraClassNames }) => ({
      extraClassNames: extraClassNames.includes(extraClassName)
        ? extraClassNames
        : [...extraClassNames, extraClassName],
    }));
  };

  removeContainerClass = (extraClassName: string) => {
    this.setState(({ extraClassNames }) => ({
      extraClassNames: extraClassNames.includes(extraClassName)
        ? extraClassNames.filter((extraClassName0) => extraClassName0 !== extraClassName)
        : extraClassNames,
    }));
  };

  renderControls() {
    const {
      userAgent,
      isSearchPage,
      toggleMobileCourseMenu,
      hideNav,
      hideSearch,
      showEnterpriseLogo,
      shouldSkipOptionalExternalDataFetch,
      switcherSelections,
      showAccountDropdown,
      pathname,
    } = this.props;

    const { searchIsOpen } = this.state;
    const shouldShowSearchIcon = true && !searchIsOpen && !isSearchPage && !hideSearch;
    const isStaff = user.get().is_staff || user.get().is_superuser;
    const fill = searchIsOpen ? color.primary : color.black;

    const controlsClassNames = classNames(
      'c-mobile-header-controls horizontal-box isLohpRebrand',
      'align-items-spacebetween',
      { 'with-account-dropdown': showAccountDropdown }
    );

    const isAdminOrTeachPage = isAuthoringPathname(pathname);
    const dropdownProps = {
      isStaff,
      showAdminLinks: isAdminOrTeachPage,
      showFullName: !showAccountDropdown,
      label: '',
      hideAvatarBorder: true,
    };

    return (
      <div className={controlsClassNames}>
        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={TRANSITION_DELAY * 2}
          transitionLeaveTimeout={TRANSITION_DELAY}
        >
          {!searchIsOpen && !hideNav && (
            <MobileHeaderNav
              userAgent={userAgent}
              toggleMobileCourseMenu={toggleMobileCourseMenu}
              shouldSkipOptionalExternalDataFetch={shouldSkipOptionalExternalDataFetch}
              switcherSelections={switcherSelections}
            />
          )}
        </CSSTransitionGroup>
        <HeaderMobileLogo
          showEnterpriseLogo={showEnterpriseLogo}
          showAccountDropdown={showAccountDropdown}
          isAdminOrTeachPage={isAdminOrTeachPage}
        />
        <Box alignItems="center">
          <CSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={TRANSITION_DELAY * 2}
            transitionLeaveTimeout={TRANSITION_DELAY}
          >
            {shouldShowSearchIcon && <HeaderMobileSearchIcon key="icon" fill={fill} onClick={this.showSearch} />}
          </CSSTransitionGroup>
          {!searchIsOpen && showAccountDropdown && (
            <ul id="authenticated-mobile-info-menu" className="bt3-nav c-navbar-list custom-mobile-header" role="none">
              <AuthenticatedAccountDropdownWithData {...dropdownProps} />
            </ul>
          )}
        </Box>
      </div>
    );
  }

  render() {
    const { searchIsFocused, searchIsOpen, extraClassNames } = this.state;
    const { isSearchPage, isScrollable, productDiscountPromoBannerProps, getS12nCertificateBannerProps } = this.props;
    const showProductDiscountPromoBanner = showBanner(this.props);
    const showGetS12nCertificateBanner = getS12nCertificateBannerProps && getS12nCertificateBannerProps.s12nSlug;

    const wrapperClass = classNames('rc-MobileHeader rc-MobileHeaderLite', ...extraClassNames);

    return (
      <TrackedDiv trackingName="mobile_header_lite" className={wrapperClass} trackClicks={false} withVisibilityTracking>
        {isScrollable ? (
          // Static header
          this.renderControls()
        ) : (
          // Sticky header
          <SmartScrollWrapper
            delta={Number.MAX_VALUE}
            containerHeight={65}
            style={{ minWidth: '200px', maxWidth: '100vw', boxShadow: 'none', zIndex: 3000 }}
          >
            {this.renderControls()}
            {showProductDiscountPromoBanner && (
              <ProductDiscountPromoBanner
                {...productDiscountPromoBannerProps}
                addParentHeightClass={this.addContainerClass}
                removeParentHeightClass={this.removeContainerClass}
              />
            )}
            {/*
                GetS12nCertificateBanner applies to only the SDP
                The banner is only visible when the user has already earned the s12n certificate by completing a superset s12n.
              */}
            {showGetS12nCertificateBanner && (
              <GetS12nCertificateBanner
                {...getS12nCertificateBannerProps}
                addParentHeightClass={this.addContainerClass}
                removeParentHeightClass={this.removeContainerClass}
              />
            )}
          </SmartScrollWrapper>
        )}
        <MobileSearchContainerLite
          isSearchPage={isSearchPage}
          searchIsOpen={searchIsOpen}
          searchIsFocused={searchIsFocused}
          onBlur={this.onSearchBlur}
          onFocus={this.onSearchFocus}
          hideMobileSearchPage={this.hideSearch}
        />
      </TrackedDiv>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToRouter(({ location: { pathname } }) => {
    return {
      pathname,
    };
  })
)(MobileHeader);
