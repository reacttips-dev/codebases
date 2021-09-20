const { QuickLoad } = require('app/scripts/network/quickload');
const {
  getHomeLastTabStorageKey,
} = require('app/scripts/controller/memberPageHelpers');
const $ = require('jquery');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Auth } = require('app/scripts/db/auth');
const Backbone = require('@trello/backbone');
const { currentModelManager } = require('./currentModelManager');
const BluebirdPromise = require('bluebird');
const { TrelloStorage } = require('@trello/storage');
const _ = require('underscore');
const {
  featureFlagClient,
  seesVersionedVariation,
} = require('@trello/feature-flag-client');
const f = require('effing');
const { ApiError } = require('app/scripts/network/api-error');
const {
  getQueryParamByKey,
} = require('app/scripts/lib/util/url/get-query-param-by-key');
const { navigate } = require('app/scripts/controller/navigate');
const { renderPage } = require('./renderPage');
const {
  routes,
  getRouteIdFromPathname,
  isBoardRoute,
} = require('@trello/routes');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { defaultRouter } = require('app/src/router');
const { ProductFeatures } = require('@trello/product-features');

const { client, clientVersion } = require('@trello/config');
const memberIdStorageKey = 'idMe';
const { defaultStore } = require('app/gamma/src/defaultStore');
const {
  addBoardToRecent,
} = require('app/gamma/src/modules/state/ui/boards-menu');
const { removeOverlay } = require('app/gamma/src/modules/state/ui/overlay');
const {
  clearSearchQuery,
} = require('app/gamma/src/modules/state/models/search');
const { importWithRetry } = require('@trello/use-lazy-component');
const { Analytics } = require('@trello/atlassian-analytics');
const { getLocation } = require('@trello/router');
const {
  featureFlagUserDataRefinedState,
} = require('./featureFlagUserDataRefinedState');
const { setDocumentTitle } = require('app/src/components/DocumentTitle');

const headerLoad = function (methodName, eventName) {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelLoader } = require('app/scripts/db/model-loader');
  const actualLoad = Auth.isLoggedIn()
    ? ModelLoader.for('header', methodName)
    : BluebirdPromise.resolve(null);
  return actualLoad
    .then(function () {
      return ModelLoader.triggerWaits(eventName);
    })
    .catch(ApiError, function () {
      // We've previously tried logging people out when they get an unauthorized error,
      // while loading the header, under the assumption that they've somehow got a bad cookie.
      // Unfortunately we've had some firefox users reporting that this is logging them out
      // when it shouldn't be
      return console.error('Error trying to load header');
    })
    .done();
};

class Controller extends Backbone.Router {
  initialize() {
    this.currentModel = currentModelManager.currentModel;

    return this.currentModel;
  }

