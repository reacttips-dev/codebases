// If you are adding a new route, include the route to GAS screen mapping in
// `routeScreens` in packages/atlassian-analytics/src/getScreenFromUrl.ts
// and include the route to workspace getter mapping in
// `workspaceGetterMap` in packages/workspaces/src/getWorkspaceFromPathname.ts

export enum RouteId {
  ACCOUNT = 'account',
  BILLING = 'billing',
  BILLING_CARD = 'billingCard',
  BILLING_CARD_PRODUCT = 'billingCardProduct',
  BLANK = 'blank',
  BOARD = 'board',
  BOARD_OLD = 'boardOld',
  BOARD_REFERRAL = 'boardReferral',
  CARD = 'card',
  CARD_OLD = 'cardOld',
  CARD_AND_BOARD_OLD = 'cardAndBoardOld',
  CREATE_FIRST_BOARD = 'createFirstBoard',
  CREATE_FIRST_TEAM = 'createFirstTeam',
  DOUBLE_SLASH = 'doubleSlash',
  ENTERPRISE_ADMIN = 'enterpriseAdmin',
  ENTERPRISE_ADMIN_TAB = 'enterpriseAdminTab',
  ERROR_PAGE = 'errorPage',
  GO = 'go',
  GOLD_PROMO_FREE_TRIAL = 'goldPromoFreeTrial',
  INVITE_ACCEPT_BOARD = 'inviteAcceptBoard',
  INVITE_ACCEPT_TEAM = 'inviteAcceptTeam',
  MEMBER_ACTIVITY = 'memberActivity',
  MEMBER_ALL_BOARDS = 'memberAllBoards',
  MEMBER_CARDS = 'memberCards',
  MEMBER_CARDS_FOR_ORG = 'memberCardsForOrg',
  MEMBER_HOME = 'memberHome',
  MEMBER_HOME_BOARDS = 'memberHomeBoards',
  MEMBER_TASKS = 'memberTasks',
  ORGANIZATION_BY_ID = 'organizationById',
  ORGANIZATION_EXPORT = 'organizationExport',
  ORGANIZATION_FREE_TRIAL = 'organizationFreeTrial',
  ORGANIZATION_GUESTS = 'organizationGuests',
  ORGANIZATION_MEMBER_CARDS = 'organizationMemberCards',
  ORGANIZATION_MEMBERS = 'organizationMembers',
  ORGANIZATION_POWER_UPS = 'organizationPowerUps',
  ORGANIZATION_TABLES = 'organizationTables',
  POWER_UP_ADMIN = 'powerUpAdmin',
  POWER_UP_EDIT = 'powerUpEdit',
  POWER_UP_PUBLIC_DIRECTORY = 'powerUpPublicDirectory',
  PROFILE = 'profile',
  SEARCH = 'search',
  SELECT_ORG_TO_UPGRADE = 'selectOrgToUpgrade',
  SELECT_TEAM_TO_UPGRADE = 'selectTeamToUpgrade',
  SHORTCUTS = 'shortcuts',
  SHORTCUTS_OVERLAY = 'shortcutsOverlay',
  TEAM_GETTING_STARTED = 'teamGettingStarted',
  TEAM_HIGHLIGHTS = 'teamHighlights',
  TEAM_REPORTS = 'teamReports',
  TEMPLATES_SUBMIT = 'templatesSubmit',
  TEMPLATES = 'templates',
  TEMPLATES_RECOMMEND = 'templatesRecommend',
  TO = 'to',
  USER_OR_ORG = 'userOrOrg',
  WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW = 'workspaceDefaultCustomTableView',
  WORKSPACE_DEFAULT_MY_WORK_VIEW = 'workspaceDefaultMyWorkView',
  WORKSPACE_VIEW = 'workspaceView',
  WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW = 'workspaceDefaultCustomCalendarView',
}

interface RouteDefinition {
  id: RouteId;
  pattern: string;
  regExp: RegExp;
}

