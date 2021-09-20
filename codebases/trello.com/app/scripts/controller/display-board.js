/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { importWithRetry } = require('@trello/use-lazy-component');

const { Auth } = require('app/scripts/db/auth');
const Alerts = require('app/scripts/views/lib/alerts');
const { ApiError } = require('app/scripts/network/api-error');
const PostRender = require('app/scripts/views/lib/post-render');
const Promise = require('bluebird');
const { isShortLink, checkId } = require('@trello/shortlinks');
const _ = require('underscore');
const $ = require('jquery');
const assert = require('app/scripts/lib/assert');
const f = require('effing');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const { Apdex } = require('@trello/atlassian-analytics');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { getSpinner } = require('app/src/getSpinner');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { MirrorCard } = require('app/src/components/CardBacks/MirrorCard');
const parseURL = require('url-parse');
const { maybeShowFooterChrome } = require('./maybeShowFooterChrome');

const DisplayBoardError = makeErrorEnum('DisplayBoard', [
  'ConfirmToView',
  'CardNotFound',
  'CardNotFoundOnThisBoard',
  'BoardNotFound',
]);
const { featureFlagClient } = require('@trello/feature-flag-client');
const { navigate } = require('./navigate');

const TASK_FAIL_ERRORS = ['Server', 'Timeout', 'NoResponse', 'Other'];

const extractReasonFromApiError = (err) =>
  err && err.name && err.name.replace(/^API::/, '');

const QUERY_PARAMS = [
  'menu',
  'filter',
  'cameFromGettingStarted',
  'showPopover',
  'openListComposer',
  'openCardComposerInFirstList',
  'inviteMemberId',
];

const fireAndForgetExtraBoardDataLoad = function (idBoardOrShortLink) {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelLoader } = require('app/scripts/db/model-loader');

  // Note that we should try to use the same id that would be used in
  // quickload, i.e. the shortLink
  const loadSecondary = ModelLoader.for(
    'top-level',
    'loadBoardSecondary',
    idBoardOrShortLink,
  );
  const loadPluginData = ModelLoader.for(
    'top-level',
    'loadBoardPluginData',
    idBoardOrShortLink,
  );

  Promise.all([loadSecondary, loadPluginData])
    .catch(ApiError, function () {})
    .done();
};

const loadBoardData = function (idBoardOrShortLink, options) {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelLoader } = require('app/scripts/db/model-loader');
  const requiredDataPromise = Promise.props({
    board: options.loadCalendar
      ? ModelLoader.for(
          'top-level',
          'loadCurrentBoardCalendarData',
          idBoardOrShortLink,
        )
      : options.loadLabels
      ? ModelLoader.for(
          'top-level',
          'loadCurrentBoardWithLabelData',
          idBoardOrShortLink,
        )
      : ModelLoader.for(
          'top-level',
          'loadCurrentBoardData',
          idBoardOrShortLink,
        ),
    checklists: options.loadCalendar
      ? ModelLoader.for('top-level', 'loadBoardChecklists', idBoardOrShortLink)
          // It's possible the API request will fail due to there being too
          // many checklists - in this case it's better to at least show them
          // their cards instead of giving them a "Board not found" error
          .catch(ApiError, function () {})
      : undefined,
  }).then(({ board }) => board);

  // The browser may limit how many concurrent requests we can make, so do
  // the secondary ones after the first one has started
  fireAndForgetExtraBoardDataLoad(idBoardOrShortLink);

  return requiredDataPromise
    .catch(ApiError.Unconfirmed, () =>
      Promise.reject(DisplayBoardError.ConfirmToView('Unconfirmed')),
    )
    .catch(ApiError, (err) => {
      const reason = extractReasonFromApiError(err);
      return Promise.reject(DisplayBoardError.BoardNotFound(reason));
    });
};

