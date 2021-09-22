import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose, mapProps, branch } from 'recompose';
import _t from 'i18n!nls/page';

import user from 'js/lib/user';

import Naptime from 'bundles/naptimejs';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';
import AdminUserPermissionsV1 from 'bundles/naptimejs/resources/adminUserPermissionsV1';

import { applicationStoreIn } from 'bundles/page/lib/migration';
import AuthenticatedAccountInfo from 'bundles/page/components/header/AuthenticatedAccountInfoV2';
import UnauthenticatedAccountInfo from 'bundles/page/components/header/UnauthenticatedAccountInfo';
import link from 'bundles/mobile/lib/link';
import AdminPermission from 'bundles/admin/utils/AdminPermission';
import EnterpriseLink from 'bundles/page/components/header/EnterpriseLink';
import StudentLink from 'bundles/page/components/header/StudentLink';
import savedCartUtils from 'bundles/payments/lib/savedCartUtils';

import AdminV2NavigationDropdown from 'bundles/admin-v2/components/AdminV2NavigationDropdown';
import isAdminV2Enabled from 'bundles/admin-v2/utils/AdminV2ExperimentUtils';

import { SEO_ENTITY_SEARCH_PATH } from 'bundles/search/SearchConstants';
import { EDUCATOR_HELP_CENTER_HOME_PAGE_URL } from 'bundles/author-common/constants/EducatorHelpCenterHomePageURL';

import 'css!bundles/page/components/header/__styles__/HeaderRightNavV2';

const EXPLORE_CATALOG_LINK =
  '/for-university-and-college-students?utm_campaign=zoom-video-lecture&utm_content=browse-catalog-top-nav&utm_medium=coursera&utm_source=zoom';

type InputProps = {
  isEnterprise?: boolean;
  hideEnterprise?: boolean;
  showShoppingCart?: boolean;
  hideNotificationCenter?: boolean;
  hideHelp?: boolean;
  showAdminLinks: boolean;
  programs: Array<EnterpriseProgramsV1>;
  degrees: Array<Record<string, string>>;
  onClickHelp?: () => void;
  q2ShowDesktopAltSignupLabel?: () => boolean;
  experimentalStyles?: boolean;
  thirdPartyOrganizationId?: string;
  showExploreCatalog?: boolean;
};

type Props = InputProps & {
  hasActiveShoppingCart: boolean;
  adminPermission: AdminPermission;
};

type RightNavButtonsType = {
  href?: string;
  name: string;
  label: string;
  mobileOnly?: boolean;
  wrapperClassName?: string;
  onClick?: () => void;
  target?: string;
  openInNewWindow?: boolean;
};

