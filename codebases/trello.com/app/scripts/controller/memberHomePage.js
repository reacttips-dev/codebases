function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const { l } = require('app/scripts/lib/localize');
const { TrelloStorage } = require('@trello/storage');
const {
  Apdex,
  Analytics,
  getScreenFromUrl,
} = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const { trackGTMEvent } = require('@trello/analytics');
const {
  isMemberOfOrg,
  getHomeLastTab,
  redirectHomeToDefaultTab,
  getHomeLastTabStorageKey,
} = require('./memberPageHelpers');
const { navigate } = require('app/scripts/controller/navigate');
const { importWithRetry } = require('@trello/use-lazy-component');

// keeps track of whether we redirected on initial page load
let isInitial = false;

// Variables used to determine if we should pretend the user is new, for testing
// purposes
let simulateNewUser = null;

// keeps track if the browser forward or back buttons are used
let browserNav = false;
$(window).on('popstate', () => (browserNav = true));

const trackMemberHomeView = function (
  orgname,
  showHomeBoardsTab,
  templatesData,
  showGettingStarted,
) {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelCache } = require('app/scripts/db/model-cache');

  let actionSubject = '';
  let context = {};

  if (orgname && showHomeBoardsTab && !templatesData) {
    actionSubject = 'workspaceBoardsHomeScreen';
    context = {
      teamId: __guard__(
        ModelCache.findOne('Organization', 'name', orgname),
        (x) => x.id,
      ),
    };
  } else if (
    !orgname &&
    showHomeBoardsTab &&
    !templatesData &&
    !showGettingStarted
  ) {
    actionSubject = 'memberBoardsHomeScreen';
  } else if (
    !orgname &&
    !showHomeBoardsTab &&
    templatesData &&
    !showGettingStarted
  ) {
    actionSubject = 'templateGalleryScreen';
  } else if (
    !orgname &&
    !showHomeBoardsTab &&
    !templatesData &&
    !showGettingStarted
  ) {
    actionSubject = 'memberHomeScreen';
  } else if (
    showGettingStarted &&
    !orgname &&
    !showHomeBoardsTab &&
    !templatesData
  ) {
    actionSubject = 'workspaceGettingStartedScreen';
  } else {
    return;
  }

  return Analytics.sendOperationalEvent({
    action: 'rendered',
    actionSubject,
    source: getScreenFromUrl(),
    containers: {
      organization: {
        id: context?.teamId,
      },
    },
  });
};

module.exports.memberHomePage = function (options = {}) {
  const {
    orgname,
    showHomeBoardsTab,
    showGettingStarted,
    templatesData,
    titleKey,
  } = options;
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelCache } = require('app/scripts/db/model-cache');

  if (!Auth.isLoggedIn()) {
    // Hopefully you're not being routed here if you aren't logged in and
    // the server is sending you to the home page
    return this.displayErrorPage();
  }

  // We've retired the '/templates/all' endpoint. Redirect to '/templates'
  if (
    templatesData &&
    templatesData.category === 'all' &&
    !templatesData.shortLink
  ) {
    navigate('/templates', {
      trigger: true,
      replace: true,
    });
  }

  const apdexTask = (() => {
    switch (false) {
      case !showHomeBoardsTab:
        return 'memberBoards';
      default:
        return 'memberHome';
    }
  })();
  if (!templatesData) {
    Apdex.start({ task: apdexTask });
  }

  return ModelCache.waitFor('Member', Auth.myId(), () => {
    return importWithRetry(() =>
      import(/* webpackChunkName: "member-page" */ './memberPage'),
    ).then(({ memberPage }) => {
      const possibleNewSignup =
        Util.idToDate(Auth.myId()) > Util.dateBefore({ minutes: 3 });
      const sentPossibleNewSignupEvent = __guard__(Auth.me(), (x) =>
        x.isDismissed('sent-possible-new-signup-event'),
      );
      if (
        simulateNewUser ||
        (!sentPossibleNewSignupEvent && possibleNewSignup)
      ) {
        trackGTMEvent({
          event: 'trello.possibleNewSignup',
          ed: __guard__(Auth.me(), (x1) => x1.getEmailDomain()),
        });
        // Only send GTM signup event once per account
        __guard__(Auth.me(), (x2) =>
          x2.dismiss('sent-possible-new-signup-event'),
        );
      }

      const lastHomeTab = getHomeLastTab.call(this);
      // if there is no orgname or it's not on all boards tab then it means we are on '/'
      // in that case if there is a last home tab that isn't '/' we want to redirect to that
      if (
        !orgname &&
        !showHomeBoardsTab &&
        !showGettingStarted &&
        !templatesData &&
        lastHomeTab &&
        lastHomeTab !== '/' &&
        !browserNav
      ) {
        browserNav = false;

        // When a user lands on `/` and immediately gets redirected to `/:username/boards`,
        // we want to treat that as an "initialLoad" rather than a "transition" for Apdex
        // purposes. We need to explicitly tell the Apdex client this information, since
        // the URL change makes it look like we're doing a client-side transition even
        // though this the first rendered page the user is seeing.
        Apdex.cancel({ task: apdexTask });
        isInitial =
          Apdex.isInitialLoad && Apdex.initialUrl === window.location.href;

        return navigate(lastHomeTab, {
          trigger: true,
          replace: true,
        });
      } else if (browserNav) {
        // if navigating with browser nav buttons then we need to set the last tab
        TrelloStorage.set(getHomeLastTabStorageKey(), window.location.pathname);
      }

      if (orgname && !isMemberOfOrg(orgname)) {
        return redirectHomeToDefaultTab.call(this);
      }

      trackMemberHomeView(
        orgname,
        showHomeBoardsTab,
        templatesData,
        showGettingStarted,
      );

      browserNav = false;
      // If you're logged in, always kick you to your own boards page, since you
      // can't see anyone elses
      // eslint-disable-next-line eqeqeq
      if (simulateNewUser == null) {
        simulateNewUser = $.cookie('simulateNewUser');
      }
      const opts = {
        username: 'me',
        // we are using loadMinimumMemberDataForTemplatePage here to fetch the minimum
        // amount of member data so that we pre-cache the apollo cache. This avoids
        // making excessive requests when UpgradePromptQuery is called further down
        // the component tree
        loadFn:
          !orgname && !showHomeBoardsTab && templatesData
            ? 'loadMinimumMemberDataForTemplatePage'
            : 'loadMemberBoardsData',
        viewClassName: 'MemberHomeView',
        getLocation: (username) => {
          return this.getMemberBoardsUrl(
            username,
            orgname,
            showHomeBoardsTab,
            templatesData,
            showGettingStarted,
          );
        },
        titleKey: titleKey || 'boards',
        orgname,
        showHomeBoardsTab,
        showGettingStarted,
        templatesData,
      };

      return memberPage
        .call(this, opts)
        .then(() => {
          const title =
            typeof orgname === 'undefined'
              ? l(['page title', 'home'])
              : !orgname && showHomeBoardsTab
              ? l(['page title', 'boards'])
              : __guard__(
                  ModelCache.findOne('Organization', 'name', orgname),
                  (x3) => x3.get('displayName'),
                );
          return this.title(title);
        })
        .tap(function () {
          if (apdexTask !== 'memberBoards') {
            return;
          }

          if (isInitial) {
            Apdex.resetInitialState();
          }
          Apdex.stop({ task: apdexTask });

          return (isInitial = false);
        })
        .done();
    });
  });
};