const getRenderLock = function () {
  PostRender.hold();
  return Promise.resolve().disposer(() => PostRender.release());
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.DisplayBoard = {
  showCardOnBoard(idCard, highlight, board, replyToComment, loadCardData) {
    return Promise.try(function () {
      let card;
      if ((card = board.getCard(idCard)) != null) {
        // We're making the assumption here that if we can find the card, then we
        // don't need to call loadCardData.  If we don't have e.g.
        // the idBoard, idList or name then we know for sure that we've
        // violated that assumption.
        assert(
          card.get('idBoard') != null &&
            card.get('idList') != null &&
            card.get('name') != null,
          'Tried to display a card that was only partially loaded',
        );
        return card;
      } else {
        return loadCardData(idCard).tap(function (card) {
          if (card.get('idBoard') !== board.id) {
            Promise.reject(
              DisplayBoardError.CardNotFoundOnThisBoard('', {
                idBoard: board.id,
              }),
            );
          }
        });
      }
    }).then((card) => {
      const cardRole = card.getCardRole();
      const boardPaidStatus = board.getPaidStatus();

      const cardBackRoot = document.getElementById('react-root-card-back');
      ReactDOM.unmountComponentAtNode(cardBackRoot);

      if (
        cardRole === 'mirror' &&
        (boardPaidStatus === 'enterprise' || boardPaidStatus === 'bc') &&
        featureFlagClient.get('wildcard.mirror-cards', false)
      ) {
        const unmount = renderComponent(
          <MirrorCard
            cardUrl={card.get('name')}
            idBoard={board.get('shortLink')}
            idMirrorCard={card.id}
            boardName={board.get('name')}
            // eslint-disable-next-line react/jsx-no-bind
            onClose={() => unmount()}
          />,
          cardBackRoot,
        );
      } else if (cardRole === 'board') {
        navigate(parseURL(card.get('name')).pathname, { trigger: true });
      } else if (
        cardRole === 'separator' ||
        cardRole === 'link' ||
        cardRole === 'mirror'
      ) {
        navigate(this.getBoardUrl(card.get('idBoard')), { trigger: true });
      } else {
        this.showCardDetail(card, { highlight, replyToComment });
      }
    });
  },

  showBoardDetailView(args, boardView) {
    return Promise.try(() => {
      let date, idCard, member;
      const board = boardView.model;

      if ((idCard = args.idCard) != null) {
        this.showCardOnBoard(
          idCard,
          args.highlight,
          board,
          args.replyToComment,
          args.loadCardData,
        );
      } else if (
        args.usernameBoardProfile &&
        (member = board.modelCache.findOne(
          'Member',
          'username',
          args.usernameBoardProfile,
        )) != null
      ) {
        boardView.showMemberProfile(member);
      } else if (['power-up', 'power-ups'].includes(args.section)) {
        const powerUpViewsEnabled = featureFlagClient.get(
          'ecosystem.power-up-views',
          false,
        );
        if (args.powerUpViewKey && powerUpViewsEnabled) {
          boardView.showPowerUpView({
            idPlugin: args.directoryIdPowerUp,
            viewKey: args.powerUpViewKey,
          });
        } else if (board.editable()) {
          boardView.showDirectory(
            args.directorySection,
            args.directoryCategory,
            args.directoryIdPowerUp,
            args.directoryIsEnabling,
          );
        } else {
          this.setBoardLocation(board.id);
        }
      } else if (args.section === 'map') {
        if (!board.isMapPowerUpEnabled()) {
          const boardUrl = this.getBoardUrl(board.id);
          navigate(boardUrl, { trigger: true });
        } else {
          boardView.showMap({
            mapCenterTo: args.mapCenterTo,
            zoom: args.zoom,
          });
        }
      } else if (args.section === 'dashboard') {
        boardView.showDashboard();
      } else if ((date = args.calendarDate) != null) {
        boardView.showCalendar(date);
      } else if (args.section === 'butler' && args.reportType) {
        boardView.showAutomaticReports(args.reportType);
      } else if (args.section === 'butler') {
        boardView.showButlerView({
          butlerTab: args.butlerTab,
          butlerCmdEdit: args.butlerCmdEdit,
          butlerCmdLog: args.butlerCmdLog,
          newCommand: args.butlerNewCommand,
          newIcon: args.butlerNewIcon,
          newLabel: args.butlerNewLabel,
        });
      } else if (args.section === 'table') {
        boardView.showTable();
      } else if (args.section === 'timeline') {
        boardView.showTimeline();
      } else if (args.section === 'calendar-view') {
        boardView.showCalendarView();
      } else {
        if (args.openListComposer) {
          boardView.openListComposer();
        }
        if (args.openCardComposerInFirstList) {
          // Deferred to ensure "Add a card" button below composer is hidden properly
          _.defer(() => boardView.openCardComposerInFirstList());
        }
        const extra = args.referrerUsername
          ? [args.referrerUsername, 'recommend']
          : undefined;
        this.setBoardLocation(board.id, args.section, extra);
      }

      return boardView;
    });
  },

  showTemplateTips(args, boardView) {
    return Promise.try(() => {
      boardView.renderTemplateTips();
      return boardView;
    });
  },

  // This should show only if you came from the /teamname/getting-started
  // view. We are passing a query param for ?cameFromGettingStarted=true
  // and evaluating it, which gets passes to args here. We dont want to show
  // the popover on refresh of page, so we dont want to evaluate the actual
  // query param itself, since the board will redirect to a clean url without it
  // after loading.
  showGettingStartedPupPopover(args, boardView) {
    return Promise.try(() => {
      const freeTeamOnboardingEnabled = featureFlagClient.get(
        'teamplates.web.free-team-onboarding',
        false,
      );

      if (args.cameFromGettingStarted) {
        boardView.renderTeamOnboardingPupPopover();
      } else if (freeTeamOnboardingEnabled && args.showPopover) {
        boardView.renderGettingStartedTip(args.showPopover);
      }
      return boardView;
    });
  },

  openInvitePopover(args, boardView) {
    // fire-and-forget, resolve boardView in the meantime
    Promise.try(() => {
      if (args.inviteMemberId) {
        boardView.openAddMembers();
        // TODO: use inviteMemberId in any logging we want to do.
      }
    });

    return Promise.resolve(boardView);
  },

  renderBoard(board, options) {
    // Important that we set this root-level class before we load the board
    // assets, to avoid the header color flickering. See also:
    // https://trello.atlassian.net/browse/FEPLAT-1409
    $('#trello-root').addClass('body-board-view');

    return new Promise((resolve, reject) => {
      return importWithRetry(() =>
        import(
          /* webpackChunkName: "board-view" */ 'app/scripts/views/board/board-view'
        ),
      ).then(({ default: BoardView }) => {
        return Promise.try(() => {
          let boardView;
          if (currentModelManager.onBoardView(board.id)) {
            boardView = this.existingTopLevelView(BoardView, board);
            if (_.isEqual(boardView.options.settings, options.settings)) {
              boardView.closeDetailView();

              resolve(boardView);
              return;
            }
          }

          this.clearPreviousView();
          this.setViewType(board);
          this.showHeader(this.headerOptsForBoard(board));
          maybeShowFooterChrome(this.getBoardUrl(board.id));

          boardView = this.topLevelView(
            BoardView,
            board,
            _.extend(options, {
              modelCache: board.modelCache,
              headerBranding: () =>
                this.headerBranding(this.headerOptsForBoard(board)),
            }),
          );

          $('#content').html(boardView.render().el);
          // the clearPreviousView call above is necessary, but it also removes
          // 'body-board-view' class from the root, which makes the board header
          // blue. We'll re-add it here for now, should be better addressed via
          // https://trello.atlassian.net/browse/FEPLAT-1409
          $('#trello-root').addClass('body-board-view');

          return resolve(boardView);
        });
      });
    });
  },

  headerOptsForBoard(board) {
    const enterprise = board.getEnterprise();
    if (enterprise != null) {
      return {
        headerBrandingColor: __guard__(
          enterprise.get('prefs'),
          (x) => x.brandingColor,
        ),
        headerBrandingLogo: enterprise.getHeaderLogo(),
        headerBrandingName: enterprise.get('displayName'),
      };
    } else {
      return {};
    }
  },

  settingsFromQuery() {
    return _.chain(location.search.substr(1).split('&'))
      .map((entry) => entry.split('=', 2))
      .filter(function (...args) {
        const [key] = Array.from(args[0]);
        return Array.from(QUERY_PARAMS).includes(key);
      })
      .map(function (...args) {
        const [key, value] = Array.from(args[0]);
        return [key, value];
      })
      .object()
      .value();
  },

  butlerSettingsFromQuery() {
    const butlerParamMapping = {
      c: 'butlerNewCommand',
      i: 'butlerNewIcon',
      l: 'butlerNewLabel',
    };
    const butlerSettings = {};
    const params = new URLSearchParams(location.search);
    Object.keys(butlerParamMapping).forEach((param) => {
      if (params.has(param)) {
        butlerSettings[butlerParamMapping[param]] = params.get(param);
      }
    });
    return butlerSettings;
  },

  displayBoard(settings) {
    const { idBoard, idCard, referrerUsername } = settings;
    assert(
      idBoard || idCard,
      'Illegal invocation of displayBoard: requires one of idBoard, or idCard',
    );
    if (
      (idCard != null && !checkId(idCard) && !isShortLink(idCard)) ||
      (idBoard != null && !checkId(idBoard) && !isShortLink(idBoard))
    ) {
      return Promise.resolve(
        this.displayErrorPage({
          errorType: 'malformedUrl',
        }),
      );
    }

    return Promise.using(getRenderLock(), () => {
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const { ModelLoader } = require('app/scripts/db/model-loader');
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const { ModelCache } = require('app/scripts/db/model-cache');
      // [LOADCARD]
      const loadCardData = _.once((idCardOrShortLink) =>
        ModelLoader.for('top-level', 'loadCardData', idCardOrShortLink).catch(
          ApiError,
          (err) => {
            const reason = extractReasonFromApiError(err);
            return Promise.reject(DisplayBoardError.CardNotFound(reason));
          },
        ),
      );

      const awaitView = ({ model }) => {
        return new Promise((resolve) => {
          return this.waitForId(model, resolve);
        });
      };

      // Allow settings object values to also be provided via query params
      const queryParams = this.settingsFromQuery();
      const butlerSettings =
        settings.section === 'butler' ? this.butlerSettingsFromQuery() : {};
      const detailArgs = _.extend(
        { loadCardData },
        settings,
        butlerSettings,
        queryParams,
      );

      const startTime = Date.now();
      const apdexTask = idCard != null ? 'card' : 'board';
      const apdexTaskId = idCard != null ? idCard : idBoard;

      const traceId = Analytics.startTask({
        taskName: 'view-board',
        source: getScreenFromUrl(),
      });

      Apdex.start({
        task: apdexTask,
        taskId: apdexTaskId,
      });

      return Promise.using(getSpinner(), () => {
        ModelLoader.release('top-level');
        return Promise.try(() => {
          if (idCard != null) {
            // If we're showing a card, we always want to load the data for it
            return loadCardData(idCard).call('get', 'idBoard');
          }
          return idBoard;
        })
          .then((idBoard) =>
            Promise.props({
              loadStartTime: Date.now(),
              board: loadBoardData(idBoard, {
                loadLabels:
                  (queryParams.filter != null
                    ? queryParams.filter.startsWith('label:')
                    : undefined) || false,
                loadCalendar: settings.section === 'calendar',
              }),
              analyticsActionSubject:
                ModelLoader.getUpToDateBoard(idBoard) != null
                  ? 'cachedBoard'
                  : 'board',
            }),
          )
          .then(({ board, analyticsActionSubject, loadStartTime }) => {
            if (referrerUsername && board.isTemplate()) {
              $.cookie('referrer', referrerUsername, {
                path: '/',
                expires: 14,
              });
            }

            const loadDuration = Date.now() - startTime;
            Analytics.sendOperationalEvent({
              action: 'loaded',
              actionSubject: analyticsActionSubject,
              containers: {
                board: {
                  id: board.id,
                },
              },
              attributes: {
                loadDuration,
              },
              source: getScreenFromUrl(),
            });

            const renderStartTime = Date.now();

            return this.renderBoard(board, {
              section: detailArgs.section,
              settings: {
                filter: detailArgs.filter,
                menu: detailArgs.menu,
              },
              referrerUsername,
            })
              .tap(function () {
                const loadAndRenderDuration = Date.now() - startTime;
                const renderDuration = Date.now() - renderStartTime;

                Analytics.sendOperationalEvent({
                  action: 'rendered',
                  actionSubject: analyticsActionSubject,
                  containers: {
                    board: {
                      id: board.id,
                    },
                  },
                  attributes: {
                    renderDuration,
                  },
                  source: getScreenFromUrl(),
                });

                Analytics.sendOperationalEvent({
                  action: 'displayed', // loadedAndRendered
                  actionSubject: analyticsActionSubject,
                  containers: {
                    board: {
                      id: board.id,
                    },
                  },
                  attributes: {
                    loadAndRenderDuration,
                  },
                  source: getScreenFromUrl(),
                });

                Analytics.taskSucceeded({
                  taskName: 'view-board',
                  traceId,
                  source: getScreenFromUrl(),
                });
              })
              .tap(awaitView)
              .then(f(this, 'showBoardDetailView', detailArgs))
              .then(f(this, 'showGettingStartedPupPopover', detailArgs))
              .then(f(this, 'openInvitePopover', detailArgs))
              .tap(() =>
                Apdex.stop({
                  task: apdexTask,
                  taskId: apdexTaskId,
                }),
              )
              .then(f(this, 'showTemplateTips', detailArgs));
          })
          .catch(DisplayBoardError.ConfirmToView, (err) => {
            assert(
              Auth.isLoggedIn(),
              "Got 401: 'Confirm to view' while not logged in",
            );
            const reason = err.message;
            if (TASK_FAIL_ERRORS.includes(reason)) {
              Analytics.taskFailed({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            } else {
              Analytics.taskAborted({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            }
            Analytics.sendScreenEvent({
              name: 'unconfirmedBoardNotFoundScreen',
              attributes: {
                reason,
              },
            });
            return ninvoke(ModelCache, 'waitFor', 'Member', Auth.myId()).then(
              () => {
                return this.displayErrorPage(
                  _.extend(
                    { errorType: 'unconfirmedBoardNotFound' },
                    Auth.me().toJSON(),
                  ),
                );
              },
            );
          })
          .catch(DisplayBoardError.CardNotFound, (err) => {
            const reason = err.message;
            if (TASK_FAIL_ERRORS.includes(reason)) {
              Analytics.taskFailed({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            } else {
              Analytics.taskAborted({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            }
            Analytics.sendScreenEvent({
              name: 'cardNotFoundScreen',
              attributes: {
                reason,
              },
            });
            return this.displayErrorPage({
              errorType: 'cardNotFound',
              reason,
            });
          })
          .catch(DisplayBoardError.BoardNotFound, (err) => {
            const reason = err.message;
            if (TASK_FAIL_ERRORS.includes(reason)) {
              Analytics.taskFailed({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            } else {
              Analytics.taskAborted({
                taskName: 'view-board',
                traceId,
                source: getScreenFromUrl(),
                error: err,
              });
            }
            Analytics.sendScreenEvent({
              name: 'boardNotFoundScreen',
              attributes: {
                reason,
              },
            });
            return this.displayErrorPage({
              errorType: 'boardNotFound',
              reason,
            });
          })
          .catch(DisplayBoardError.CardNotFoundOnThisBoard, ({ idBoard }) => {
            Analytics.taskAborted({
              taskName: 'view-board',
              traceId,
              source: getScreenFromUrl(),
              error: new Error('card does not exist'),
            });
            Alerts.show('card does not exist', 'warning', 'doesnotexist', 5000);
            return this.setBoardLocation(idBoard, settings.section);
          })
          .catch((error) => {
            throw Analytics.taskFailed({
              taskName: 'view-board',
              traceId,
              source: getScreenFromUrl(),
              error,
            });
          });
      });
    });
  },
};

// [LOADCARD]
//
// It's probable that we'll need to do two data loads in order to load the
// board: one to determine what board the card lives on, and another to load
// the card.
//
// It's *possible*, if bizarre QuickLoad race conditions play in our favor,
// that doing the naive thing will just *happen* to work -- if the timing
// is just right, QuickLoad will give us the same response back twice, and
// two calls create only one actual network request.
//
// But. Let's memoize it ourself just in case, so that we don't have to worry
// about QuickLoad's behavior changing and doubling the requests here.