  get routes() {
    return {
      /**
       * Routes here are evaluated top to bottom.
       * If you add a route and the client is not rendering the right page,
       * your URL might be getting caught by another route pattern.
       *
       * e.g. the /my-new-route handler needs to be inserted before
       * routes.userOrOrg.pattern otherwise it will be caught there
       */

      [routes.go.pattern]: 'quickBoard',
      [routes.to.pattern]: 'quickBoard',
      [routes.doubleSlash.pattern]: 'quickBoard',
      [routes.powerUpAdmin.pattern]: 'powerUpAdmin',
      [routes.powerUpEdit.pattern]: 'editPowerUpPage',
      [routes.powerUpPublicDirectory.pattern]: 'publicDirectory',
      [routes.createFirstTeam.pattern]: 'createFirstTeamPage',
      [routes.shortcuts.pattern]: 'shortcutsPage',
      [routes.shortcutsOverlay.pattern]: 'shortcutsOverlayPage',
      [routes.blank.pattern]: 'blankPage',
      [routes.selectOrgToUpgrade.pattern]: 'selectOrgToUpgradePage',
      [routes.selectTeamToUpgrade.pattern]: 'selectTeamToUpgradePage',
      [routes.search.pattern]: 'searchPage',
      [routes.templatesSubmit.pattern]: 'templatesGallerySubmitPage',
      [routes.templates.pattern]: 'templatesGalleryPublicPage',
      [routes.templatesRecommend.pattern]: 'templatesGalleryPublicPage',
      [routes.inviteAcceptBoard.pattern]: 'inviteAcceptBoardPage',
      [routes.inviteAcceptTeam.pattern]: 'inviteAcceptTeamPage',
      // Old style URL
      [routes.boardOld.pattern]: 'oldBoardPage',
      // New style URL
      [routes.boardReferral.pattern]: 'boardReferralPage',
      [routes.board.pattern]: 'boardPage',
      // Old style URLs
      [routes.cardAndBoardOld.pattern]: 'oldCardPage',
      [routes.cardOld.pattern]: 'oldCardPage',
      // New style URL
      [routes.card.pattern]: 'cardPage',
      [routes.createFirstBoard.pattern]: 'createFirstBoardPage',

      // Gold sunset
      [routes.goldPromoFreeTrial.pattern]: 'goldPromoFreeTrialPage',

      // User or Org routes
      [routes.account.pattern]: 'userOrOrgAccountPage',
      [routes.profile.pattern]: 'userOrOrgProfilePage',
      [routes.billing.pattern]: 'userOrOrgBillingPage',
      [routes.billingCard.pattern]: 'userOrOrgBillingCardPage',
      [routes.billingCardProduct.pattern]: 'userOrOrgBillingCardPage',
      // If in doubt, place your new route before routes.userOrOrg.pattern
      [routes.userOrOrg.pattern]: 'userOrOrgProfilePage',
      [routes.enterpriseAdmin.pattern]: 'enterpriseAdminDashboardView',
      [routes.enterpriseAdminTab.pattern]: 'enterpriseDashTab',
      [routes.memberHome.pattern]: 'memberHomePage',
      [routes.memberHomeBoards.pattern]: 'memberHomeBoardsPage',
      [routes.teamHighlights.pattern]: 'memberTeamHighlightsPage',
      [routes.teamGettingStarted.pattern]: 'memberTeamGettingStartedPage',
      [routes.teamReports.pattern]: 'teamReportsPage',
      [routes.memberAllBoards.pattern]: 'memberAllBoardsPage',
      [routes.memberCards.pattern]: 'memberCardsPage',
      [routes.memberCardsForOrg.pattern]: 'memberCardsPage',
      [routes.memberActivity.pattern]: 'memberActivityPage',
      [routes.memberTasks.pattern]: 'memberTasksPage',
      [routes.organizationById.pattern]: 'organizationById',
      [routes.organizationGuests.pattern]: 'organizationGuestsView',
      [routes.organizationMembers.pattern]: 'organizationMembersView',
      [routes.organizationMemberCards.pattern]: 'organizationMemberCardsView',
      [routes.organizationExport.pattern]: 'organizationExportView',
      [routes.organizationPowerUps.pattern]: 'organizationPowerUpsView',
      [routes.organizationTables.pattern]: 'organizationTableView',
      [routes.organizationFreeTrial.pattern]: 'freeTrialView',
      [routes.workspaceDefaultMyWorkView.pattern]:
        'workspaceDefaultMyWorkViewPage',
      [routes.workspaceView.pattern]: 'workspaceViewPage',
      [routes.workspaceDefaultCustomTableView.pattern]:
        'workspaceDefaultCustomTableViewPage',
      [routes.workspaceDefaultCustomCalendarView.pattern]:
        'workspaceDefaultCustomCalendarViewPage',
      [routes.errorPage.pattern]: 'displayErrorPage',
    };
  }

  getQueryParamByKey = getQueryParamByKey;

  stop() {
    const { rpc } = require('app/scripts/network/rpc');
    rpc.stop();
  }

