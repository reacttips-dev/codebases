import type { FocusEvent } from 'react';
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { color } from '@coursera/coursera-ui';
import _ from 'lodash';
import classNames from 'classnames';
import user from 'js/lib/user';
import { isUserRightToLeft } from 'js/lib/language';
import Retracked from 'js/app/retracked';

import SmartScrollWrapper from 'bundles/coursera-ui/components/extended/SmartScrollWrapper';
import { showBanner } from 'bundles/promotions/utils/productDiscountPromoBannerUtils';
import { currentPathnameOf, userAuthenticatedIn } from 'bundles/page/lib/migration';

import type { DEGREE } from 'bundles/program-home/constants/SwitcherSelectionTypes';
import { NOT_SELECTED, PROGRAM, COURSERA } from 'bundles/program-home/constants/SwitcherSelectionTypes';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { GOOGLE_CERT_S12N_SLUG } from 'bundles/enroll/constants/constants';
import BrowseContentWrapper from 'bundles/page/components/header/desktop/BrowseContentWrapper';
import HeaderRightNav from 'bundles/page/components/header/HeaderRightNavV2';
import createLoadableComponent from 'js/lib/createLoadableComponent';

import HeaderLogo from 'bundles/page/components/header/HeaderLogo';
import type {
  Program,
  ProductDiscountPromoBannerProps,
  GetS12nCertificateBannerProps,
} from 'bundles/page/types/Program';
import { isAuthoringPathname, populateWithDegreesAndProgramsOnClientside } from 'bundles/page/utils/pageHeaderNavUtils';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Degrees from 'bundles/naptimejs/resources/degrees.v1';

import 'css!bundles/page/components/__styles__/PageHeader';

const LoadableSwitcherPanel = createLoadableComponent(
  () =>
    // @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
    import('bundles/page/components/header/switcher/SwitcherPanel')
);
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const LoadableMobilePromoOption = createLoadableComponent(() => import('bundles/mobile/components/MobilePromoOption'));
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const LoadableTeachBanner = createLoadableComponent(() => import('bundles/teach-course/components/TeachBanner'));
const LoadableGDPRBanner = createLoadableComponent(() => import('bundles/common/components/GDPRBanner'));

const LoadableProductDiscountPromoBanner = createLoadableComponent(
  () => import('bundles/promotions/components/ProductDiscountPromoBanner')
);

const LoadableGetS12nCertificateBanner = createLoadableComponent(
  () => import('bundles/enroll/components/common/GetS12nCertificateBanner')
);

const LoadableCatalogSubscriptionPromoBanner = createLoadableComponent(
  () => import('bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionPromoBanner')
);

const LoadableEnrollmentStateBanner = createLoadableComponent(
  () => import('bundles/preview/containers/EnrollmentStateBanner')
);

const LoadableEnterpriseReturnToProgramBanner = createLoadableComponent(
  () => import('bundles/program-common/components/EnterpriseReturnToProgramBanner')
);

const HEADER_SEARCH_BAR_BLACKLISTED_PATHNAMES: string[] = [];

type SearchBarParamsType = PropsToComponent;

export type SlugType = 'courseSlug' | 's12nSlug';

