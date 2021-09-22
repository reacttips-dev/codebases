import Naptime from 'bundles/naptimejs';
import ProfilesV1 from 'bundles/naptimejs/resources/profiles.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProgramMembershipsV2 from 'bundles/naptimejs/resources/programMemberships.v2';
import ProfileConsentsV1 from 'bundles/naptimejs/resources/profileConsents.v1';
import EnterpriseAdminRolesV1 from 'bundles/naptimejs/resources/enterpriseAdminRoles.v1';
import createLoadableComponent from 'js/lib/createLoadableComponent';

import connectToRouter from 'js/lib/connectToRouter';
import { compose, branch, setDisplayName, renderComponent } from 'recompose';
import user from 'js/lib/user';
import cookie from 'js/lib/cookie';

import { isNextJSApp } from 'bundles/next/utils/envUtils';

import atob from 'atob';

const LoadableGDPRPage = createLoadableComponent(() => import('bundles/common/components/GDPRPage'));

const branchGDPRNaptime = (Component: any) =>
  compose(
    connectToRouter((router) => {
      const queryParams = router.location.query;
      return { showGdprWallOverride: queryParams.showGdprWallOverride === 'true' };
    }),
    Naptime.createContainer(() => {
      const userId = user.get().id;
      return {
        profileConsents: ProfileConsentsV1.get(userId, {}),
        profile: ProfilesV1.get(userId, {}),
        enterpriseAdminRoles: EnterpriseAdminRolesV1.finder('byUser', {
          params: { userId },
          fields: !isNextJSApp
            ? [
                'thirdPartyOrganizationId, thirdPartyOrganizations.v1(name,slug,rectangularLogo,squareLogo,primaryColor,landingPageBanner,loginMethod,programVisibilityRule)',
              ]
            : ['thirdPartyOrganizationId'],
          includes: ['thirdPartyOrg'],
        }),
        programMembershipsV2: ProgramMembershipsV2.finder('byUser', { params: { userId } }),
      };
    }),
    branch(
      // @ts-expect-error TSMIGRATION
      (props) => props.showGdprWallOverride || props.profileConsents?.requireGdprConsent,
      renderComponent(LoadableGDPRPage)
    ),
    setDisplayName(`branchGDPRNaptime(${Component.displayName || Component.name})`)
  )(Component);

// If cookie called `profileconsent` can be found, use it and attempt to retrieve cached results for a user's GDPR consent
export const isMissingConsent = () => {
  try {
    const userId = user.get().id;
    const profileConsentCacheCookie = cookie.get('profileconsent');
    if (profileConsentCacheCookie) {
      const profileConsentCacheValue = JSON.parse(atob(profileConsentCacheCookie));

      return !(profileConsentCacheValue[userId].gdprRequired === false);
    } else {
      return true;
    }
  } catch (err) {
    // Fallback gracefully to checking for GDPR
    return true;
  }
};

export default (Component: any) =>
  compose(
    branch(() => user.isAuthenticatedUser() && isMissingConsent(), renderComponent(branchGDPRNaptime(Component))),
    setDisplayName(`branchGDPR(${Component.displayName || Component.name})`)
  )(Component);