  start() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { JoinOnConfirm } = require('app/scripts/lib/join-on-confirm');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { rpc } = require('app/scripts/network/rpc');
    rpc.on(
      'subscription_invalid',
      (function (_this) {
        return function (modelType, idModel) {
          const shouldDisplayError = function () {
            switch (modelType) {
              case 'Board':
                return currentModelManager.onBoardView(idModel);
              case 'Organization':
                return currentModelManager.onOrganizationView(idModel);
              default:
                return false;
            }
          }.call(_this);
          if (shouldDisplayError) {
            const errorType =
              modelType === 'Board' ? 'boardNotFound' : 'notFound';
            return _this.displayErrorPage({
              errorType: errorType,
            });
          }
        };
      })(this),
    );
    headerLoad('loadHeaderData', 'headerData');
    setTimeout(f(headerLoad, 'loadBoardsMenuData', 'boardsData'), 500);
    if (Auth.isLoggedIn()) {
      ModelLoader.await('headerData')
        .then(function () {
          const me = Auth.me();

          // set idMe in localStorage
          TrelloStorage.set(memberIdStorageKey, Auth.myId());

          const premiumFeaturesSet = new Set();
          const productSet = new Set();

          me.organizationList.forEach((org) => {
            const product = org.getProduct();
            if (product) {
              productSet.add(product);
              // NOTE: It'd be better to use org.get('premiumFeatures'), but
              // loading premiumFeatures as part of the header disables fast
              // loading
              ProductFeatures.getProductFeatures(product).forEach((feature) =>
                premiumFeaturesSet.add(feature),
              );
            }
          });

          // LaunchDarkly - Once we have the header data
          // we can send a more informative user object to LD
          return featureFlagClient.refineUserData({
            channel: me.get('channels')?.active,
            clientVersion: clientVersion,
            emailDomain: me.get('email')?.split('@')[1] ?? '',
            hasBC: me.organizationList.some((org) => org.isPremium()),
            hasMultipleEmails: (me.get('logins') ?? []).length > 1,
            head: client.head,
            idEnterprises:
              me.get('enterprises')?.map((enterprise) => enterprise.id) ?? [],
            idOrgs: me.get('idOrganizations') ?? [],
            isClaimable: me.get('logins')?.some((login) => login.claimable),
            inEnterprise: (me.get('enterprises') || []).length > 0,
            orgs: ['[Redacted]'],
            // LD dates must be formatted as UNIX milliseconds
            // https://docs.launchdarkly.com/home/managing-flags/targeting-users#date-comparisons
            signupDate: Util.idToDate(me.id).getTime(),
            premiumFeatures: Array.from(premiumFeaturesSet),
            products: Array.from(productSet),
            version: client.version,
          });
        })
        .then(() => featureFlagUserDataRefinedState.setValue(true))
        .done();
    } else {
      // Have the user object reflect a user that isn't logged in
      featureFlagClient
        .refineUserData({
          clientVersion: clientVersion,
          channel: void 0,
          emailDomain: '',
          hasBC: false,
          hasMultipleEmails: false,
          head: client.head,
          idEnterprises: [],
          idOrgs: [],
          inEnterprise: false,
          isClaimable: false,
          orgs: [],
          premiumFeatures: [],
          products: [],
          signupDate: undefined,
          version: client.version,
        })
        .then(() => featureFlagUserDataRefinedState.setValue(true));
    }

