import React from 'react';
import { compose } from 'recompose';

import user from 'js/lib/user';
import type UserAgentInfo from 'js/lib/useragent';
import connectToStores from 'js/lib/connectToStores';
import cookie from 'js/lib/cookie';
import isMobileApp from 'js/lib/isMobileApp';
import createLoadableComponent from 'js/lib/createLoadableComponent';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import connectToRouter from 'js/lib/connectToRouter';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type SwitcherSelectionsType from 'bundles/naptimejs/resources/programSwitcherSelections.v1';
import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';

import MobileHeader from 'bundles/page/components/header/mobile/MobileHeader';
import DesktopHeader from 'bundles/page/components/header/desktop/DesktopHeader';

import withHasPageLoaded from 'bundles/page/utils/withHasPageLoaded';

import { PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE } from 'bundles/onboarding-2018/constants';

import type { ProductDiscountPromoBannerProps, GetS12nCertificateBannerProps } from 'bundles/page/types/Program';

import 'css!bundles/page/components/__styles__/PageHeaderWrapper';

const AuthenticationOption = createLoadableComponent(
  () => import('bundles/user-account/components/AuthenticationOption')
);
const OnboardingModal = createLoadableComponent(() => import('bundles/onboarding-2018/components/OnboardingModal'));

export type InputProps = {
  toggleMobileMenu?: () => void;
  isScrollable?: boolean;
  isSearchPage?: boolean;
  isEnterprise?: boolean;
  productDiscountPromoBannerProps?: ProductDiscountPromoBannerProps;
  getS12nCertificateBannerProps?: GetS12nCertificateBannerProps;
  userAgent?: UserAgentInfo;
  showEnterpriseLogo?: boolean;
  showEnterpriseReturnToProgramBanner?: boolean;
  hideRightNav?: boolean;
  hideSearch?: boolean;
  hideOnboardingModal?: boolean;
  /**
   * When the shouldSkipOptionalExternalDataFetch flag is enabled, component skips external data queries
   * that are not essential to rendering the header. Skipped calls currently include
   * 1) programs + degrees data
   * 2) domain data
   * */
  shouldSkipOptionalExternalDataFetch?: boolean;
  preventModalClose?: boolean;
  preventRegister?: boolean;
  hideAuth?: boolean;
  switcherSelections?: SwitcherSelectionsType;
  logoWrapper?: string;
  isPageWithSecondaryCta?: boolean;
  isDegreesPage?: boolean;
  programId?: string;
  showShoppingCart?: boolean;
  showGDPRBanner?: boolean;
  hideNotificationCenter?: boolean;
  hideEnterprise?: boolean;
  hideMembershipSwitcher?: boolean;
  hasCatalogButton?: boolean;
  course?: {
    id: string;
    name?: string;
    brandingImageUrl: string;
  };
  catalogSubBannerProps?: {
    hidePromoBanner?: boolean;
    s12nSlug?: string;
    courseSlug?: string;
  };
  showAdminLinks?: boolean;
  onClickHelp?: () => void;
  isHeaderFixedTop?: boolean;
  mainSearchInputSelector?: string;
  thirdPartyOrganizationId?: string;
  affiliateElement?: React.ReactElement | null;
  disableHeaderLogoUserInteraction?: boolean;
  // On default we use a lazy loading version of the mega-menu, for SEO reasons certain apps may want to pass in one that loads in SSR
  logoQueryParams?: Record<string, string | undefined>;
  enableCourseraHeaderLogoOnly?: boolean;
  showExploreCatalog?: boolean;
  showAccountDropdown?: boolean;
  injectedSearchBar?: JSX.Element | null;
};

type Props = InputProps & {
  userAgent: UserAgentInfo;
  showOnboardingModal?: boolean;
  showAuthModal?: boolean;
  router: InjectedRouter;
  hasPageLoaded?: boolean;
};

export const PageHeader = (props: Props) => {
  const {
    userAgent,
    showOnboardingModal,
    showAuthModal,
    hideAuth,
    preventModalClose,
    preventRegister,
    isEnterprise,
    programId,
    router,
    isScrollable,
    isSearchPage,
    productDiscountPromoBannerProps,
    getS12nCertificateBannerProps,
    showEnterpriseLogo,
    hideSearch,
    shouldSkipOptionalExternalDataFetch,
    switcherSelections,
    toggleMobileMenu,
    hideRightNav,
    hideOnboardingModal,
    hasPageLoaded,
    showAccountDropdown,
  } = props;

  const mobileHeaderProps = {
    userAgent,
    isSearchPage,
    isScrollable,
    toggleMobileCourseMenu: toggleMobileMenu,
    productDiscountPromoBannerProps,
    getS12nCertificateBannerProps,
    showEnterpriseLogo,
    hideNav: hideRightNav,
    hideSearch,
    shouldSkipOptionalExternalDataFetch,
    switcherSelections,
    showAccountDropdown,
  };

  const shouldLoadAuthModal = !hideAuth && (showAuthModal || (hasPageLoaded && !user.isAuthenticatedUser()));
  const shouldLoadOnboardingModal =
    user.isAuthenticatedUser() &&
    !hideOnboardingModal &&
    (showOnboardingModal || cookie.get(PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE));

  // We don't want to show header if a page is being opened in a mobile web view. Mobile apps have their own header.
  if (isMobileApp.get()) {
    return null;
  }

  return (
    /*
      TODO (Connor): There is a selector naming discrepency where the rc-PageHeader selector is used in DesktopHeaderControls,
      this is an important selector as it's overridden in many places. We need to come up with a migration plan to properly name
      and style the header components.
    */
    <span className="rc-PageHeaderWrapper">
      <DesktopHeader {...props} />
      <MobileHeader {...mobileHeaderProps} />
      {shouldLoadAuthModal && (
        <AuthenticationOption
          preventModalClose={preventModalClose}
          preventRegister={preventRegister}
          query={router && router.location.query}
          key="authenticationOption"
          isEnterprise={isEnterprise}
          programId={programId}
        />
      )}
      {shouldLoadOnboardingModal && <OnboardingModal />}
    </span>
  );
};

export default compose<Props, InputProps>(
  connectToStores<Props, InputProps>([ApplicationStoreClass], (ApplicationStore, props) => ({
    ...props,
    userAgent: ApplicationStore.getUserAgent(),
  })),
  connectToRouter((router) => ({
    showOnboardingModal: router.location.query.showOnboardingModal,
    showAuthModal: router.location.query.authMode,
    router,
  })),
  withHasPageLoaded
)(PageHeader);