class HeaderRightNav extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
    getStore: PropTypes.func,
  };

  static defaultProps = {
    hideEnterprise: false,
    hideHelp: true,
    hasActiveShoppingCart: false,
    adminPermission: new AdminPermission({}),
  };

  getUserAgent() {
    const { context } = this;
    return applicationStoreIn(this) && context.getStore('ApplicationStore').getUserAgent();
  }

  getRequestCountryCode() {
    const { context } = this;
    return applicationStoreIn(this) && context.getStore('ApplicationStore').getRequestCountryCode();
  }

  isAndroidOrIOS() {
    const userAgent = this.getUserAgent();
    return userAgent && (userAgent.isIOS || userAgent.isAndroid);
  }

  getButtonTextMediaQuery = () => {
    const { hasActiveShoppingCart } = this.props;

    return {
      maxWidth: hasActiveShoppingCart ? 1120 : 1080,
      minWidth: 925,
    };
  };

  render() {
    const {
      programs,
      degrees,
      showShoppingCart,
      hasActiveShoppingCart,
      hideNotificationCenter,
      onClickHelp,
      hideHelp,
      hideEnterprise,
      q2ShowDesktopAltSignupLabel,
      isEnterprise,
      showAdminLinks,
      experimentalStyles,
      thirdPartyOrganizationId,
      adminPermission,
      showExploreCatalog,
    } = this.props;

    const childClassName = ['bt3-nav', 'bt3-navbar-nav'];
    const childListClassName = ['c-navbar-list', ...childClassName].join(' ');
    const childItemClassName = ['c-navbar-item', ...childClassName].join(' ');

    const rightNavButtons: Array<RightNavButtonsType> = [
      {
        href: SEO_ENTITY_SEARCH_PATH,
        label: _t('Top Courses'),
        name: 'top_courses',
        mobileOnly: true,
      },
    ];

    if (!hideHelp || showAdminLinks) {
      rightNavButtons.push({
        onClick: onClickHelp,
        href: EDUCATOR_HELP_CENTER_HOME_PAGE_URL, // fallback in case onClickHelp is missing
        openInNewWindow: true, // fallback in case onClickHelp is missing
        label: _t('Help'),
        name: 'help',
      });
    }

    if (showExploreCatalog && !user.isAuthenticatedUser()) {
      rightNavButtons.push({
        href: EXPLORE_CATALOG_LINK,
        openInNewWindow: true,
        label: _t("Explore Coursera's Catalog"),
        wrapperClassName: 'explore-catalog-link',
        name: 'explore',
      });
    }

    if (this.isAndroidOrIOS()) {
      const { router } = this.context;
      const appLink = link.getAppUrl(this.getUserAgent(), router.location.pathname, this.getRequestCountryCode());
      rightNavButtons.unshift({
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
        href: appLink,
        label: _t('Get the app'),
        name: 'get-app',
        mobileOnly: true,
      });
    }
    rightNavButtons.unshift({
      href: '/browse',
      label: _t('Browse'),
      name: 'browse',
      mobileOnly: true,
    });

    return (
      <div
        id="c-ph-right-nav"
        className={classNames('c-ph-right-nav bt3-navbar-right collapse', { 'is-cart-active': hasActiveShoppingCart })}
      >
        <span className={childItemClassName} role="none">
          <EnterpriseLink
            hideEnterprise={hideEnterprise}
            showAdminLinks={showAdminLinks}
            showExploreCatalog={showExploreCatalog}
          />
        </span>
        <span className={childItemClassName} role="none">
          <StudentLink
            hideEnterprise={hideEnterprise}
            showAdminLinks={showAdminLinks}
            showExploreCatalog={showExploreCatalog}
            isEnterprise={isEnterprise}
          />
        </span>

        {user.isAuthenticatedUser() ? (
          <AuthenticatedAccountInfo
            className={childListClassName}
            adminPermission={adminPermission}
            isStaff={user.get().is_staff || adminPermission?.canViewAdminLink()}
            userId={user.get().id}
            rightNavButtons={rightNavButtons}
            showShoppingCart={!!showShoppingCart}
            hideNotificationCenter={!!hideNotificationCenter}
            programs={programs}
            degrees={degrees}
            hideEnterprise={hideEnterprise}
            showAdminLinks={showAdminLinks}
            thirdPartyOrganizationId={thirdPartyOrganizationId || ''}
          />
        ) : (
          <UnauthenticatedAccountInfo
            className={childListClassName}
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            id="unauthenticated-info-menu"
            rightNavButtons={rightNavButtons}
            hideEnterprise={hideEnterprise}
            q2ShowDesktopAltSignupLabel={q2ShowDesktopAltSignupLabel}
            isEnterprise={isEnterprise}
            experimentalStyles={experimentalStyles}
          />
        )}

        {isAdminV2Enabled() && user.isAuthenticatedUser() && showAdminLinks && <AdminV2NavigationDropdown />}
      </div>
    );
  }
}
export default compose<Props, InputProps>(
  branch(
    () => user.isAuthenticatedUser() && typeof window !== 'undefined',
    compose(
      Naptime.createContainer<Props, Omit<Props, 'adminUserPermissions'>>(() => {
        return {
          adminUserPermissions: AdminUserPermissionsV1.finder('my', { params: {}, required: false }),
        };
      }),
      mapProps((props: Props & { adminUserPermissions: Array<AdminUserPermissionsV1> }) => {
        const { adminUserPermissions = [] } = props;
        const permission = (adminUserPermissions || [])[0]?.permissions;
        const adminPermission = new AdminPermission(permission || {});

        const cartInfo = savedCartUtils.get();
        const cartId = cartInfo && cartInfo.id;

        return {
          ...props,
          adminPermission,
          hasActiveShoppingCart: !!cartId,
        };
      })
    )
  )
)(HeaderRightNav);
