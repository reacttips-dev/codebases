import { RouteId, getRouteIdFromPathname } from '@trello/routes';
import { SourceType } from '../src/constants/Source';

export const routeScreens: Record<RouteId, SourceType> = {
  [RouteId.ACCOUNT]: 'memberAccountScreen',
  [RouteId.BILLING]: 'billingRoute', // memberBillingScreen', workspaceBillingScreen
  [RouteId.BILLING_CARD]: 'billingCardRoute',
  [RouteId.BILLING_CARD_PRODUCT]: 'billingCardProductRoute',
  [RouteId.BLANK]: 'blankScreen',
  [RouteId.BOARD]: 'boardScreen',
  [RouteId.BOARD_OLD]: 'boardScreen',
  [RouteId.BOARD_REFERRAL]: 'boardReferralRoute',
  [RouteId.CARD]: 'cardDetailScreen',
  [RouteId.CARD_OLD]: 'cardDetailScreen',
  [RouteId.CARD_AND_BOARD_OLD]: 'cardAndBoardRoute',
  [RouteId.CREATE_FIRST_BOARD]: 'createFirstBoardScreen',
  [RouteId.CREATE_FIRST_TEAM]: 'moonshotCreateTeamScreen',
  [RouteId.DOUBLE_SLASH]: 'doubleSlashSearchRoute',
  [RouteId.ENTERPRISE_ADMIN]: 'enterpriseAdminDashboardScreen',
  [RouteId.ENTERPRISE_ADMIN_TAB]: 'enterpriseAdminDashboardTabRoute',
  [RouteId.ERROR_PAGE]: 'pageNotFoundErrorScreen',
  [RouteId.GO]: 'goSearchRoute',
  [RouteId.GOLD_PROMO_FREE_TRIAL]: 'goldPromoFreeTrialScreen',
  [RouteId.INVITE_ACCEPT_BOARD]: 'acceptBoardInvitationScreen',
  [RouteId.INVITE_ACCEPT_TEAM]: 'acceptTeamInvitationScreen',
  [RouteId.MEMBER_ACTIVITY]: 'memberActivityScreen',
  [RouteId.MEMBER_ALL_BOARDS]: 'memberBoardsHomeScreen',
  [RouteId.MEMBER_CARDS]: 'memberCardsScreen',
  [RouteId.MEMBER_CARDS_FOR_ORG]: 'memberCardsScreen',
  [RouteId.MEMBER_HOME]: 'memberHomeScreen',
  [RouteId.MEMBER_HOME_BOARDS]: 'workspaceBoardsHomeScreen',
  [RouteId.MEMBER_TASKS]: 'memberTasksRoute', // on memberHomeScreen
  [RouteId.ORGANIZATION_BY_ID]: 'workspaceBoardsScreen',
  [RouteId.ORGANIZATION_EXPORT]: 'workspaceExportScreen',
  [RouteId.ORGANIZATION_FREE_TRIAL]: 'freeTrialModal',
  [RouteId.ORGANIZATION_GUESTS]: 'workspaceGuestsScreen',
  [RouteId.ORGANIZATION_MEMBER_CARDS]: 'memberCardsScreen',
  [RouteId.ORGANIZATION_MEMBERS]: 'workspaceMembersScreen',
  [RouteId.ORGANIZATION_POWER_UPS]: 'workspacePowerUpsScreen',
  [RouteId.ORGANIZATION_TABLES]: 'multiBoardTableViewScreen',
  [RouteId.POWER_UP_ADMIN]: 'powerUpsAdminScreen',
  [RouteId.POWER_UP_EDIT]: 'powerUpEditScreen',
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: 'publicDirectoryRoute', // publicDirectoryCategoryScreen', publicDirectoryHomeScreen
  [RouteId.PROFILE]: 'profileAndVisibilitySettingsScreen',
  [RouteId.SEARCH]: 'searchRoute', // searchScreen', searchResultsScreen
  [RouteId.SELECT_ORG_TO_UPGRADE]: 'selectWorkspaceToUpgradeScreen',
  [RouteId.SELECT_TEAM_TO_UPGRADE]: 'selectWorkspaceToUpgradeScreen',
  [RouteId.SHORTCUTS]: 'shortcutsScreen',
  [RouteId.SHORTCUTS_OVERLAY]: 'shortcutsScreen',
  [RouteId.TEAM_GETTING_STARTED]: 'workspaceGettingStartedScreen',
  [RouteId.TEAM_HIGHLIGHTS]: 'workspaceHighlightsScreen',
  [RouteId.TEAM_REPORTS]: 'enterpriseWorkspaceReportScreen',
  [RouteId.TEMPLATES_SUBMIT]: 'templatesSubmitScreen',
  [RouteId.TEMPLATES]: 'templateGalleryScreen',
  [RouteId.TEMPLATES_RECOMMEND]: 'templateStoryPageScreen',
  [RouteId.TO]: 'toSearchRoute',
  [RouteId.USER_OR_ORG]: 'userOrOrgRoute',
  [RouteId.WORKSPACE_DEFAULT_MY_WORK_VIEW]: 'WorkspaceDefaultMyWorkViewScreen',
  [RouteId.WORKSPACE_VIEW]: 'workspaceViewScreen',
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]:
    'workspaceDefaultCustomTableViewScreen',
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    'workspaceDefaultCustomCalendarViewScreen',
};

interface GetScreenFromUrlArgs {
  orgName?: string;
  url?: URL;
}

/**
 * Returns the GAS SourceType mapped to the URL pathname. Use in GAS
 * analytics events when `source` is dynamic or unknown.
 *
 * @param {string} [orgName=] (optional) Use orgName to match workspaceBoardsScreen instead of generic userOrOrgRoute
 * @param {string} [url=window.location.href] (optional) Default is `window.location.href`.
 * @example
 * // sends GAS track event with dynamic source based on current URL
 * Analytics.sendTrackEvent({
 *    action: 'created',
 *    actionSubject: 'card',
 *    source: getScreenFromUrl()
 * })
 * @example
 * // returns 'boardScreen'
 * getScreenFromUrl('https://trellis.coffee/b/GuE7gK2m');
 * @example
 * // returns 'workspaceBoardsScreen'
 * getScreenFromUrl({
 *    orgName: 'trelloinc',
 *    url: 'https://trellis.coffee/trelloinc',
 * });
 * @example
 * // returns 'userOrOrgRoute'
 * getScreenFromUrl({ url: 'https://trellis.coffee/trelloinc' });
 *
 */
export const getScreenFromUrl = ({
  orgName = '',
  url = new URL(window.location.href),
}: GetScreenFromUrlArgs = {}): SourceType => {
  let routeId: RouteId;
  try {
    routeId = getRouteIdFromPathname(url.pathname);
  } catch (err) {
    // If no route id match, return 'unknownScreen'
    return 'unknownScreen';
  }

  const screen = routeScreens[routeId];
  const firstPathSegment = url.pathname.split('/')[1];
  if (orgName && firstPathSegment === orgName && screen === 'userOrOrgRoute') {
    // If the route matches userOrOrgRoute', check against provided org info
    // to see whether it's definitively an org route
    return 'workspaceBoardsScreen';
  }
  return screen;
};