export const routes: Record<RouteId, RouteDefinition> = {
  [RouteId.ACCOUNT]: {
    id: RouteId.ACCOUNT,
    pattern: ':name/account',
    regExp: new RegExp('^([^/]+)/account$'),
  },
  [RouteId.BILLING]: {
    id: RouteId.BILLING,
    pattern: ':name/billing(?*query)',
    regExp: new RegExp('^([^/]+)/billing(?:\\?(.*?))?$'),
  },
  [RouteId.BILLING_CARD]: {
    id: RouteId.BILLING_CARD,
    pattern: ':name/billing/card',
    regExp: new RegExp('^([^/]+)/billing/card$'),
  },
  [RouteId.BILLING_CARD_PRODUCT]: {
    id: RouteId.BILLING_CARD_PRODUCT,
    pattern: ':name/billing/card/:product',
    regExp: new RegExp('^([^/]+)/billing/card/([^/]+)$'),
  },
  [RouteId.BLANK]: {
    id: RouteId.BLANK,
    pattern: 'blank',
    regExp: new RegExp('^blank$'),
  },
  [RouteId.BOARD]: {
    id: RouteId.BOARD,
    pattern: 'b/:shortLink(/*path)',
    regExp: new RegExp('^b/([^/]+)(?:/(.*?))?$'),
  },
  [RouteId.BOARD_OLD]: {
    id: RouteId.BOARD_OLD,
    pattern: 'board/*path',
    regExp: new RegExp('^board/(.*?)$'),
  },
  [RouteId.BOARD_REFERRAL]: {
    id: RouteId.BOARD_REFERRAL,
    pattern: 'b/:shortLink/:name/:referrerUsername/recommend',
    regExp: new RegExp('^b/([^/]+)/([^/]+)/([^/]+)/recommend$'),
  },
  [RouteId.CARD]: {
    id: RouteId.CARD,
    pattern: 'c/:id(/*path)',
    regExp: new RegExp('^c/([^/]+)(?:/(.*?))?$'),
  },
  [RouteId.CARD_OLD]: {
    id: RouteId.CARD_OLD,
    pattern: 'card/(:slug/):idBoard/:cardComponent',
    regExp: new RegExp('^card/(?:([^/]+)/)?([^/]+)/([^/]+)$'),
  },
  [RouteId.CARD_AND_BOARD_OLD]: {
    id: RouteId.CARD_AND_BOARD_OLD,
    pattern: 'card/board/(:slug/):idBoard/:cardComponent',
    regExp: new RegExp('^card/board/(?:([^/]+)/)?([^/]+)/([^/]+)$'),
  },
  [RouteId.CREATE_FIRST_BOARD]: {
    id: RouteId.CREATE_FIRST_BOARD,
    pattern: 'create-first-board(?*querystring)',
    regExp: new RegExp('^create-first-board(?:\\?(.*?))?$'),
  },
  [RouteId.CREATE_FIRST_TEAM]: {
    id: RouteId.CREATE_FIRST_TEAM,
    pattern: 'create-first-team',
    regExp: new RegExp('^create-first-team$'),
  },
  [RouteId.DOUBLE_SLASH]: {
    id: RouteId.DOUBLE_SLASH,
    pattern: '/*search',
    regExp: new RegExp('^/(.*?)$'),
  },
  [RouteId.ENTERPRISE_ADMIN]: {
    id: RouteId.ENTERPRISE_ADMIN,
    pattern: 'e/:name/admin',
    regExp: new RegExp('^e/([^/]+)/admin$'),
  },
  [RouteId.ENTERPRISE_ADMIN_TAB]: {
    id: RouteId.ENTERPRISE_ADMIN_TAB,
    pattern: 'e/:name/admin/*tab',
    regExp: new RegExp('^e/([^/]+)/admin/(.*?)$'),
  },
  [RouteId.ERROR_PAGE]: {
    id: RouteId.ERROR_PAGE,
    pattern: '*splat',
    regExp: new RegExp('^(.*?)$'),
  },
  [RouteId.GO]: {
    id: RouteId.GO,
    pattern: 'go/*search',
    regExp: new RegExp('^go/(.*?)$'),
  },
  [RouteId.INVITE_ACCEPT_BOARD]: {
    id: RouteId.INVITE_ACCEPT_BOARD,
    pattern: 'invite/accept-board',
    regExp: new RegExp('^invite/accept-board$'),
  },
  [RouteId.INVITE_ACCEPT_TEAM]: {
    id: RouteId.INVITE_ACCEPT_TEAM,
    pattern: 'invite/accept-team',
    regExp: new RegExp('^invite/accept-team$'),
  },
  [RouteId.MEMBER_ACTIVITY]: {
    id: RouteId.MEMBER_ACTIVITY,
    pattern: ':username/activity',
    regExp: new RegExp('^([^/]+)/activity$'),
  },
  [RouteId.MEMBER_ALL_BOARDS]: {
    id: RouteId.MEMBER_ALL_BOARDS,
    pattern: ':username/boards',
    regExp: new RegExp('^([^/]+)/boards$'),
  },
  [RouteId.MEMBER_CARDS]: {
    id: RouteId.MEMBER_CARDS,
    pattern: ':username/cards',
    regExp: new RegExp('^([^/]+)/cards$'),
  },
  [RouteId.MEMBER_CARDS_FOR_ORG]: {
    id: RouteId.MEMBER_CARDS_FOR_ORG,
    pattern: ':username/cards/:orgname',
    regExp: new RegExp('^([^/]+)/cards/([^/]+)$'),
  },
  [RouteId.MEMBER_HOME]: {
    id: RouteId.MEMBER_HOME,
    pattern: '',
    regExp: new RegExp('^$'),
  },
  [RouteId.MEMBER_HOME_BOARDS]: {
    id: RouteId.MEMBER_HOME_BOARDS,
    pattern: ':orgname/home',
    regExp: new RegExp('^([^/]+)/home$'),
  },
  [RouteId.MEMBER_TASKS]: {
    id: RouteId.MEMBER_TASKS,
    pattern: ':username/tasks',
    regExp: new RegExp('^([^/]+)/tasks$'),
  },
  [RouteId.ORGANIZATION_BY_ID]: {
    id: RouteId.ORGANIZATION_BY_ID,
    pattern: 'org/:id',
    regExp: new RegExp('^org/([^/]+)$'),
  },
  [RouteId.ORGANIZATION_EXPORT]: {
    id: RouteId.ORGANIZATION_EXPORT,
    pattern: ':name/export',
    regExp: new RegExp('^([^/]+)/export$'),
  },
  [RouteId.ORGANIZATION_FREE_TRIAL]: {
    id: RouteId.ORGANIZATION_FREE_TRIAL,
    pattern: ':name/free-trial',
    regExp: new RegExp('^([^/]+)/free-trial$'),
  },
  [RouteId.ORGANIZATION_GUESTS]: {
    id: RouteId.ORGANIZATION_GUESTS,
    pattern: ':name/members/guests',
    regExp: new RegExp('^([^/]+)/members/guests$'),
  },
  [RouteId.ORGANIZATION_MEMBER_CARDS]: {
    id: RouteId.ORGANIZATION_MEMBER_CARDS,
    pattern: ':name/:username/cards',
    regExp: new RegExp('^([^/]+)/([^/]+)/cards$'),
  },
  [RouteId.ORGANIZATION_MEMBERS]: {
    id: RouteId.ORGANIZATION_MEMBERS,
    pattern: ':name/members',
    regExp: new RegExp('^([^/]+)/members$'),
  },
  [RouteId.ORGANIZATION_POWER_UPS]: {
    id: RouteId.ORGANIZATION_POWER_UPS,
    pattern: ':name/power-ups',
    regExp: new RegExp('^([^/]+)/power-ups$'),
  },
  [RouteId.ORGANIZATION_TABLES]: {
    id: RouteId.ORGANIZATION_TABLES,
    pattern: ':name/tables(?*query)',
    regExp: new RegExp('^([^/]+)/tables(?:\\?(.*?))?$'),
  },
  [RouteId.POWER_UP_ADMIN]: {
    id: RouteId.POWER_UP_ADMIN,
    pattern: 'power-ups/admin(/:section)(/)',
    regExp: new RegExp('^power-ups/admin(?:/([^/]+))?(?:/)?$'),
  },
  [RouteId.POWER_UP_EDIT]: {
    id: RouteId.POWER_UP_EDIT,
    pattern: 'power-ups/:idPlugin/edit(/:subsection)(/)',
    regExp: new RegExp('^power-ups/([^/]+)/edit(?:/([^/]+))?(?:/)?$'),
  },
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: {
    id: RouteId.POWER_UP_PUBLIC_DIRECTORY,
    pattern: 'power-ups(/:section)(/:subsection)(/)',
    regExp: new RegExp('^power-ups(?:/([^/]+))?(?:/([^/]+))?(?:/)?$'),
  },
  [RouteId.PROFILE]: {
    id: RouteId.PROFILE,
    pattern: ':name/profile',
    regExp: new RegExp('^([^/]+)/profile$'),
  },
  [RouteId.SEARCH]: {
    id: RouteId.SEARCH,
    pattern: 'search(?*query)',
    regExp: new RegExp('^search(?:\\?(.*?))?$'),
  },
  [RouteId.SELECT_ORG_TO_UPGRADE]: {
    id: RouteId.SELECT_ORG_TO_UPGRADE,
    pattern: 'select-org-to-upgrade',
    regExp: new RegExp('^select-org-to-upgrade$'),
  },
  [RouteId.SELECT_TEAM_TO_UPGRADE]: {
    id: RouteId.SELECT_TEAM_TO_UPGRADE,
    pattern: 'select-team-to-upgrade',
    regExp: new RegExp('^select-team-to-upgrade$'),
  },
  [RouteId.SHORTCUTS]: {
    id: RouteId.SHORTCUTS,
    pattern: 'shortcuts',
    regExp: new RegExp('^shortcuts$'),
  },
  [RouteId.SHORTCUTS_OVERLAY]: {
    id: RouteId.SHORTCUTS_OVERLAY,
    pattern: 'shortcuts/overlay',
    regExp: new RegExp('^shortcuts/overlay$'),
  },
  [RouteId.TEAM_GETTING_STARTED]: {
    id: RouteId.TEAM_GETTING_STARTED,
    pattern: ':orgname/getting-started',
    regExp: new RegExp('^([^/]+)/getting-started$'),
  },
  [RouteId.TEAM_HIGHLIGHTS]: {
    id: RouteId.TEAM_HIGHLIGHTS,
    pattern: ':orgname/highlights',
    regExp: new RegExp('^([^/]+)/highlights$'),
  },
  [RouteId.TEAM_REPORTS]: {
    id: RouteId.TEAM_REPORTS,
    pattern: ':orgname/reports',
    regExp: new RegExp('^([^/]+)/reports$'),
  },
  [RouteId.TEMPLATES_SUBMIT]: {
    id: RouteId.TEMPLATES_SUBMIT,
    pattern: 'templates/submit',
    regExp: new RegExp('^templates/submit$'),
  },
  [RouteId.TEMPLATES]: {
    id: RouteId.TEMPLATES,
    pattern: 'templates(/:category)(/:templateSlug)(/)',
    regExp: new RegExp('^templates(?:/([^/]+))?(?:/([^/]+))?(?:/)?$'),
  },
  [RouteId.TEMPLATES_RECOMMEND]: {
    id: RouteId.TEMPLATES_RECOMMEND,
    pattern:
      'templates(/:category)(/:templateSlug)(/:referrerUsername)/recommend(/)',
    regExp: new RegExp(
      '^templates(?:/([^/]+))?(?:/([^/]+))?(?:/([^/]+))?/recommend(?:/)?$',
    ),
  },
  [RouteId.TO]: {
    id: RouteId.TO,
    pattern: 'to/*search',
    regExp: new RegExp('^to/(.*?)$'),
  },
  [RouteId.USER_OR_ORG]: {
    id: RouteId.USER_OR_ORG,
    pattern: ':name(/)',
    regExp: new RegExp('^([^/]+)(?:/)?$'),
  },
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]: {
    id: RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
    pattern: ':orgname/views/table(?*query)',
    regExp: new RegExp('^([^/]+)/views/table(?:\\?(.*?))?$'),
  },
  [RouteId.WORKSPACE_DEFAULT_MY_WORK_VIEW]: {
    id: RouteId.WORKSPACE_DEFAULT_MY_WORK_VIEW,
    pattern: ':orgname/views/my-work(?*query)',
    regExp: new RegExp('^([^/]+)/views/my-work(?:\\?(.*?))?$'),
  },
  [RouteId.WORKSPACE_VIEW]: {
    id: RouteId.WORKSPACE_VIEW,
    pattern: 'v/:shortLink(/*path)',
    regExp: new RegExp('^v/([^/]+)(?:/(.*?))?$'),
  },
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]: {
    id: RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
    pattern: ':orgname/views/calendar(?*query)',
    regExp: new RegExp('^([^/]+)/views/calendar(?:\\?(.*?))?$'),
  },
  [RouteId.GOLD_PROMO_FREE_TRIAL]: {
    id: RouteId.GOLD_PROMO_FREE_TRIAL,
    pattern: 'page/gold-promo-free-trial',
    regExp: new RegExp('^page/gold-promo-free-trial$'),
  },
};

