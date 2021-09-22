import { applicationStoreIn } from 'bundles/page/lib/migration';
import link from 'bundles/mobile/lib/link';

import { selectProgramHomepage } from 'bundles/program-home/utils/ProgramSwitcherSelectionsAPIUtils';
import redirect from 'js/lib/coursera.redirect';

import type { NavButtonType } from 'bundles/page/components/header/mobile/constants';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import type { MODES } from 'bundles/authentication/shared/components/authentication-modal/AuthenticationContent';

const getUserAgent = (component: React.Component) => {
  return applicationStoreIn(component) && component.context.getStore('ApplicationStore').getUserAgent();
};

const getRequestCountryCode = (component: React.Component) => {
  return applicationStoreIn(component) && component.context.getStore('ApplicationStore').getRequestCountryCode();
};

const isAndroidOrIOS = (component: React.Component) => {
  const userAgent = getUserAgent(component);
  return userAgent && (userAgent.isIOS || userAgent.isAndroid);
};

export const returnIOSButtonIfApplicable = (component: React.Component): NavButtonType | null => {
  if (!isAndroidOrIOS(component)) return null;

  // @ts-ignore ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
  const appLink: string = link.getAppUrl(
    getUserAgent(component),
    component.context.router.location.pathname,
    getRequestCountryCode(component)
  );
  return {
    href: appLink as string,
    label: 'Get Our App',
    name: 'get-app',
  };
};

export const getTabIndex = (showNav: boolean) => (showNav ? 0 : -1);

export const redirectToMyCourseraAndUpdateUserProgram = ({ userId }: { userId: number | string }) => {
  selectProgramHomepage(userId.toString(), 'COURSERA')
    .then(() => redirect.setLocation('/'))
    .done();
};

export const mapDegreesAndProgramsToNavButtonObjects = ({ degrees, programs }: $TSFixMe) => {
  let degreeButtonObjs = [];
  let programButtonObjs = [];

  // .reverse() is currently being used to conform this util function to the previous
  // unshift-based accumulation implementation in it's previous location. This is used
  // to preserve the previous ordering.
  if (degrees.length) {
    degreeButtonObjs = degrees.reverse().map(({ name, slug }: $TSFixMe) => ({
      href: `/degrees/${slug}/home`,
      label: name,
      name,
    }));
  }
  if (programs.length) {
    programButtonObjs = programs.reverse().map(({ metadata: { name, slug } }: $TSFixMe) => ({
      href: `/programs/${slug}`,
      label: name,
      name,
    }));
  }

  return [...programButtonObjs, ...degreeButtonObjs];
};

export const getCombinedQueryWithAuthMode = (router: InjectedRouter, authMode: MODES) => {
  return {
    ...router.location.query,
    authMode,
  };
};
