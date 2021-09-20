/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { importWithRetry } = require('@trello/use-lazy-component');

const $ = require('jquery');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { sendChunkLoadErrorEvent } = require('@trello/error-reporting');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const Dialog = require('app/scripts/views/lib/dialog');
const DragSort = require('app/scripts/views/lib/drag-sort');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const { LabelState } = require('app/scripts/view-models/label-state');
const Layout = require('app/scripts/views/lib/layout');
const ListListView = require('app/scripts/views/list/list-list-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { BoardClosed } = require('app/scripts/views/templates/BoardClosed');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const { featureFlagClient } = require('@trello/feature-flag-client');
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');
const {
  BoardSidebarLoadingError,
} = require('app/src/components/BoardSidebarLoadingError');
const isDesktop = require('@trello/browser').isDesktop();
const { undoAction, redoAction } = require('app/scripts/lib/last-action');

const {
  renderTeamOnboardingPupPopover,
  renderTeamOnboardingPupTooltip,
  unmountTeamOnboardingPupPopover,
  unmountTeamOnboardingPupTooltip,
} = require('./board-view-team-onboarding-pups');
const {
  renderGettingStartedTip,
  unmountGettingStartedTip,
} = require('./board-view-getting-started-tip');
const {
  onMemberAdd,
  renderBoardHeaderFacepile,
  openAllMembers,
  openAddMembers,
  joinBoard,
  showMemberProfile,
} = require('./board-view-member');
const {
  getAllBackgroundClasses,
  defaultBoardBackground,
  clearBoardBackground,
  renderBoardBackground,
  renderBoardHeaderSubscribed,
} = require('./board-view-background');
const {
  isTemplate,
  renderBoardTemplateReactSection,
  renderBoardTemplateBadge,
} = require('./board-view-template');
const {
  _applySettings,
  renderOpen,
  _shouldCloseBoardMenu,
  _isFirstBoardEverLoaded,
  _isGhostUsingInviteLink,
  removeSidebarDisplayTypes,
  renderSidebarDisplayType,
  showSidebarOnOpen,
  renderSidebarState,
  toggleSidebar,
  setSidebarShow,
  showSidebar,
  hideSidebar,
} = require('./board-view-sidebar');
const {
  permChange,
  renderPermissionLevel,
  changeVis,
  addBoardToTeam,
} = require('./board-view-permission');
const {
  openListComposer,
  scrollToList,
  viewForList,
  postListListRender,
  renderLists,
  sortCommit,
} = require('./board-view-list');
const {
  openCardComposerInFirstList,
  scrollToCard,
  preventScrollSelection,
  moveCard,
  dblClickAddListMenu,
  _insertCardPosition,
  moveCardRequested,
  copyCardRequested,
} = require('./board-view-card');
const { markRelatedNotificationsRead } = require('./board-view-notifications');
const { renderInviteeOrientation } = require('./board-view-onboarding');
const {
  renderOrgChanges,
  refreshOrganization,
  openOrgMenu,
} = require('./board-view-organization');
const { renderBoardWarnings } = require('./board-view-limit');
const { openUnsubscribe } = require('./board-view-unsubscribe');
const { reopen, _delete } = require('./board-view-open-close-delete');
const { copyBoard } = require('./board-view-copy');
const {
  onWorkspacesPreambleCreateTeamSuccess,
  renderWorkspacesPreambleBoardHeaderButton,
  unmountWorkspacesPreambleBoardHeaderButton,
  renderWorkspacesPreambleInviteButton,
  unmountWorkspacesPreambleInviteButton,
  renderWorkspacesAutoNameAlert,
  unmountWorkspacesAutoNameAlert,
} = require('./board-view-collaboration');
const {
  reloadCustomFields,
  renderPluginButtons,
  renderBoardHeaderCalendar,
  renderPluginDropdownList,
  navigateToBoard,
  closeDetailView,
  clickCloseDirectory,
  toggleDirectory,
  navigateToDirectory,
  showDirectory,
  closeDirectory,
  toggleCalendar,
  dismissFeedback,
  navigateToCalendarEvent,
  navigateToCalendar,
  navigateToBoardEvent,
  isShowingCalendar,
  showCalendar,
  closeCalendar,
  toggleFilter,
  showFilter,
  closeFilter,
  toggleMap,
  navigateToMapEvent,
  navigateToMap,
  showMap,
  closeMap,
  renderBoardHeaderMap,
  showDashboard,
  isButlerViewActive,
  toggleButlerView,
  showButlerView,
  setButlerView,
  navigateToButlerView,
  navigateToButler,
  showButler,
  closeButler,
  showPowerUpView,
  closePowerUpView,
} = require('../plugin/plugin-board-view');
const {
  renderBoardHeader,
  renderBoardHeaderStarred,
  toggleStarred,
  openFilter,
  clearFilters,
  showCleanUp,
  renderBoardViewsButton,
  renderBoardHeaderFilterButton,
  getBoardViewsButtonOptions,
  loadPowerUpViewsButtonOptions,
  getPowerUpViewOptions,
  removeBoardViewsButton,
  showTimeline,
  showCalendarView,
  showTable,
  closeSingleBoardView,
  renderButlerBoardButtons,
  navigateToAutomaticReports,
  showAutomaticReports,
  closeAutomaticReports,
} = require('./board-view-header');
const {
  saveBoardName,
  keyDownEvent,
  onInputChanged,
  startRenaming,
  stopRenaming,
  updateControllerTitle,
} = require('./board-view-name');
const {
  closeInviteAcceptanceNotification,
  buildInviteAcceptanceNotification,
  getNewlySignedUpInvitees,
  renderPopovers,
  renderInviteAcceptanceNotification,
  unmountInviteAcceptanceNotification,
} = require('./board-view-invitation');

const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

const isBoardHeaderFilterEnabled = featureFlagClient.get(
  'ecosystem.board-header-filter',
  false,
);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardView extends View {
  static initClass() {
    this.prototype.className = 'board-wrapper';

    this.prototype.displayName = 'BoardView';

    this.prototype.events = {
      sortcommit: 'sortCommit',

      // For renaming boards in modern browsers
      'keydown .js-board-name-input': 'keyDownEvent',
      'input .js-board-name-input': 'onInputChanged',
      'change .js-board-name-input': 'onInputChanged',
      // Firefox uses "change" rather than "input"
      'blur .js-board-name-input': 'stopRenaming',
      'click .js-board-editing-target': 'startRenaming',

      'click .js-open-org-menu': 'openOrgMenu',

      'click .js-add-board-to-team:not(.no-edit)': 'addBoardToTeam',
      'click .js-change-vis': 'changeVis',
      'click .js-close-calendar': 'toggleCalendar',
      'click .js-calendar': 'toggleCalendar',
      'click .js-disable-feedback': 'dismissFeedback',
      'click .js-close-map': 'toggleMap',
      'click .js-map-btn': 'toggleMap',
      'click .js-header-filter-btn': 'toggleFilter',
      'click .js-close-filter': 'toggleFilter',
      'click .js-close-dashboard': 'navigateToBoard',

      'click .js-filter-cards-indicator': 'openFilter',
      'click .js-filter-card-clear': 'clearFilters',
      'click .js-board-header-subscribed': 'openUnsubscribe',

      'click .js-star-board': 'toggleStarred',

      'click .js-show-sidebar'(e) {
        Analytics.sendClickedLinkEvent({
          linkName: 'boardMenuDrawerToggleLink',
          source: 'boardScreen',
          containers: {
            board: {
              id: this.model.id,
            },
            organization: {
              id: __guard__(this.model.getOrganization(), (x1) => x1.id),
            },
          },
        });
        return this.setSidebarShow();
      },

      'click .js-dismiss-warning'(e) {
        TrelloStorage.set(
          this.$(e.currentTarget).attr('data-dismiss'),
          Date.now(),
        );
        return this.renderBoardWarnings();
      },

      'dblclick #board': 'dblClickAddListMenu',
      'click #board': 'blurInputsOnBoardClick',

      'click .js-reopen': 'reopen',
      'click .js-delete': 'delete',

      'click .js-clean-up': 'showCleanUp',

      'prevent-scroll-selection': 'preventScrollSelection',

      'click .js-close-directory': 'clickCloseDirectory',

      'click .js-copy-board': 'copyBoard',
      'click .js-open-show-all-board-members': 'openAllMembers',
      'click .js-open-manage-board-members': 'openAddMembers',
      'click .js-join-board': 'joinBoard',
    };

    this.prototype.onMemberAdd = onMemberAdd;

    this.prototype.isTemplate = isTemplate;

    this.prototype.renderBoardTemplateReactSection = renderBoardTemplateReactSection;

    this.prototype.renderBoardTemplateBadge = renderBoardTemplateBadge;

    this.prototype._applySettings = _applySettings;

    this.prototype.permChange = permChange;

    this.prototype.openListComposer = openListComposer;

    this.prototype.openCardComposerInFirstList = openCardComposerInFirstList;

    this.prototype.scrollToList = scrollToList;

    this.prototype.viewForList = viewForList;

    this.prototype.scrollToCard = scrollToCard;

    this.prototype.preventScrollSelection = preventScrollSelection;

    this.prototype.markRelatedNotificationsRead = markRelatedNotificationsRead;

    this.prototype.moveCard = moveCard;

    this.prototype.renderTeamOnboardingPupPopover = renderTeamOnboardingPupPopover;

    this.prototype.renderTeamOnboardingPupTooltip = renderTeamOnboardingPupTooltip;

    this.prototype.unmountTeamOnboardingPupPopover = unmountTeamOnboardingPupPopover;
    this.prototype.unmountTeamOnboardingPupTooltip = unmountTeamOnboardingPupTooltip;

    this.prototype.renderGettingStartedTip = renderGettingStartedTip;
    this.prototype.unmountGettingStartedTip = unmountGettingStartedTip;

    this.prototype._shouldCloseBoardMenu = _shouldCloseBoardMenu;

    this.prototype._isFirstBoardEverLoaded = _isFirstBoardEverLoaded;

    this.prototype._isGhostUsingInviteLink = _isGhostUsingInviteLink;

    this.prototype.renderOpen = renderOpen;

    this.prototype.removeSidebarDisplayTypes = removeSidebarDisplayTypes;

    this.prototype.renderSidebarDisplayType = renderSidebarDisplayType;

    this.prototype.showSidebarOnOpen = showSidebarOnOpen;

    this.prototype.renderSidebarState = renderSidebarState;

    this.prototype.toggleSidebar = toggleSidebar;

    this.prototype.setSidebarShow = setSidebarShow;

    this.prototype.showSidebar = showSidebar;

    this.prototype.hideSidebar = hideSidebar;

    this.prototype.renderOrgChanges = renderOrgChanges;

    this.prototype.refreshOrganization = refreshOrganization;

    this.prototype.reloadCustomFields = reloadCustomFields;

    this.prototype.renderBoardHeader = renderBoardHeader;

    this.prototype.renderBoardWarnings = renderBoardWarnings;

    this.prototype.renderPluginButtons = renderPluginButtons;

    this.prototype.renderBoardHeaderStarred = renderBoardHeaderStarred;

    this.prototype.toggleStarred = toggleStarred;

    this.prototype.renderBoardHeaderCalendar = renderBoardHeaderCalendar;

    this.prototype.renderPluginDropdownList = renderPluginDropdownList;

    this.prototype.getAllBackgroundClasses = getAllBackgroundClasses;

    this.prototype.defaultBoardBackground = defaultBoardBackground;

    this.prototype.clearBoardBackground = clearBoardBackground;

    this.prototype.renderBoardBackground = renderBoardBackground;

    this.prototype.renderBoardHeaderSubscribed = renderBoardHeaderSubscribed;

    this.prototype.renderBoardViewsButton = renderBoardViewsButton;

    this.prototype.getBoardViewsButtonOptions = getBoardViewsButtonOptions;

    this.prototype.loadPowerUpViewsButtonOptions = loadPowerUpViewsButtonOptions;

    this.prototype.getPowerUpViewOptions = getPowerUpViewOptions;

    this.prototype.removeBoardViewsButton = removeBoardViewsButton;

    this.prototype.saveBoardName = saveBoardName;

    this.prototype.keyDownEvent = keyDownEvent;

    this.prototype.onInputChanged = onInputChanged;

    this.prototype.startRenaming = startRenaming;

    this.prototype.stopRenaming = stopRenaming;

    this.prototype.openOrgMenu = openOrgMenu;

    this.prototype.renderPermissionLevel = renderPermissionLevel;

    this.prototype.postListListRender = postListListRender;

    this.prototype.renderLists = renderLists;

    this.prototype.sortCommit = sortCommit;

    this.prototype.closeInviteAcceptanceNotification = closeInviteAcceptanceNotification;

    this.prototype.buildInviteAcceptanceNotification = buildInviteAcceptanceNotification;

    this.prototype.getNewlySignedUpInvitees = getNewlySignedUpInvitees;

    this.prototype.renderPopovers = renderPopovers;

    this.prototype.renderInviteAcceptanceNotification = renderInviteAcceptanceNotification;

    this.prototype.unmountInviteAcceptanceNotification = unmountInviteAcceptanceNotification;

    this.prototype.renderBoardHeaderFacepile = renderBoardHeaderFacepile;

    this.prototype.openAllMembers = openAllMembers;

    this.prototype.openAddMembers = openAddMembers;

    this.prototype.joinBoard = joinBoard;

    this.prototype.changeVis = changeVis;

    this.prototype.addBoardToTeam = addBoardToTeam;

    this.prototype.toggleCalendar = toggleCalendar;

    this.prototype.dismissFeedback = dismissFeedback;

    this.prototype.navigateToCalendarEvent = navigateToCalendarEvent;

    this.prototype.navigateToCalendar = navigateToCalendar;

    this.prototype.navigateToBoardEvent = navigateToBoardEvent;

    this.prototype.navigateToBoard = navigateToBoard;

    this.prototype.isShowingCalendar = isShowingCalendar;

    this.prototype.toggleMap = toggleMap;

    this.prototype.toggleFilter = toggleFilter;

    this.prototype.showFilter = showFilter;

    this.prototype.closeFilter = closeFilter;

    this.prototype.navigateToMapEvent = navigateToMapEvent;

    this.prototype.navigateToMap = navigateToMap;

    this.prototype.isButlerViewActive = isButlerViewActive;

    this.prototype.toggleButlerView = toggleButlerView;

    this.prototype.showButlerView = showButlerView;

    this.prototype.setButlerView = setButlerView;

    this.prototype.navigateToButler = navigateToButler;

    this.prototype.navigateToButlerView = navigateToButlerView;

    this.prototype.showMemberProfile = showMemberProfile;

    this.prototype.showCalendar = showCalendar;

    this.prototype.showMap = showMap;

    this.prototype.showPowerUpView = showPowerUpView;

    this.prototype.closePowerUpView = closePowerUpView;

    this.prototype.showDashboard = showDashboard;

    this.prototype.showButler = showButler;

    this.prototype.closeDetailView = closeDetailView;

    this.prototype.closeCalendar = closeCalendar;

    this.prototype.closeMap = closeMap;

    this.prototype.closeButler = closeButler;

    this.prototype.clickCloseDirectory = clickCloseDirectory;

    this.prototype.toggleDirectory = toggleDirectory;

    this.prototype.navigateToDirectory = navigateToDirectory;

    this.prototype.showDirectory = showDirectory;

    this.prototype.closeDirectory = closeDirectory;

    this.prototype.showTimeline = showTimeline;

    this.prototype.showCalendarView = showCalendarView;

    this.prototype.showTable = showTable;

    this.prototype.closeSingleBoardView = closeSingleBoardView;

    this.prototype.renderBoardHeaderFilterButton = renderBoardHeaderFilterButton;

    this.prototype.openFilter = openFilter;

    this.prototype.clearFilters = clearFilters;

    this.prototype.openUnsubscribe = openUnsubscribe;

    this.prototype.dblClickAddListMenu = dblClickAddListMenu;

    this.prototype.reopen = reopen;

    this.prototype.delete = _delete;

    this.prototype.updateControllerTitle = updateControllerTitle;

    this.prototype.copyBoard = copyBoard;

    this.prototype._insertCardPosition = _insertCardPosition;

    this.prototype.moveCardRequested = moveCardRequested;

    this.prototype.copyCardRequested = copyCardRequested;

    this.prototype.showCleanUp = showCleanUp;

    this.prototype.renderInviteeOrientation = renderInviteeOrientation;

    this.prototype.renderBoardHeaderMap = renderBoardHeaderMap;

    this.prototype.unmountWorkspacesPreambleBoardHeaderButton = unmountWorkspacesPreambleBoardHeaderButton;

    this.prototype.renderWorkspacesPreambleBoardHeaderButton = renderWorkspacesPreambleBoardHeaderButton;

    this.prototype.onWorkspacesPreambleCreateTeamSuccess = onWorkspacesPreambleCreateTeamSuccess;

    this.prototype.renderWorkspacesPreambleInviteButton = renderWorkspacesPreambleInviteButton;

    this.prototype.unmountWorkspacesPreambleInviteButton = unmountWorkspacesPreambleInviteButton;

    this.prototype.renderWorkspacesAutoNameAlert = renderWorkspacesAutoNameAlert;

    this.prototype.unmountWorkspacesAutoNameAlert = unmountWorkspacesAutoNameAlert;

    this.prototype.renderButlerBoardButtons = renderButlerBoardButtons;

    this.prototype.navigateToAutomaticReports = navigateToAutomaticReports;

    this.prototype.showAutomaticReports = showAutomaticReports;

    this.prototype.closeAutomaticReports = closeAutomaticReports;
  }

  constructor({ headerBranding }) {
    super(...arguments);
    this.headerBranding = headerBranding;
    this.onShortcut = this.onShortcut.bind(this);
    this.renderTemplateTips = this.renderTemplateTips.bind(this);
    this.isLoadingPowerUpViews = true;
    this.powerUpViews = [];
    registerShortcutHandler(this.onShortcut, { scope: Scope.Board });
  }

  initialize() {
    super.initialize(...arguments);

    const assignSubview = (BoardSidebarView) => {
      return (this.sidebarView = this.subview(
        BoardSidebarView.default,
        this.model,
        { boardView: this },
      ));
    };
    this.sidebarViewPromise = importWithRetry(() =>
      import(
        /* webpackChunkName: "board-sidebar-view" */ 'app/scripts/views/board-menu/board-sidebar-view'
      ),
    )
      .then(assignSubview.bind(this))
      .catch(function (error) {
        if (error.name === 'ChunkLoadError') {
          sendChunkLoadErrorEvent(error);
          const container = $('.board-menu')[0];
          if (container) {
            return renderComponent(<BoardSidebarLoadingError />, container);
          }
        } else {
          throw error;
        }
      });

    // setting this property is needed because board-view-sidebar reads from this
    this.workspaceNavState = workspaceNavigationState.value;
    const toggleCollapsedClass = () => {
      this.workspaceNavState = workspaceNavigationState.value;
      if (
        workspaceNavigationState.value.enabled &&
        !workspaceNavigationHiddenState.value.hidden &&
        !workspaceNavigationState.value.expanded
      ) {
        $('#board').addClass('collapsed-workspace-nav');
        $('.js-board-header').addClass('collapsed-workspace-nav');
      } else {
        $('#board').removeClass('collapsed-workspace-nav');
        $('.js-board-header').removeClass('collapsed-workspace-nav');
      }
    };
    this.unsubscribeWorkspaceNavState = workspaceNavigationState.subscribe(
      toggleCollapsedClass,
    );
    this.unsubscribeWorkspaceNavHiddenState = workspaceNavigationHiddenState.subscribe(
      toggleCollapsedClass,
    );

    this.inviteAcceptanceNotificationDiv = null;
    this.inviteAcceptanceNotificationComponent = null;
    this.hasSeenInviteAcceptanceNotification = false;
    this.workspacesPreambleBoardHeaderButtonTarget = null;
    this.workspacesPreamblePromptHasBeenSeen = false;
    this.workspacesPreambleInviteButtonTarget = null;
    this.teamOnboardingPupPopoverDiv = null;
    this.teamOnboardingPupTooltipDiv = null;
    this.workspacesAutoNameAlertTarget = null;

    this.makeDebouncedMethods(
      'refreshOrganization',
      'reloadCustomFields',
      'render',
      'renderBoardBackground',
      'renderBoardHeader',
      'renderBoardHeaderCalendar',
      'renderPluginDropdownList',
      'renderBoardHeaderSubscribed',
      'renderBoardHeaderMap',
      'renderBoardWarnings',
      'renderLists',
      'renderPermissionLevel',
      'updateControllerTitle',
      'renderBoardHeaderFacepile',
      'renderPluginButtons',
      'renderBoardViewsButton',
    );
    const isPluginCleanupEnabled = featureFlagClient.get(
      'ecosystem.pup-header-cleanup',
      false,
    );

    this.listenTo(this.model, {
      'change:closed deleting': this.renderDebounced,
      'change:idOrganization': () => {
        this.reloadDirectoryPlugins = true;
        this.refreshOrganizationDebounced();
        return this.headerBranding();
      },
      'change:memberships': this.renderPermissionLevelDebounced,
      'change:limits': this.renderBoardWarningsDebounced,
      'change:name': () => {
        this.renderBoardHeaderDebounced();
        return this.updateControllerTitleDebounced();
      },
      'change:powerUps'() {
        this.renderBoardHeaderMapDebounced();
        if (!this.model.isMapPowerUpEnabled()) {
          this.closeMap();
        }
        this.renderBoardHeaderCalendarDebounced();
        if (isPluginCleanupEnabled) {
          this.renderPluginDropdownList();
        }
        if (!this.model.isPowerUpEnabled('calendar')) {
          return this.closeCalendar();
        }
      },
      'change:prefs.cardCovers': this.renderListsDebounced,
      'change:prefs.permissionLevel': () => {
        this.renderListsDebounced();
        this.renderPermissionLevelDebounced();
        return this.renderBoardHeaderDebounced();
      },
      'change:prefs.background change:prefs.backgroundTile change:prefs.backgroundBrightness': () => {
        this.renderBoardHeaderCalendarDebounced();
        this.renderBoardBackgroundDebounced(true);
        this.renderBoardHeaderDebounced();
        if (isPluginCleanupEnabled) {
          this.renderPluginDropdownList();
        }
        return this.renderPluginButtonsDebounced();
      },
      'change:prefs.isTemplate': this.renderBoardHeaderDebounced,
      'change:prefs.selfJoin': this.renderBoardHeaderDebounced,
      'change:subscribed': this.renderBoardHeaderSubscribedDebounced,
      permChange: this.permChange,
      ownedChange: this.renderBoardHeaderDebounced,
      destroy: () => {
        return Controller.displayErrorPage({
          errorType: 'boardNotFound',
        });
      },
    });

    this.listenTo(this.model.memberList, {
      'change:status': this.renderBoardHeaderDebounced,
      add: this.onMemberAdd,
      'remove reset': this.renderBoardHeaderFacepileDebounced,
    });

    this.listenTo(this.model.boardPluginList, 'add reset', () => {
      if (isPluginCleanupEnabled) {
        this.renderPluginDropdownListDebounced();
      }
      this.reloadCustomFieldsDebounced();
      this.loadPowerUpViewsButtonOptions();
      return this.renderBoardViewsButtonDebounced();
    });

    this.subscribe(pluginsChangedSignal(this.model), () => {
      if (isPluginCleanupEnabled) {
        this.renderPluginDropdownListDebounced();
      }
      this.renderBoardHeaderMapDebounced();
      if (!this.model.isMapPowerUpEnabled()) {
        this.closeMap();
      }
      this.renderBoardHeaderCalendarDebounced();
      if (!this.model.isPowerUpEnabled('calendar')) {
        this.closeCalendar();
      }

      this.loadPowerUpViewsButtonOptions();
      return this.renderBoardViewsButtonDebounced();
    });

    this.listenTo(this.model.viewState, {
      'change:showSidebar': this.renderSidebarState,
      'change:sidebarDisplayType': this.renderSidebarDisplayType,
    });

    this.listenTo(Auth.me().boardStarList, 'add remove reset', () => {
      return this.renderBoardHeaderStarred();
    });

    this.memberTypeMe = this.model.getMemberType(Auth.me());

    this.refreshOrganization();

    this.listScrollLeft = null;
    this.savingScroll = false;
    this.calcState = {};

    this.listenTo(this.model.filter, 'change', () => {
      this.renderFilteringStatus();
      return this.renderBoardHeader();
    });

    this.listListView = this.collectionSubview(
      ListListView,
      this.model.listList,
      {
        id: 'board',
        model: this.model,
        className: `u-fancy-scrollbar js-no-higher-edits ${
          workspaceNavigationState.value.enabled &&
          !workspaceNavigationHiddenState.value.hidden &&
          !workspaceNavigationState.value.expanded
            ? 'collapsed-workspace-nav'
            : ''
        }`,
        resetCallback: () => this.postListListRender(),
      },
    );

    // Why are we listening to mousemove? Isn't mouseenter sufficient?
    //
    // 1. Hover your mouse over a card
    // 2. Hit an arrow key, moving the selected card, but not in a way that
    //    scrolls the page -- so the mouse is still hovering over the original
    //    card view.
    // 3. Move your mouse.
    //
    // If we were only listening to mouseenter, we'd never select the card,
    // because the mouse didn't re-enter it.
    this.listenTo(this.listListView, {
      mouseMoveListView(listView) {
        return this.model.viewState.selectList(listView.model);
      },
      mouseLeaveListView(listView) {
        return this.model.viewState.selectList(null);
      },
      mouseMoveCardView(listView, cardView) {
        if (
          this.ignoreMouseCardSelects ||
          PopOver.isVisible ||
          DragSort.sorting
        ) {
          return;
        }
        return this.model.viewState.selectCard(cardView.model);
      },
      mouseLeaveCardView(listView, cardView) {
        if (
          this.ignoreMouseCardSelects ||
          PopOver.isVisible ||
          DragSort.sorting
        ) {
          return;
        }
        return this.model.viewState.selectCard(null);
      },
      moveCard: this.moveCardRequested,
      copyCard: this.copyCardRequested,
    });

    this._applySettings();
    this.markRelatedNotificationsRead();

    this.reloadDirectoryPlugins = false;

    // Analytics migration -- move this to controller to capture all URL changes
    Analytics.sendScreenEvent({
      name: 'boardScreen',
      attributes: {
        isTemplate: this.model.isTemplate(),
        visibility: this.model.getPermLevel(),
      },
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id) || '',
        },
      },
    });
  }

  renderTemplateTips() {
    return this.sidebarViewPromise.then(() =>
      this.sidebarView.renderTemplateTips(),
    );
  }

  onShortcut = (event) => {
    const allowedViewsShortcuts = [Key.f, Key.q, Key.x];
    const key = getKey(event);

    if (Controller.showingBoardView() && !allowedViewsShortcuts.includes(key)) {
      return;
    }

    const editable = this.model.editable();
    const isLoggedIn = Auth.isLoggedIn();

    const sendShortcutEvent = (
      shortcutName,
      { shortcutKey = key, toggleValue } = {},
    ) => {
      let source = 'boardScreen';

      if (Controller.showingTimeline()) {
        source = 'timelineViewScreen';
      }

      if (Controller.showingCalendarView()) {
        source = 'calendarViewScreen';
      }

      Analytics.sendPressedShortcutEvent({
        shortcutName,
        source: source,
        keyValue: shortcutKey,
        containers: {
          board: { id: this.model.id },
          organization: { id: this.model.get('idOrganization') },
          enterprise: { id: this.model.get('idEnterprise') },
        },
        attributes: {
          toggleValue:
            toggleValue !== undefined ? toggleValue.toLowerCase() : undefined,
        },
      });
    };

    switch (key) {
      case Key.f:
        if (!isBoardHeaderFilterEnabled) {
          this.toggleFilter();
        }
        return;
      case Key.q:
        if (isLoggedIn) {
          this.model.filter.toggleQuietMode();
          event.preventDefault();
          sendShortcutEvent('myCardsShortcut');
        }
        return;

      case Key.x:
        this.model.filter.clear();
        event.preventDefault();
        sendShortcutEvent('clearAllFiltersShortcut');
        return;

      case Key.ClosedBracket:
      case Key.w:
        this.toggleSidebar();
        event.preventDefault();
        sendShortcutEvent('toggleBoardMenuDrawerShortcut', {
          toggleValue: this.model.viewState.get('showSidebar')
            ? 'show'
            : 'hide',
        });
        return;

      case Key.SemiColon: {
        const wasShowingLabelText = LabelState.getShowText();
        LabelState.toggleText();
        event.preventDefault();
        const toggleValue = wasShowingLabelText ? 'hide' : 'show';
        sendShortcutEvent('toggleLabelTextShortcut', { toggleValue });
        return;
      }

      case Key.ArrowDown:
      case Key.j:
        this.moveCard('down');
        event.preventDefault();
        sendShortcutEvent('moveDownShortcut');
        return;

      case Key.ArrowUp:
      case Key.k:
        this.moveCard('up');
        event.preventDefault();
        sendShortcutEvent('moveUpShortcut');
        return;

      case Key.ArrowRight:
        this.moveCard('right');
        event.preventDefault();
        sendShortcutEvent('moveRightShortcut');
        return;

      case Key.ArrowLeft:
        this.moveCard('left');
        event.preventDefault();
        sendShortcutEvent('moveLeftShortcut');
        return;

      case Key.n:
        if (editable) {
          const list = this.model.viewState.getList();
          const card = this.model.viewState.getCard();

          if (list != null) {
            const index =
              card != null
                ? list.openCards().indexOf(card) + 1
                : list.openCards().length;

            this.model.composer.save({
              list,
              index,
              vis: true,
            });

            event.preventDefault();
            sendShortcutEvent('insertCardShortcut');
          }
        }
        return;

      case Key.z:
      case Key.Z:
        if (editable) {
          event.preventDefault();
          // Check shiftKey > Key.Z for consistency in case of caps lock.
          if (event.shiftKey) {
            redoAction({ source: 'boardScreen', idBoard: this.model.id });
            sendShortcutEvent('redoActionShortcut', {
              shortcutKey: 'Shift+Z',
            });
          } else {
            undoAction({ source: 'boardScreen', idBoard: this.model.id });
            sendShortcutEvent('undoActionShortcut');
          }
        }
        return;

      case Key.Escape:
        if (editable) {
          if (DragSort.sorting) {
            DragSort.abort();
          } else if (
            !(Layout.isEditing() || PopOver.isVisible || Dialog.isVisible)
          ) {
            if (this.model.composer.get('vis')) {
              this.model.composer.save('vis', false);
            } else if (this.model.viewState.get('listComposerOpen')) {
              this.model.viewState.set('listComposerOpen', false);
            } else {
              this.sidebarViewPromise.then(() => this.sidebarView.popView());
            }
          }

          if (Controller.showingCalendar(this)) {
            $('.calendar-day.active').removeClass('active');
          }

          event.preventDefault();
        }
        return;

      default:
        return;
    }
  };

  renderClosed() {
    const org = this.model.getOrganization();
    const isAtOrOverLimit =
      org != null ? org.isAtOrOverFreeBoardLimit() : undefined;

    const props = {
      name: this.model.get('name'),
      canReopen: this.model.owned(),
      canDelete: this.model.canDelete(),
      deleting: this.model.isDeleting(),
      isAtOrOverLimit,
      isDesktop,
      orgId: org && org.get('id'),
      orgName: org && org.get('displayName'),
      billingUrl: org && org.getBillingUrl(),
    };

    this.unmountBoardClosed = renderComponent(
      <BoardClosed {...props} />,
      this.$el[0],
    );
    this.defaultBoardBackground();
  }

  render() {
    if (this.model.get('closed')) {
      this.renderClosed();
    } else {
      this.unmountBoardClosed && this.unmountBoardClosed();
      this.renderOpen();
    }

    return this;
  }

  renderFilteringStatus() {
    const isFiltering = this.model.filter.isFiltering();
    this.$('.js-filter-cards-indicator').toggleClass('hide', !isFiltering);
    if (isInFilteringExperiment || isBoardHeaderFilterEnabled) {
      this.$('.js-filter-cards-count').toggleClass('hide', !isFiltering);
      this.$('.js-header-filter-btn').toggleClass(
        'board-header-filter-btn-active',
        isFiltering,
      );
    }
    this.$('.js-num-cards').toggleClass('hide', !isFiltering);
    this.$('#board').toggleClass('filtering', isFiltering);

    // Don't pull in Board Filters and overwrite Query Params if on a Board View
    if (Controller.showingBoardView()) {
      return;
    }

    const queryString = this.model.filter.toQueryString();
    const currentQueryString = new URLSearchParams(location.search).toString();
    const nextQueryString = new URLSearchParams(queryString).toString();
    // Calling replaceState too many times on a large board render will break
    // the progressive rendering of lists on a board
    if (currentQueryString !== nextQueryString) {
      return history.replaceState(null, null, location.pathname + queryString);
    }
  }

  remove() {
    if (this.calendarView != null) {
      this.calendarView.remove();
    }
    unregisterShortcutHandler(this.onShortcut);
    this.unmountWorkspacesPreambleBoardHeaderButton();
    this.unmountWorkspacesPreambleInviteButton();
    this.unmountTeamOnboardingPupPopover();
    this.unmountTeamOnboardingPupTooltip();
    this.unmountBoardClosed && this.unmountBoardClosed();
    this.removeBoardViewsButton();
    this.unmountWorkspacesAutoNameAlert();
    this.unsubscribeWorkspaceNavState();
    this.unsubscribeWorkspaceNavHiddenState();
    return super.remove(...arguments);
  }

  // Because we are using jquery plugins that stop propagation on mousedown events
  // (jquery.dragscrollable and jquery.sortable), we need to handle blurring of inputs
  // and textareas ourselves.
  blurInputsOnBoardClick(e) {
    const $target = $(e.target);

    // Ignore clicks on inputs and textareas. Note that inputs here can also be submit buttons
    // that are 'programatically' clicked by the DOM upon form submission (on enter keypress)
    const clickedInput = $target.is('input') || $target.is('textarea');
    if (clickedInput) {
      return Util.stopPropagation(e);
    } else {
      return $('input, textarea').blur();
    }
  }
}

BoardView.initClass();
module.exports = BoardView;