/**
 * This represents the order in which the paths are matched by the router
 */
export const orderedRouteList: RouteDefinition[] = [
  /**
   * Quick Boards
   */
  routes.go,
  routes.to,
  routes.doubleSlash,
  /**
   * Power Ups
   */
  routes.powerUpAdmin,
  routes.powerUpEdit,
  routes.powerUpPublicDirectory,
  /**
   * Other
   */
  routes.createFirstTeam,
  routes.shortcuts,
  routes.shortcutsOverlay,
  routes.blank,
  routes.selectOrgToUpgrade,
  routes.selectTeamToUpgrade,
  routes.search,
  routes.templates,
  routes.templatesRecommend,
  routes.templatesSubmit,
  /**
   * Invitation
   */
  routes.inviteAcceptBoard,
  routes.inviteAcceptTeam,
  /**
   * Board
   */
  routes.boardOld,
  routes.boardReferral,
  routes.board,
  routes.cardAndBoardOld,
  routes.cardOld,
  routes.card,
  routes.createFirstBoard,
  /**
   * Gold Sunset
   */
  routes.goldPromoFreeTrial,
  /**
   * User or Org
   */
  routes.account,
  routes.profile,
  routes.billing,
  routes.billingCard,
  routes.billingCardProduct,
  routes.userOrOrg,
  /**
   * Enterprise
   */
  routes.enterpriseAdmin,
  routes.enterpriseAdminTab,
  /**
   * Member
   */
  routes.memberHome,
  routes.memberHomeBoards,
  routes.teamHighlights,
  routes.teamGettingStarted,
  routes.teamReports,
  routes.memberAllBoards,
  routes.memberCards,
  routes.memberCardsForOrg,
  routes.memberActivity,
  routes.memberTasks,
  /**
   * Organization
   */
  routes.organizationById,
  routes.organizationGuests,
  routes.organizationMembers,
  routes.organizationMemberCards,
  routes.organizationExport,
  routes.organizationPowerUps,
  routes.organizationTables,
  routes.organizationFreeTrial,
  /**
   * View
   */
  routes.workspaceDefaultMyWorkView,
  routes.workspaceView,
  routes.workspaceDefaultCustomTableView,
  routes.workspaceDefaultCustomCalendarView,
  /**
   * Catch all
   */
  routes.errorPage,
];
