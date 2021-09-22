import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/page';
import _ from 'lodash';
import user from 'js/lib/user';
import epic from 'bundles/epic/client';
import { compose, branch } from 'recompose';

import Naptime from 'bundles/naptimejs';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';
import EnterpriseAdminRolesV1 from 'bundles/naptimejs/resources/enterpriseAdminRoles.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ThirdPartyOrganizationsV1 from 'bundles/naptimejs/resources/thirdPartyOrganizations.v1';
import enterpriseAdminUser from 'bundles/enterprise-admin';
import createLoadableComponent from 'js/lib/createLoadableComponent';

import HeaderRightNavButton from 'bundles/page/components/header/HeaderRightNavButton';
import AuthenticatedAccountDropdown from 'bundles/page/components/header/AuthenticatedAccountDropdown';

import type { HeaderRightNavButtonType } from 'bundles/page/lib/HeaderRightNavButtonShape';
import { getAccountDropdownOptions } from 'bundles/page/utils/pageHeaderNavUtils';
import { selectProgramHomepage } from 'bundles/page/actions/ProgramSwitcherActions';
import ClientSideRenderedNotificationCenter from 'bundles/notification-center/components/ClientSideRenderedNotificationCenter';
import { isNextJSApp } from 'bundles/next/utils/envUtils';

import type AdminPermission from 'bundles/admin/utils/AdminPermission';
import { getAdminRoutes } from 'bundles/admin/constants/constants';
import AdminRightNavLink from 'bundles/admin/components/AdminRightNavLink';
import { getAdminV2Routes } from 'bundles/admin-v2/constants/routes';
import isAdminV2Enabled from 'bundles/admin-v2/utils/AdminV2ExperimentUtils';

import { PROGRAM, COURSERA, DEGREE } from 'bundles/program-home/constants/SwitcherSelectionTypes';

const LoadableShoppingCart = createLoadableComponent(() => import('bundles/page/components/header/ShoppingCart'));
const LoadableSignoutButton = createLoadableComponent(() => import('bundles/page/components/header/SignoutButton'));

type AdminNavItem = {
  isHidden: boolean;
  href?: string;
  name: string;
  target: string;
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
  noBorder?: boolean;
};

type ProgramDegree = {
  program?: EnterpriseProgramsV1;
  degree?: Record<string, string>;
};

type PropsFromCaller = {
  className: string;
  userId: number;
  isStaff: boolean;
  rightNavButtons: Array<HeaderRightNavButtonType>;
  showShoppingCart: boolean;
  hideEnterprise?: boolean;
  hideNotificationCenter: boolean;
  handleProgramSwitcherToggle?: () => void;
  programs: Array<EnterpriseProgramsV1>;
  degrees: Array<Record<string, string>>;
  thirdPartyOrganizations?: Array<ThirdPartyOrganizationsV1>;
  showAdminLinks?: boolean;
  thirdPartyOrganizationId: string;
  adminPermission?: AdminPermission;
};

type PropsToComponent = PropsFromCaller & {
  thirdPartyOrganizations?: Array<ThirdPartyOrganizationsV1>;
};

export class AuthenticatedAccountInfo extends React.Component<PropsToComponent> {
  static contextTypes = {
    epic: PropTypes.object,
    router: PropTypes.object,
    executeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isStaff: false,
  };

  state = {
    isMounted: false,
  };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  handleHomepageSwitch = (isCoursera: boolean, { program, degree }: ProgramDegree) => {
    // MembershipCards will only be shown if the user is logged in
    const { executeAction } = this.context;
    const userId = user.get().id;
    if (isCoursera) {
      executeAction(selectProgramHomepage, {
        userId,
        selectionType: COURSERA,
      });
    } else if (program) {
      executeAction(selectProgramHomepage, {
        userId,
        selectionType: PROGRAM,
        programId: program.id,
        slug: program.program.definition.metadata.slug,
      });
    } else {
      executeAction(selectProgramHomepage, {
        userId,
        selectionType: DEGREE,
        degreeId: degree && degree.id,
        slug: degree && degree.slug,
      });
    }
  };