export type PropsFromCaller = {
  course?: {
    id: string;
    name?: string;
    brandingImageUrl: string;
  };
  toggleMobileMenu?: () => void;
  shouldSkipOptionalExternalDataFetch?: boolean;
  hideRightNav?: boolean;
  hideSearch?: boolean;
  hideMembershipSwitcher?: boolean;
  hideEnterprise?: boolean;
  hasCatalogButton?: boolean;
  isEnterprise?: boolean;
  initialSearchText?: string; // eslint-disable-line react/no-unused-prop-types
  isInNewCatalog?: boolean; // eslint-disable-line react/no-unused-prop-types
  showShoppingCart?: boolean; // eslint-disable-line react/no-unused-prop-types
  hideNotificationCenter?: boolean; // eslint-disable-line react/no-unused-prop-types
  isHeaderFixedTop?: boolean;
  disableHeaderLogoUserInteraction?: boolean;
  enableCourseraHeaderLogoOnly?: boolean;
  mainSearchInputSelector?: string;
  thirdPartyOrganizationId?: string;
  affiliateElement?: React.ReactElement | null;
  catalogSubBannerProps?: {
    hidePromoBanner?: boolean;
    s12nSlug?: string;
    courseSlug?: string;
  };
  productDiscountPromoBannerProps?: ProductDiscountPromoBannerProps;
  getS12nCertificateBannerProps?: GetS12nCertificateBannerProps;
  containerHeight?: number;
  children?: JSX.Element;
  showGDPRBanner?: boolean;
  isScrollable?: boolean;
  showEnterpriseLogo?: boolean;
  showEnterpriseReturnToProgramBanner?: boolean;
  switcherSelections?: {
    id: string;
    selectionType: typeof NOT_SELECTED | typeof PROGRAM | typeof COURSERA | typeof DEGREE;
    programId: string;
    degreeId: string;
  };
  logoWrapper?: string;
  isSearchPage?: boolean;
  logoQueryParams?: Record<string, string | undefined>;
  showExploreCatalog?: boolean;
  injectedSearchBar?: JSX.Element | null;
};

type PropsToComponent = PropsFromCaller & {
  programs: Array<Program>;
  degrees: Degrees;
};

type HeightPlaceholder = {
  isInit: boolean;
  bonusClassName: string;
};

type State = {
  showSwitcherPanel: boolean;
  heightPlaceholders: Record<string, HeightPlaceholder>;
  isMounted: boolean;
  showSkipToContent: boolean;
  isMainContentContainerAvailable: boolean;
};

