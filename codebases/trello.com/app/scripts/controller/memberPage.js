/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { l } = require('app/scripts/lib/localize');
const BluebirdPromise = require('bluebird');
const $ = require('jquery');
const { ApiError } = require('app/scripts/network/api-error');
const { Util } = require('app/scripts/lib/util');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Campaigns, MoonshotSteps } = require('app/src/components/Moonshot');
const { navigate } = require('app/scripts/controller/navigate');
const { importWithRetry } = require('@trello/use-lazy-component');
const { headerOptsForHome } = require('./memberPageHelpers');
const { getSpinner } = require('app/src/getSpinner');
const { maybeShowFooterChrome } = require('./maybeShowFooterChrome');

// Variables used to determine if we should pretend the user is new, for testing
// purposes
let simulateNewUser = null;

function getViewClass(viewClass) {
  switch (viewClass) {
    case 'MemberHomeView':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-home-view" */ 'app/scripts/views/member/member-home-view'
        ).then((module) => module.default),
      );
    case 'MemberCardsView':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-cards-view" */ 'app/scripts/views/member/member-cards-view'
        ).then((module) => module.default),
      );
    case 'MemberAccountView':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-account-view" */ 'app/scripts/views/member/member-account-view'
        ).then((module) => module.default),
      );
    case 'MemberActivityView':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-activity-view" */ 'app/scripts/views/member/member-activity-view'
        ).then((module) => module.default),
      );
    case 'MemberBillingView':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-billing-view" */ 'app/scripts/views/member/member-billing-view'
        ).then((m) => m.default),
      );
    case 'MemberHomeProfileTab':
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "member-home-profile-tab" */ 'app/scripts/views/member-home-profile-tab'
        ).then(({ MemberHomeProfileTab }) => MemberHomeProfileTab),
      );
    default:
      return BluebirdPromise.resolve(viewClass);
  }
}

module.exports.memberPage = function ({
  username,
  loadFn,
  preloadFn, //get member info for header
  // viewClass,
  viewClassName,
  getLocation,
  bodyClass,
  product,
  orgname,
  titleKey,
  showHomeBoardsTab,
  showGettingStarted,
  templatesData,
}) {
  return BluebirdPromise.using(getViewClass(viewClassName), (viewClass) => {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const MemberHomeView = require('app/scripts/views/member/member-home-view');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelCache } = require('app/scripts/db/model-cache');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    // eslint-disable-next-line eqeqeq
    if (username == null) {
      username = Auth.myUsername();
    }

    return BluebirdPromise.using(getSpinner(), () => {
      ModelLoader.release('top-level');

      return ModelLoader.for('top-level', preloadFn || loadFn, username)
        .then((member) => {
          const loadPromise = preloadFn
            ? ModelLoader.for('top-level', loadFn, username)
            : BluebirdPromise.resolve();

          // Wait for the feature flags to be initialized
          return featureFlagClient.ready().then(() => {
            let redirectPath = null;
            const memberHasNoBoards = member.boardList.length === 0;
            const memberHasNoOrgs = member.organizationList.length === 0;
            // eslint-disable-next-line eqeqeq
            if (simulateNewUser == null) {
              simulateNewUser = $.cookie('simulateNewUser');
            }

            const isNewUser =
              simulateNewUser ||
              Util.idToDate(Auth.myId()) > Util.dateBefore({ days: 7 });

            const isNDSActive = featureFlagClient.get(
              'btg.workspaces.new-direct-signups',
              false,
            );
            const isNDSEnterpriseActive = featureFlagClient.get(
              'btg.workspaces.new-direct-signups.enterprise',
              false,
            );

            const isEligible = member?.getEnterprise()?.get('isRealEnterprise')
              ? isNDSActive && isNDSEnterpriseActive
              : isNDSActive;

            // If a user is already enrolled in the moonshot campaign, redirect
            // them there to finish the flow
            if (isEligible && member.campaignIsActive(Campaigns.MOONSHOT)) {
              const campaign = member.getCampaign(Campaigns.MOONSHOT);
              // One step is not on /create-first-team, so don't redirect if there
              if (campaign.currentStep !== MoonshotSteps.WELCOME) {
                redirectPath = '/create-first-team';
              } else {
                // just writing this else to be clear in this comment.
                // the time you hit this is when you are on the welcome step of moonshot.
                // If you are, and you delete your team at some point, then we shouldn't
                // redirect them back to moonshot when going home. However we want to make
                // sure we make the campaign as completed.
                member.dismissCampaign(Campaigns.MOONSHOT);
              }
            } else if (
              viewClass === MemberHomeView &&
              isNewUser &&
              memberHasNoBoards &&
              memberHasNoOrgs &&
              !member.campaignIsDismissed(Campaigns.MOONSHOT) &&
              !Auth.me().isDismissed('create-first-board')
            ) {
              if (Util.getQueryParameter('promocode')) {
                // We don't want users that are signing up with Slack promocode get bucketed into the Free trial experiment so we are extracting this check here.
                // Once the getExperiment runs, it will have a side effect of bucketing users to it.
                // However, we still want to use the Moonshot flow, so we are still redirecting the user to it.
                redirectPath = '/create-first-team';
              } else if (isEligible) {
                redirectPath = '/create-first-team';
              } else {
                redirectPath = '/create-first-board';
              }
            }

            if (redirectPath) {
              return navigate(redirectPath, { trigger: true, replace: true });
            }

            this.clearPreviousView();
            this.setViewType(member);

            const title =
              // eslint-disable-next-line eqeqeq
              Auth.isMe(member) && titleKey != null
                ? l(['page title', titleKey])
                : member.getMemberViewTitle();

            // Do this before creating the view, in case the view has more
            // specific logic for setting the URL
            this.setLocation({
              title,
              location: getLocation.call(this, member.get('username'), product),
              options: {
                replace: true,
              },
            });

            const options = {
              product,
              orgname,
              modelCache: ModelCache,
              showHomeBoardsTab,
              showGettingStarted,
              templatesData,
              loadPromise,
            };

            const memberView = this.topLevelView(viewClass, member, options);
            this.showHeader(headerOptsForHome(options));
            maybeShowFooterChrome(
              this.getMemberBoardsUrl(
                member.get('username'),
                orgname,
                showHomeBoardsTab,
                templatesData,
                showGettingStarted,
              ),
            );

            if (bodyClass) {
              $('#trello-root').addClass(bodyClass);
            } else {
              $('#trello-root').addClass('body-tabbed-page');
            }

            $('#content').html(memberView.render().el);
            this.focusContent();
            if (typeof memberView.getData === 'function') {
              memberView.getData();
            }
          });
        })
        .catch(ApiError, () => {
          this.displayErrorPage();
        });
    });
  });
};