  renderAdminRightNavButtons() {
    const { showAdminLinks, adminPermission } = this.props;

    if (showAdminLinks) {
      const { router } = this.context;
      const {
        router: { params },
      } = this.context;
      const adminPageList: Array<AdminNavItem> = isAdminV2Enabled()
        ? getAdminV2Routes(params)
        : getAdminRoutes(adminPermission as AdminPermission);

      return adminPageList.map((item: AdminNavItem) => {
        if (!item.isHidden) {
          const isActive = router.location.pathname.includes(item.href);
          const currentPageLink = isActive ? 'current-page' : '';

          const adminRightNavProps = {
            label: item.name,
            name: item.name,
            wrapperClassName: `${currentPageLink}`,
            href: item.href,
            target: item.target,
            pathname: router.location.pathname,
          };
          return <AdminRightNavLink {...adminRightNavProps} />;
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  }

  renderRightNavButtons() {
    const { rightNavButtons } = this.props;
    const navButtons: Array<RightNavButtonsType> = [];
    Array.prototype.push.apply(navButtons, rightNavButtons);
    Array.prototype.push.apply(
      navButtons,
      // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'Readonly<PropsToComponent> & Rea... Remove this comment to see the full error message
      getAccountDropdownOptions(this.props).map((item: RightNavButtonsType) => {
        item.mobileOnly = true; // eslint-disable-line no-param-reassign
        return item;
      })
    );

    let removeFirstRightNavButtonBorder = false;
    return navButtons.map((navButtonProp) => {
      const newNavButtonProp = { ...navButtonProp };
      // removing the border of first visible right nav button
      if (!removeFirstRightNavButtonBorder && !navButtonProp.mobileOnly) {
        newNavButtonProp.noBorder = true;
        removeFirstRightNavButtonBorder = true;
      }
      return <HeaderRightNavButton {...newNavButtonProp} key={`rightnav-${newNavButtonProp.label}`} />;
    });
  }

  renderProgramsButtons() {
    const { programs } = this.props;
    return programs.map((program) => (
      <li className="c-ph-right-nav-button c-ph-right-nav-mobile-only" role="menuitem" key={program.id}>
        <button
          style={{
            border: 'none',
            width: '100%',
            background: 'none',
            textAlign: 'left',
          }}
          onClick={() => this.handleHomepageSwitch(false, { program })}
          type="button"
        >
          {program.name}
        </button>
      </li>
    ));
  }

  renderDegreesButtons() {
    const { degrees } = this.props;
    return degrees.map((degree) => (
      <li className="c-ph-right-nav-button c-ph-right-nav-mobile-only" role="menuitem" key={degree.id}>
        <button
          style={{
            border: 'none',
            width: '100%',
            background: 'none',
            textAlign: 'left',
          }}
          onClick={() => this.handleHomepageSwitch(false, { degree })}
          type="button"
        >
          {degree.name}
        </button>
      </li>
    ));
  }

  renderMyCourseraButton() {
    return (
      <li className="c-ph-right-nav-button c-ph-right-nav-mobile-only" role="menuitem">
        <button
          className="my-coursera"
          style={{
            border: 'none',
            width: '100%',
            background: 'none',
            textAlign: 'left',
          }}
          onClick={() => this.handleHomepageSwitch(true, {})}
          type="button"
        >
          {_t('My Coursera')}
        </button>
      </li>
    );
  }

  render() {
    const {
      isStaff,
      degrees,
      programs,
      thirdPartyOrganizations,
      showShoppingCart,
      hideNotificationCenter,
      hideEnterprise,
      showAdminLinks,
      className,
      thirdPartyOrganizationId,
    } = this.props;

    const { isMounted } = this.state;

    const dropdownProps = {
      isStaff,
      degrees,
      programs,
      thirdPartyOrganizations,
      thirdPartyOrganizationId,
      showAdminLinks: !!showAdminLinks,
    };

    // legacy backbone pages do not have router in context
    let hideAvatarBorder;

    const {
      router: { location },
    } = this.context;
    hideAvatarBorder = location.pathname.includes('enterprise') || location.pathname.includes('programs');

    hideAvatarBorder = hideAvatarBorder || hideEnterprise;
    const isNotificationCenterEnabled =
      !hideNotificationCenter && epic.get('NotificationCenter', 'notificationCenterEnabled');

    return (
      <ul id="authenticated-info-menu" className={className} role="none">
        {(!_.isEmpty(programs) || !_.isEmpty(degrees)) && this.renderMyCourseraButton()}
        {!_.isEmpty(programs) && this.renderProgramsButtons()}
        {!_.isEmpty(degrees) && this.renderDegreesButtons()}

        {isMounted && this.renderAdminRightNavButtons()}
        {isMounted && this.renderRightNavButtons()}

        <LoadableSignoutButton mobileOnly />

        {showShoppingCart && (
          <LoadableShoppingCart className="c-ph-right-nav-button" hideAvatarBorder={hideAvatarBorder} />
        )}

        {isNotificationCenterEnabled && (
          <li role="none">
            <ClientSideRenderedNotificationCenter />
          </li>
        )}

        <AuthenticatedAccountDropdown {...dropdownProps} hideAvatarBorder={hideAvatarBorder} label="" />
      </ul>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  // Next app doesn't support admin pages so need to make calls for potential admin users.
  branch(
    () => !isNextJSApp && typeof window !== 'undefined',
    compose(
      Naptime.createContainer(({ userId }: { userId: number }) => {
        return {
          enterpriseAdminRoles: EnterpriseAdminRolesV1.finder('byUser', {
            params: {
              userId,
            },
            fields: [
              'thirdPartyOrganizationId, thirdPartyOrganizations.v1(name,slug,rectangularLogo,squareLogo,primaryColor,landingPageBanner,loginMethod,programVisibilityRule)',
            ],
            includes: ['thirdPartyOrg'],
            required: false,
          }),
        };
      }),
      Naptime.createContainer(({ enterpriseAdminRoles }: { enterpriseAdminRoles: EnterpriseAdminRolesV1[] }) => {
        enterpriseAdminUser.setRoles(enterpriseAdminRoles);
        const thirdPartyOrganizationIds = enterpriseAdminUser.getOrganizationIdsToManage();

        return {
          thirdPartyOrganizations:
            thirdPartyOrganizationIds && thirdPartyOrganizationIds.length > 0
              ? ThirdPartyOrganizationsV1.multiGet(thirdPartyOrganizationIds, { required: false })
              : [],
        };
      })
    )
  )
)(AuthenticatedAccountInfo);