export class DesktopHeaderControls extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    router: PropTypes.object,
    _eventData: PropTypes.object,
  };

  static defaultProps = {
    hideRightNav: false,
    hideSearch: false,
    hideEnterprise: false,
    isInNewCatalog: false,
    hasCatalogButton: true,
    initialSearchText: '',
    showShoppingCart: true,
    hideNotificationCenter: false,
    isHeaderFixedTop: false,
    containerHeight: 70,
    disableHeaderLogoUserInteraction: false,
    isScrollable: false,
    showEnterpriseLogo: false,
  };

  state: State = {
    showSwitcherPanel: false,
    heightPlaceholders: {},
    isMounted: false,
    showSkipToContent: false,
    isMainContentContainerAvailable: false,
  };

  componentDidMount() {
    const isMounted = true;
    const isMainContentContainerAvailable = !!document.getElementById('main');

    this.setState(() => ({ isMounted, isMainContentContainerAvailable }));
  }

  handleProgramSwitcherToggle = () => {
    const { _eventData } = this.context;
    const { showSwitcherPanel, isMounted } = this.state;
    if (isMounted) {
      this.setState({ showSwitcherPanel: !showSwitcherPanel });
      Retracked.trackComponent(_eventData, {}, 'switcher_dropdown', 'click');
    }
  };

  handleSkipToMainContent = (event: FocusEvent<HTMLElement>) => {
    const { type } = event;
    if (type === 'focus') {
      this.setState({
        showSkipToContent: true,
      });
    } else if (type === 'blur') {
      this.setState({
        showSkipToContent: false,
      });
    }
  };

  addHeightClass = (className: string, bonusClassName?: string) => {
    this.setState(
      ({ heightPlaceholders }) => ({
        heightPlaceholders: {
          ...heightPlaceholders,
          [className]: {
            isInit: heightPlaceholders[className]?.isInit ?? false,
            bonusClassName: bonusClassName ?? '',
          },
        },
      }),
      () => setTimeout(this.addHeightClassCallback, 0, className)
    );
  };

  addHeightClassCallback = (className: string) => {
    this.setState(({ heightPlaceholders }) => ({
      heightPlaceholders: {
        ...heightPlaceholders,
        [className]: {
          ...heightPlaceholders[className],
          isInit: true,
        },
      },
    }));
  };

  removeHeightClass = (className: string) => {
    this.setState(({ heightPlaceholders }) => ({
      heightPlaceholders: {
        ...heightPlaceholders,
        [className]: {
          ...heightPlaceholders[className],
          isInit: false,
          bonusClassName: '',
        },
      },
    }));
  };

  forceHideSearch = () => {
    if (userAuthenticatedIn(this)) {
      return false;
    } else {
      const currentPathname = currentPathnameOf(this);
      const isBlacklistedPath = HEADER_SEARCH_BAR_BLACKLISTED_PATHNAMES.indexOf(currentPathname) !== -1;
      return isBlacklistedPath;
    }
  };

  render() {
    const {
      switcherSelections,
      programs,
      degrees,
      course,
      toggleMobileMenu,
      thirdPartyOrganizationId,
      affiliateElement,
      mainSearchInputSelector,
      containerHeight,
      hideRightNav,
      hideSearch,
      hideEnterprise,
      disableHeaderLogoUserInteraction,
      enableCourseraHeaderLogoOnly,
      catalogSubBannerProps,
      productDiscountPromoBannerProps,
      getS12nCertificateBannerProps,
      isEnterprise,
      isScrollable,
      showGDPRBanner,
      showEnterpriseLogo,
      showEnterpriseReturnToProgramBanner,
      isHeaderFixedTop,
      logoWrapper,
      showShoppingCart,
      hideNotificationCenter,
      logoQueryParams,
      showExploreCatalog,
      hideMembershipSwitcher,
      injectedSearchBar,
    } = this.props;

    const { heightPlaceholders, showSwitcherPanel, isMounted, showSkipToContent, isMainContentContainerAvailable } =
      this.state;

    const initialSearchBarParams = {};

    const searchBarParams: SearchBarParamsType = Object.assign(initialSearchBarParams, this.props);

    const navClassnames = classNames('bt3-navbar', 'c-ph-nav', 'full-width', {
      'bt3-navbar-fixed-top': isHeaderFixedTop,
    });

    const skipToContentClassnames = classNames('align-items-vertical-center', 'horizontal-box', {
      'sr-only': !showSkipToContent,
      'skip-content-main': showSkipToContent,
    });

    let shouldShowSearch = true;

    if (programs && switcherSelections) {
      const noDegreeOrProgram = _.isEmpty(degrees) && _.isEmpty(programs);
      const noSelection =
        switcherSelections.selectionType === COURSERA || switcherSelections.selectionType === NOT_SELECTED;
      shouldShowSearch = noDegreeOrProgram || noSelection;
    }

    let currentThirdPartyOrganizationId = thirdPartyOrganizationId;
    if (!currentThirdPartyOrganizationId) {
      if (switcherSelections && switcherSelections.selectionType === PROGRAM) {
        const program = _.find(programs, ({ id }: Program) => id === switcherSelections.programId);
        currentThirdPartyOrganizationId = (program && program.thirdPartyOrganizationId) || null;
      }
    }

    const [wrapperClass, headerClass, smartScrollStyle] = [
      'rc-DesktopHeaderControls',
      'rc-PageHeader',
      { boxShadow: 'none', maxWidth: '100vw' },
    ];

    const currentProgram = _.find(programs, (program) => {
      return !program ? false : program.id === switcherSelections?.programId;
    });

    const currentDegree = _.find(degrees, (degree) => {
      return !degree ? false : degree.id === switcherSelections?.degreeId;
    });

    const showSubscriptionBanner =
      !catalogSubBannerProps || (catalogSubBannerProps && !catalogSubBannerProps.hidePromoBanner);

    const showProductDiscountPromoBanner = showBanner(this.props);

    const showGetS12nCertificateBanner = getS12nCertificateBannerProps && getS12nCertificateBannerProps.s12nSlug;

    const { router } = this.context;
    let displaySwitcherFlag;
    let showAdminLinks;
    let showSearch;
    const { location } = router;
    const { pathname } = location;

    /* For all routes under authoring, hide search bar, disable switcher */
    const isAdminOrTeachPage = isAuthoringPathname(pathname);
    if (isAdminOrTeachPage || hideMembershipSwitcher) {
      displaySwitcherFlag = false;
      showSearch = false;
      showAdminLinks = true;
    } else {
      displaySwitcherFlag =
        user.get().is_staff ||
        ((!_.isEmpty(programs) || !_.isEmpty(degrees) || isEnterprise) && !hideRightNav && user.get().authenticated);
      showAdminLinks = false;
      showSearch =
        !isEnterprise &&
        !(currentProgram || currentDegree) &&
        shouldShowSearch &&
        !hideSearch &&
        !this.forceHideSearch();
    }

    let searchBar: React.ReactNode | null = null;

    if (showSearch) {
      searchBar = (
        <div className="c-ph-search-catalog nav-item horizontal-box browse-search">
          <BrowseContentWrapper {...searchBarParams} className={mainSearchInputSelector} />
        </div>
      );
    }

    if (injectedSearchBar) {
      searchBar = <div className="c-ph-search-enterprise hidden-sm-down horizontal-box">{injectedSearchBar}</div>;
    }

    const headerBt3ContainerClassnames = classNames('c-container', 'bt3-container-fluid');

    const headerRightNavProps = {
      programs,
      degrees,
      showShoppingCart,
      hideNotificationCenter,
      hideEnterprise,
      isEnterprise,
      showAdminLinks,
      thirdPartyOrganizationId,
      showExploreCatalog,
    };

    const desktopHeaderControls = (
      <div className={headerClass} key="nav" data-e2e="page-header">
        <div className={navClassnames}>
          <div className={headerBt3ContainerClassnames}>
            <div className={skipToContentClassnames}>
              {isMainContentContainerAvailable && (
                <div className="skip-button-outer-div">
                  <div className="align-items-vertical-center align-items-absolute-center">
                    <a
                      href="#main"
                      onFocus={this.handleSkipToMainContent}
                      onBlur={this.handleSkipToMainContent}
                      aria-label="Skip to Main Content"
                    >
                      Skip to Main Content
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div
              className="header-logo-wrapper"
              style={{ minWidth: '167px', float: isUserRightToLeft() ? 'right' : 'left' }}
            >
              <HeaderLogo
                // @ts-expect-error ts-migrate(2322) FIXME: Type '{ course: { id: string; name?: string | unde... Remove this comment to see the full error message
                course={course}
                program={currentProgram}
                degree={currentDegree}
                toggleMobileMenu={toggleMobileMenu}
                thirdPartyOrganizationId={currentThirdPartyOrganizationId}
                affiliateElement={affiliateElement}
                hexColorCode={color.primary}
                disableUserInteraction={disableHeaderLogoUserInteraction}
                enableCourseraLogoOnly={enableCourseraHeaderLogoOnly}
                handleProgramSwitcherToggle={this.handleProgramSwitcherToggle}
                isOpened={showSwitcherPanel}
                displaySwitcher={displaySwitcherFlag}
                showEnterpriseLogo={showEnterpriseLogo}
                logoWrapper={logoWrapper}
                logoQueryParams={logoQueryParams}
                isAdminOrTeachPage={isAdminOrTeachPage}
              />
            </div>
            {searchBar}
            {!hideRightNav && (
              <div
                className="header-right-nav-wrapper"
                style={{
                  minWidth: '250px',
                  float: isUserRightToLeft() ? 'left' : 'right',
                }}
              >
                <HeaderRightNav {...headerRightNavProps} />
              </div>
            )}
          </div>
          {!hideRightNav && showSwitcherPanel && (
            <LoadableSwitcherPanel
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ selectedCoursera: boolean | undefined; cur... Remove this comment to see the full error message
              selectedCoursera={switcherSelections && switcherSelections.selectionType === COURSERA}
              currentProgram={currentProgram}
              currentDegree={currentDegree}
              programs={programs}
              degrees={degrees}
              handleProgramSwitcherToggle={this.handleProgramSwitcherToggle}
            />
          )}
        </div>
      </div>
    );

    /*
      to check for this.context.router which isn't available in
      context during Mocha test, bundles/phoenix/test/mocha/layout/page
    */
    /* TeachBanner is in PageHeader b/c it applies to all pages, except program home */
    const teachBanner = !isEnterprise && (
      <div key="teachBanner">
        <LoadableTeachBanner />
      </div>
    );

    /*
      CatalogSubscriptionPromoBanner also applies to all pages, except program home.
      The banner is not visible when logged out. Just trying to render it causes unnecessary network calls.
    */

    const catalogSubscriptionPromoBanner = showSubscriptionBanner &&
      (user.isAuthenticatedUser() ||
        (catalogSubBannerProps && catalogSubBannerProps.s12nSlug === GOOGLE_CERT_S12N_SLUG)) && (
        <LoadableCatalogSubscriptionPromoBanner
          {...catalogSubBannerProps}
          addParentHeightClass={this.addHeightClass}
          removeParentHeightClass={this.removeHeightClass}
          key="catalogBanner"
        />
      );
    /*
      ProductDiscountPromoBanner applies to all product pages (XDP/CDP/SDP)
      The banner is only visible after the user visits a promo landing page and is on an applicable product page.
    */
    const productDiscountPromoBanner = showProductDiscountPromoBanner && (
      <LoadableProductDiscountPromoBanner
        {...productDiscountPromoBannerProps}
        addParentHeightClass={this.addHeightClass}
        removeParentHeightClass={this.removeHeightClass}
      />
    );
    /*
      GetS12nCertificateBanner applies to only the SDP
      The banner is only visible when the user has already earned the s12n certificate by completing a superset s12n.
    */
    const getS12nCertificateBanner = showGetS12nCertificateBanner && (
      <LoadableGetS12nCertificateBanner
        {...getS12nCertificateBannerProps}
        addParentHeightClass={this.addHeightClass}
        removeParentHeightClass={this.removeHeightClass}
      />
    );

    // switcherSelections switches from undefined => Array when gql has fetched.
    const gdprBanner = showGDPRBanner && switcherSelections && (
      <LoadableGDPRBanner
        addParentHeightClass={this.addHeightClass}
        removeParentHeightClass={this.removeHeightClass}
        programs={programs}
      />
    );

    const enterpriseReturnToProgramBanner =
      showEnterpriseReturnToProgramBanner && user.isAuthenticatedUser() && currentProgram ? (
        <LoadableEnterpriseReturnToProgramBanner
          userId={user.get().id}
          program={currentProgram}
          addParentHeightClass={this.addHeightClass}
          removeParentHeightClass={this.removeHeightClass}
        />
      ) : undefined;

    const pageHeader = isScrollable ? (
      <div className="smart-scroll-container">
        {desktopHeaderControls}
        {teachBanner}
        {catalogSubscriptionPromoBanner}
        {productDiscountPromoBanner}
        {gdprBanner}
        {getS12nCertificateBanner}
        {enterpriseReturnToProgramBanner}
      </div>
    ) : (
      <div className="smart-scroll-container">
        <SmartScrollWrapper delta={Number.MAX_VALUE} containerHeight={containerHeight} style={smartScrollStyle}>
          {desktopHeaderControls}
          {teachBanner}
          {catalogSubscriptionPromoBanner}
          {productDiscountPromoBanner}
          {gdprBanner}
          {getS12nCertificateBanner}
          {enterpriseReturnToProgramBanner}
        </SmartScrollWrapper>
      </div>
    );

    return (
      <div>
        <header className={wrapperClass} data-catchpoint="page-header-controls">
          <LoadableMobilePromoOption />
          {pageHeader}
          {!isScrollable && (
            <div className="height-placeholders" role="presentation">
              <div className="height-placeholder with-desktop-header-controls" />
              {_.map(heightPlaceholders, ({ isInit, bonusClassName }, className) => (
                <div
                  key={className}
                  className={classNames('height-placeholder', isInit && className, isInit && bonusClassName)}
                  role="presentation"
                />
              ))}
            </div>
          )}
        </header>
        {isMounted && userAuthenticatedIn(this) && (
          <LoadableEnrollmentStateBanner
            // @ts-ignore ts-migrate(2322) FIXME: Type '{ addParentHeightClass: (className: string, ... Remove this comment to see the full error message
            addParentHeightClass={this.addHeightClass}
            removeParentHeightClass={this.removeHeightClass}
            data-catchpoint="page-header-controls"
          />
        )}
      </div>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(populateWithDegreesAndProgramsOnClientside())(
  DesktopHeaderControls
);
