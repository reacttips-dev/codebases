// These functions are kept outside Util class to minimize external dependencies on the homepage bundle
import { PageService } from '../../appsdk/services/PageService';
import { HOME, HOME_DEFAULT, SEARCH, EXPLORE, WORKSPACE, PROFILE } from '../navigation/active-mode/constants';

/**
 * Returns a boolean value to denote if the active page should be responsive
 * Page responsiveness is applicable only on webapp
 * @returns boolean
 */
 export function isResponsivePage () {
  if (window.SDK_PLATFORM !== 'browser') return false;

  const activePage = PageService.activePage,
    isLoggedOut = window.USER_ID === '0' || window.USER_ID === '',
    responsivePagesList = [HOME, HOME_DEFAULT, SEARCH, EXPLORE];

  return isLoggedOut && responsivePagesList.includes(activePage);
}

/**
 * Returns a boolean value to denote if the active page should have marketing header
 * Marketing header will be shown only on webapp
 * @returns boolean
 */
 export function isMarketingHeaderPage () {
  if (window.SDK_PLATFORM !== 'browser') return false;

  const activePage = PageService.activePage,
    isLoggedOut = window.USER_ID === '0' || window.USER_ID === '',
    marketingHeaderPagesList = [HOME, HOME_DEFAULT, SEARCH, EXPLORE, WORKSPACE, PROFILE, '']; // initially activePages is empty string on workspace page

  return isLoggedOut && marketingHeaderPagesList.includes(activePage);
}

/**
 * Returns a boolean value to denote if the active page is signed out Workspace
 * @returns boolean
 */
export function isSignedOutWorkspaceViewOnArtemis () {
  if (window.SDK_PLATFORM !== 'browser') return false;

  const activePage = PageService.activePage,
    isLoggedOut = window.USER_ID === '0' || window.USER_ID === '',
    workspaceHeaderPagesList = [WORKSPACE, '']; // initially activePages is empty string on workspace page

  return isLoggedOut && workspaceHeaderPagesList.includes(activePage);
}