    return JoinOnConfirm.autoJoin()
      .then(function (didJoin) {
        if (didJoin) {
          // We can't trust that the stuff that we quickloaded is
          // going to be accurate, or that we'll catch the updates
          // when we subscribe, so just dump it to be safe
          return QuickLoad.clear();
        }
      })
      .return();
  }

  viewType = 'none';

  topLevelView(viewType, model, options) {
    // eslint-disable-next-line eqeqeq
    if (this.applicationView == null) {
      this.applicationView = new View();
    }
    // eslint-disable-next-line eqeqeq
    if (options == null) {
      options = {};
    }
    // eslint-disable-next-line eqeqeq
    if (options.modelCache == null) {
      options.modelCache = this.getCurrentModelCache();
    }
    return this.applicationView.subview(viewType, model, options);
  }

  existingTopLevelView(viewType, model) {
    return this.applicationView.existingSubview(viewType, model);
  }

  existingTopLevelViewOrUndefined(viewType, model) {
    return this.applicationView?.existingSubviewOrUndefined(viewType, model);
  }

  title(title) {
    setDocumentTitle(title);
  }

  setLocation({ location, options, title }) {
    // eslint-disable-next-line eqeqeq
    if (title != null) {
      this.title(title);
    }
    if (location) {
      if (/^#/.test(location)) {
        location = location.substr(1);
      }
      navigate(location, options);
      this.location = location;
    }
  }

  showingCalendar(boardView) {
    return (
      // eslint-disable-next-line eqeqeq
      (boardView != null ? boardView.$('.calendar-wrapper').length : void 0) > 0
    );
  }

  showingMap(boardView) {
    return (
      // eslint-disable-next-line eqeqeq
      (boardView != null ? boardView.$('.map-wrapper').length : void 0) > 0
    );
  }

  showingTimeline() {
    const path = defaultRouter.getRoute().routePath;
    const currentView = path.split('/')[4] || 'board';
    const queryParamParsedView = currentView.split('?')[0];

    return queryParamParsedView === 'timeline';
  }

  showingCalendarView() {
    const path = defaultRouter.getRoute().routePath;
    const currentView = path.split('/')[4] || 'board';

    const queryParamParsedView = currentView.split('?')[0];

    return queryParamParsedView === 'calendar-view';
  }

  showingTable() {
    const path = defaultRouter.getRoute().routePath;
    const currentView = path.split('/')[4] || 'board';
    const queryParamParsedView = currentView.split('?')[0];

    return queryParamParsedView === 'table';
  }

  showingAutomaticReports() {
    const path = defaultRouter.getRoute().routePath;
    const subsections = path.split('/');
    return subsections[4] === 'butler' && subsections[5] === 'reports';
  }

  showingDashboard() {
    const path = defaultRouter.getRoute().routePath;
    const currentView = path.split('/')[4] || 'board';
    return currentView === 'dashboard';
  }

  showingPupDirectory(boardView) {
    return !!boardView.directoryView;
  }

  showingBoardOverlay() {
    const boardView = this.getCurrentBoardView();
    return (
      this.showingPupDirectory(boardView) ||
      this.showingCalendar(boardView) ||
      this.showingMap(boardView) ||
      this.showingTimeline() ||
      this.showingCalendarView() ||
      this.showingAutomaticReports()
    );
  }

  showingBoardView() {
    return (
      this.showingTimeline() ||
      this.showingCalendarView() ||
      this.showingAutomaticReports() ||
      this.showingTable()
    );
  }

  setBoardLocation(idBoard, section, extra, options) {
    // eslint-disable-next-line eqeqeq
    if (section == null) {
      section = '';
    }
    // eslint-disable-next-line eqeqeq
    if (extra == null) {
      extra = [];
    }
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelCache } = require('app/scripts/db/model-cache');
    const name = ModelCache.get('Board', idBoard).get('name');
    const boardUrl = this.getBoardUrl(idBoard, section, extra);
    const { pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    const isBoard = isBoardRoute(routeId);
    const isCanonicalUrl = pathname === boardUrl;

    this.setLocation({
      title: name,
      location: boardUrl,
      options: {
        ...(isBoard ? { replace: !isCanonicalUrl } : {}),
        ...options,
      },
    });
  }

  saveMemberBoardProfileLocation(member, idBoard) {
    return this.setLocation({
      title: member.get('fullName'),
      location: this.getMemberBoardProfileUrl(member.get('username'), idBoard),
    });
  }

  isOnSearchPage() {
    return this.currentPage === 'search';
  }

  // This is gross, but slightly better than having a global 'boardView' variable
  getCurrentBoardView() {
    // Paranoid check that we have a root view to work with
    if (!this.applicationView || !this.applicationView._subviews) {
      return;
    }

    const boardViews = Object.values(this.applicationView._subviews).filter(
      (view) => view.displayName === 'BoardView',
    );

    return boardViews[0];
  }

  getCurrentModelCache() {
    return this.currentModelCache;
  }

  saveBoardsView() {
    if (
      // eslint-disable-next-line eqeqeq
      this.savedBoardViewInformation != null ||
      !currentModelManager.onAnyBoardView()
    ) {
      return;
    }
    this.savedBoardViewInformation = {
      idBoard: this.currentModel.get().id,
      path: /\/b\/[^/]*\/(.*)/.exec(this.location)[1],
    };
  }

  loadBoardsView() {
    if (!this.savedBoardViewInformation) {
      return;
    }

    const { idBoard, path } = this.savedBoardViewInformation;
    this.boardPage(idBoard, path);

    return delete this.savedBoardViewInformation;
  }

  clearPreviousView(options) {
    // eslint-disable-next-line eqeqeq
    if (options == null) {
      options = {};
    }
    // eslint-disable-next-line eqeqeq
    if (options.shallow == null) {
      options.shallow = false;
    }
    // eslint-disable-next-line eqeqeq
    if (options.isNextViewReact == null) {
      options.isNextViewReact = false;
    }
    const { shallow, isNextViewReact } = options;

    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const Dialog = require('app/scripts/views/lib/dialog');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const PluginModal = require('app/scripts/views/lib/plugin-modal');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { PopOver } = require('app/scripts/views/lib/pop-over');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { SearchState } = require('app/scripts/view-models/search-state');
    // Dependency required at call site to avoid import cycles, do not lift to top of module

    // shallow = true is for singlespa page transitions
    if (shallow) {
      SearchState.setQuery('');
      PopOver.hide();
      PluginModal.close();
      if (Dialog.isVisible) {
        Dialog.hide(true);
      }
      return;
    }
    defaultStore.dispatch(removeOverlay());
    defaultStore.dispatch(clearSearchQuery());
    ReactDOM.unmountComponentAtNode(document.getElementById('content'));
    SearchState.setQuery('');
    // eslint-disable-next-line eqeqeq
    if (this.applicationView != null) {
      this.applicationView.remove();
    }
    delete this.applicationView;
    PopOver.hide();
    PluginModal.close();
    if (Dialog.isVisible) {
      Dialog.hide(true);
    }
    if (!isNextViewReact) {
      ReactDOM.unmountComponentAtNode(document.getElementById('content'));
      $('#content').html('');
    }
    $('body').scrollTop('0');
    $('#trello-root')
      .removeClass(
        'body-single-column body-tabbed-page body-search-page body-board-view body-custom-board-background body-custom-board-background-tiled body-light-board-background body-dark-board-background body-ambiguous-board-background body-default-header',
      )
      .css(
        {
          'background-image': '',
          'background-color': '',
        },
        AttachmentViewer.clear(),
      );
  }

  // Call this *after* loading data, before displaying
  // (So the transition is instant)
  setViewType(modelOrString) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { FavIcon } = require('app/scripts/lib/favicon');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelCache } = require('app/scripts/db/model-cache');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { SidebarState } = require('app/scripts/view-models/sidebar-state');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { Board } = require('app/scripts/models/board');
    if (_.isString(modelOrString)) {
      this.currentModelCache = ModelCache;
      this.currentModel.set(null);
    } else {
      this.currentModelCache = modelOrString.modelCache;
      this.currentModel.set(modelOrString);
    }
    this.currentPage = modelOrString;
    if (this.currentModel.get() instanceof Board) {
      const board = this.currentModel.get();
      this.waitForId(board, function () {
        // The right thing to do would be to have all this accounting-for-
        // views code observe the current location of the Controller, instead
        // of having the Controller know about that much. A good project
        // for a future refactor.
        board.markAsViewed();
        SidebarState.pushBoard(board.id);
        return defaultStore.dispatch(
          addBoardToRecent({
            id: board.id,
          }),
        );
      });
    } else {
      FavIcon.setBackground({
        useDefault: true,
      });
    }
  }

  /**
   * Hey look! We're duplicating code. In actually the *third* place.
   * isWebClientPage has this check, it's defined in the route above,
   * and we have it here too.
   * Turns out Backbone's router gives you *no* inspection ability. It
   * doesn't return any routes that you create. The method that converts
   * routes into regular expressions is private. Even if you create a named
   * route, there's no way to retrive the Backbone route object for that.
   * So! When we stop using Backbone's router, make sure to come back and
   * fix this.
   */
  onCardView() {
    return /^\/c\/[a-zA-Z0-9]{8}(\/[^/]+)?/.test(window.location.pathname);
  }

  organizationById(idOrganization) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.for('top-level', 'loadOrgNameById', idOrganization)
      .then((name) => navigate(`/${name}`, { trigger: true, replace: true }))
      .catch(ApiError, () => this.displayErrorPage())
      .done();
  }

  /**
   * Focus the content, so it can immediately be scrolled
   * with the arrow keys.  The tabindex is necessary
   * to make the div focusable. This causes a style recalc/reflow
   * so deferring it via setTimeout
   */
  focusContent() {
    return _.defer(() => {
      $('#content').attr('tabindex', '-1').focus();
    });
  }

  quickBoard(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "quick-board" */
          './quickBoard'
        ),
      ).then(({ QuickBoard }) => QuickBoard.quickBoard.call(this, ...args)),
    );
  }
  powerUpAdmin(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "powerup-admin-page" */
          './powerupAdminPage'
        ),
      ).then(({ powerupAdminPage }) => powerupAdminPage(...args)),
    );
  }
  editPowerUpPage(...args) {
    renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "powerup-edit-powerup-page" */
          './powerupEditPowerUpPage'
        ),
      ).then(({ powerupEditPowerUpPage }) => powerupEditPowerUpPage(...args)),
    );
  }
  publicDirectory(...args) {
    renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "powerup-public-directory-page" */
          './powerupPublicDirectoryPage'
        ),
      ).then(({ powerupPublicDirectoryPage }) =>
        powerupPublicDirectoryPage(...args),
      ),
    );
  }
  createFirstTeamPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "create-first-team-page" */ './createFirstTeamPage'
        ),
      ).then(({ createFirstTeamPage }) => {
        return createFirstTeamPage(...args);
      }),
    );
  }
  shortcutsPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "shortcuts-page" */ './shortcutsPage'),
      ).then(({ shortcutsPage }) => {
        return shortcutsPage.call(this, ...args);
      }),
    );
  }
  shortcutsOverlayPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "shortcuts-overlay-page" */ './shortcutsOverlayPage'
        ),
      ).then(({ shortcutsOverlayPage }) => {
        return shortcutsOverlayPage.call(this, ...args);
      }),
    );
  }
  blankPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "blank-page" */ './blankPage'),
      ).then(({ blankPage }) => {
        return blankPage.call(this, ...args);
      }),
    );
  }
  selectOrgToUpgradePage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "select-org-to-upgrade-page" */ './selectOrgToUpgradePage'
        ),
      ).then(({ selectOrgToUpgradePage }) => {
        return selectOrgToUpgradePage.call(this, ...args);
      }),
    );
  }
  selectTeamToUpgradePage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "select-team-to-upgrade-page" */ './selectTeamToUpgradePage'
        ),
      ).then(({ selectTeamToUpgradePage }) => {
        return selectTeamToUpgradePage.call(this, ...args);
      }),
    );
  }
  searchPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "search-page" */ './searchPage'),
      ).then(({ searchPage }) => {
        return searchPage.call(this, ...args);
      }),
    );
  }
  templatesGallerySubmitPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "templates-gallery-public-page" */ './templatesGalleryPublicPage'
        ),
      ).then(({ templatesGalleryPublicPage }) => {
        return templatesGalleryPublicPage.call(this, null, null, null, true);
      }),
    );
  }
  templatesGalleryPublicPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "templates-gallery-public-page" */ './templatesGalleryPublicPage'
        ),
      ).then(({ templatesGalleryPublicPage }) => {
        return templatesGalleryPublicPage.call(this, ...args);
      }),
    );
  }
  inviteAcceptBoardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "invite-accept-page" */
          './inviteAcceptPage'
        ),
      ).then(({ InviteAcceptPage }) =>
        InviteAcceptPage.boardInvitationPage.call(this, ...args),
      ),
    );
  }
  inviteAcceptTeamPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "invite-accept-page" */
          './inviteAcceptPage'
        ),
      ).then(({ InviteAcceptPage }) =>
        InviteAcceptPage.teamInvitationPage.call(this, ...args),
      ),
    );
  }
  oldBoardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) => BoardPage.oldBoardPage.call(this, ...args)),
    );
  }
  boardReferralPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) =>
        BoardPage.boardReferralPage.call(this, ...args),
      ),
    );
  }
  boardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) => BoardPage.boardPage.call(this, ...args)),
    );
  }
  workspaceDefaultCustomTableViewPage(...args) {
    if (!seesVersionedVariation('remarkable.default-views', 'alpha')) {
      this.displayErrorPage();
      return;
    }

    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "workspace-view-page" */
          './workspaceViewPage'
        ),
      ).then(({ workspaceDefaultCustomTableViewPage }) =>
        workspaceDefaultCustomTableViewPage.call(this, ...args),
      ),
    );
  }
  workspaceDefaultCustomCalendarViewPage(...args) {
    if (!featureFlagClient.get('ecosystem.multi-board-calendar', false)) {
      this.displayErrorPage();
      return;
    }

    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "workspace-view-page" */
          './workspaceViewPage'
        ),
      ).then(({ workspaceDefaultCustomCalendarViewPage }) =>
        workspaceDefaultCustomCalendarViewPage.call(this, ...args),
      ),
    );
  }
  workspaceDefaultMyWorkViewPage(...args) {
    if (!seesVersionedVariation('remarkable.default-views', 'alpha')) {
      this.displayErrorPage();
      return;
    }

    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "workspace-view-page" */
          './workspaceViewPage'
        ),
      ).then(({ workspaceDefaultMyWorkViewPage }) =>
        workspaceDefaultMyWorkViewPage.call(this, ...args),
      ),
    );
  }
  workspaceViewPage(...args) {
    if (!seesVersionedVariation('remarkable.saved-workspace-views', 'alpha')) {
      this.displayErrorPage();
      return;
    }

    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "workspace-view-page" */
          './workspaceViewPage'
        ),
      ).then(({ workspaceViewPage }) => workspaceViewPage.call(this, ...args)),
    );
  }
  oldCardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) => BoardPage.oldCardPage.call(this, ...args)),
    );
  }
  cardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) => BoardPage.cardPage.call(this, ...args)),
    );
  }
  // This it not actually called as a route handler, but various other
  // Controller methods expect it to be statically defined.
  showCardDetail(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) => BoardPage.showCardDetail.call(this, ...args)),
    );
  }
  createFirstBoardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-page" */
          './boardPage'
        ),
      ).then(({ BoardPage }) =>
        BoardPage.createFirstBoardPage.call(this, ...args),
      ),
    );
  }
  userOrOrgAccountPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "user-or-org-account-page" */ './userOrOrgAccountPage'
        ),
      ).then(({ userOrOrgAccountPage }) => {
        return userOrOrgAccountPage.call(this, ...args);
      }),
    );
  }
  userOrOrgProfilePage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "user-or-org-profile-page" */ './userOrOrgProfilePage'
        ),
      ).then(({ userOrOrgProfilePage }) => {
        return userOrOrgProfilePage.call(this, ...args);
      }),
    );
  }
  userOrOrgBillingPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "user-or-org-billing-page" */ './userOrOrgBillingPage'
        ),
      ).then(({ userOrOrgBillingPage }) => {
        return userOrOrgBillingPage.call(this, ...args);
      }),
    );
  }
  userOrOrgBillingCardPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "user-or-org-billing-card-page" */ './userOrOrgBillingCardPage'
        ),
      ).then(({ userOrOrgBillingCardPage }) => {
        return userOrOrgBillingCardPage.call(this, ...args);
      }),
    );
  }
  enterpriseAdminDashboardView(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "enterprise-admin-dashboard-page" */ './enterpriseAdminDashboardPage'
        ),
      ).then(({ enterpriseAdminDashboardPage }) => {
        return enterpriseAdminDashboardPage.call(this, ...args);
      }),
    );
  }
  enterpriseDashTab(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "enterprise-admin-dashboard-page" */ './enterpriseAdminDashboardPage'
        ),
      ).then(({ enterpriseAdminDashboardPage }) => {
        return enterpriseAdminDashboardPage.call(this, ...args);
      }),
    );
  }
  memberHomePage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "member-home-page" */ './memberHomePage'),
      ).then(({ memberHomePage }) => {
        return memberHomePage.call(this, ...args);
      }),
    );
  }
  memberHomeBoardsPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "member-home-boards-page" */ './memberHomeBoardsPage'
        ),
      ).then(({ memberHomeBoardsPage }) => {
        return memberHomeBoardsPage.call(this, ...args);
      }),
    );
  }
  memberTeamGettingStartedPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "team-getting-started-page" */ './teamGettingStartedPage'
        ),
      ).then(({ teamGettingStartedPage }) => {
        return teamGettingStartedPage(args[0]);
      }),
    );
  }
  memberTeamHighlightsPage(orgname) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "member-home-page" */ './memberHomePage'),
      ).then(({ memberHomePage }) => {
        const opts = {
          orgname,
          showHomeBoardsTab: false,
          showGettingStarted: false,
        };
        return memberHomePage.call(this, opts);
      }),
    );
  }
  teamReportsPage(...args) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "team-reports-page" */ './teamReportsPage'),
      ).then(({ teamReportsPage }) => {
        return teamReportsPage.call(this, ...args);
      }),
    );
  }
  memberAllBoardsPage() {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "member-home-page" */ './memberHomePage'),
      ).then(({ memberHomePage }) => {
        // caught by ':username/boards' route
        // but we actually want to show the 'memberHomePage'
        // just without any organisation, to show the SH all boards tab
        const opts = {
          orgname: null,
          showHomeBoardsTab: true,
          showGettingStarted: false,
        };
        return memberHomePage.call(this, opts);
      }),
    );
  }
  memberCardsPage(username = 'me', orgname) {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "member-page" */ './memberPage'),
      ).then(({ memberPage }) => {
        return memberPage.call(this, {
          username,
          loadFn: 'loadMemberCardsData',
          viewClassName: 'MemberCardsView',
          getLocation: (_username) => {
            return this.getMemberCardsUrl(_username, orgname);
          },
          titleKey: 'cards',
          orgname,
        });
      }),
    );
  }
  memberActivityPage(username = 'me') {
    return renderPage(
      importWithRetry(() =>
        import(/* webpackChunkName: "member-page" */ './memberPage'),
      ).then(({ memberPage }) => {
        return memberPage.call(this, {
          username,
          loadFn: 'loadMemberProfileData',
          preloadFn: 'loadMemberProfileMinimal',
          viewClassName: 'MemberActivityView',
          getLocation: this.getMemberActivityUrl,
          titleKey: 'activity',
        });
      }),
    );
  }
  memberTasksPage(...args) {
    TrelloStorage.set(getHomeLastTabStorageKey(), '/'); //#Trick Sticky Tabs into just redirecting us to Home
    return navigate('/', { replace: true, trigger: true });
  }
  organizationGuestsView(orgname) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage, getMemberPageViewOptions }) => {
        return organizationPage
          .call(this, {
            orgname,
            loadFn: 'loadOrganizationMembersData',
            viewClassName: 'OrganizationMembersView',
            getLocation: this.getOrganizationGuestUrl,
            viewOptions: getMemberPageViewOptions.call(this, orgname, 'guest'),
          })
          .done();
      }),
    );
  }
  organizationMembersView(...args) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-members-page" */ './organizationMembersPage'
        ),
      ).then(({ organizationMembersPage }) => {
        return organizationMembersPage.call(this, ...args);
      }),
    );
  }
  organizationMemberCardsView(...args) {
    // This now lives on the member cards page
    return navigate(this.getOrganizationMemberCardsUrl(...args), {
      trigger: true,
    });
  }
  organizationExportView(orgname) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) => {
        return organizationPage
          .call(this, {
            orgname,
            loadFn: 'loadOrganizationExportData',
            viewClassName: 'OrganizationExportView',
            getLocation: this.getOrganizationExportUrl,
            adminOnly: true,
            isPremium: true,
          })
          .done();
      }),
    );
  }
  organizationPowerUpsView(orgname) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) => {
        return organizationPage
          .call(this, {
            orgname,
            loadFn: 'loadOrganizationBoardsData',
            viewClassName: 'OrganizationPowerUpsView',
            getLocation: this.getOrganizationPowerUpsUrl,
            adminOnly: true,
            allowEnterpriseAdmin: true,
            isPremium: true,
          })
          .done();
      }),
    );
  }
  organizationTableView(...args) {
    const isOrganizationDefaultViewsEnabled = seesVersionedVariation(
      'remarkable.default-views',
      'alpha',
    );

    if (isOrganizationDefaultViewsEnabled) {
      // We've moved this from /:team/tables to /:team/views/table
      return navigate(
        this.getOrganizationTablesUrl(...args) + window.location.search,
        {
          trigger: true,
        },
      );
    }

    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-table-page" */ './organizationTablePage'
        ),
      ).then(({ organizationTablePage }) => {
        return organizationTablePage.call(this, ...args);
      }),
    );
  }
  freeTrialView(orgname, viewOptions = {}) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) =>
        organizationPage
          .call(this, {
            orgname,
            loadFn: 'loadOrganizationBoardsData',
            additionalFns: {
              members: 'loadOrganizationMemberGhost',
              credits: 'loadOrganizationCredits',
            },
            viewClassName: 'OrganizationBoardsView',
            getLocation: this.getOrganizationFreeTrialUrl,
            viewOptions: _.extend(viewOptions, {
              previewFreeTrial: true,
            }),
          })
          .done(),
      ),
    );
  }
  // methods from organization-routes
  organizationAccountView(orgname) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) => {
        return organizationPage.call(this, {
          orgname,
          loadFn: 'loadOrganizationData',
          viewClassName: 'OrganizationAccountView',
          getLocation: this.getOrganizationAccountUrl,
          membersOnly: true,
        });
      }),
    );
  }
  organizationBillingView(orgname, options = {}) {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) => {
        return organizationPage.call(this, {
          orgname,
          loadFn: 'loadOrganizationData',
          viewClassName: 'OrganizationBillingView',
          getLocation: this.getOrganizationBillingUrl,
          urlOptions: { returnUrl: options.returnUrl },
        });
      }),
    );
  }
  organizationBoardsView(orgname, viewOptions) {
    const traceId = Analytics.startTask({
      taskName: 'view-organization/boards',
      source: 'orgBoardsPage',
    });
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "organization-page" */ './organizationPage'
        ),
      ).then(({ organizationPage }) => {
        const isWorkspacePageRedesignEnabled = featureFlagClient.get(
          'teamplates.web.workspace-page-redesign',
          false,
        );

        const loadFn = isWorkspacePageRedesignEnabled
          ? 'loadWorkspaceBoardsDataMinimal'
          : 'loadOrganizationBoardsData';

        return organizationPage
          .call(this, {
            orgname,
            loadFn,
            additionalFns: {
              members: 'loadOrganizationMemberGhost',
            },
            viewClassName: 'OrganizationBoardsView',
            getLocation: this.getOrganizationUrl,
            viewOptions,
          })
          .then(() => {
            Analytics.taskSucceeded({
              taskName: 'view-organization/boards',
              source: 'orgBoardsPage',
              traceId,
            });
          })
          .catch((e) => {
            throw Analytics.taskFailed({
              taskName: 'view-organization/boards',
              source: 'orgBoardsPage',
              traceId,
              error: e,
            });
          });
      }),
    );
  }

  displayErrorPage({ errorType, reason } = {}) {
    const { errorPage } = require('./errorPage');
    renderPage(errorPage.call(this, { errorType, reason }));
  }

  goldPromoFreeTrialPage() {
    return renderPage(
      importWithRetry(() =>
        import(
          /* webpackChunkName: "gold-promo-free-trial-page" */ './goldPromoFreeTrialPage'
        ),
      ).then(({ goldPromoFreeTrialPage }) => {
        return goldPromoFreeTrialPage();
      }),
    );
  }
}

// Extend the Controller prototype with a bunch of random methods. The long-term
// vision is to get rid of these methods from the Controller.
const { DisplayBoard } = require('./display-board');
const { Header } = require('./header');
const { Urls } = require('./urls');
_.extend(Controller.prototype, DisplayBoard, Header, Urls);

module.exports.Controller = new Controller();
