/* global Sentry, TrelloPowerUp */

if (typeof $ === 'undefined') {
  window.ButlerPowerUp = {
    init: () => {
      console.log('[ERROR] Could not load Butler - jQuery not available.');
      if (typeof TrelloPowerUp !== 'undefined') {
        TrelloPowerUp.initialize(
          {
            'board-buttons': () => [],
            'card-buttons': () => [],
            'show-settings': () => [],
            'remove-data': () => [],
          },
          {
            targetOrigin: 'https://trello.com',
          }
        );
      }
    },
  };
  throw new Error(`jQuery is undefined`);
}

// setup polyfills
require('core-js/stable');

const has = require('lodash.has');
const LZString = require('lz-string');
const Analytics = require('./include/analytics.js');
const Log = require('./include/logging.js');
const util = require('./include/util.js');
const TrelloApi = require('./include/trello-api.js');
const CommandStorage = require('./include/powerup-command-storage.js');
const Suggestions = require('./include/powerup-suggestions.js');
const Plan = require('./include/powerup-plan.js');

// These imported values weren't being used, but I'm not sure if they might have
// side effects. Someone should take a look through these at another time to
// determine whether this is the appropriate entry point for them.
require('./include/api-endpoint.js');
require('./include/builder-util.js');
require('./include/powerup-tabs.js');
require('./include/powerup-command-log');
require('./include/powerup-message-broker.js');
require('./include/powerup-command-runner');
require('./include/powerup-dashboard.js');
require('./include/powerup-account.js');

Log.init();
const ButlerPowerUp = {};
const { Auth } = TrelloApi;

(function() {
  ButlerPowerUp.init = function() {
    if (typeof TrelloPowerUp === 'undefined') {
      Sentry.captureException(new Error('TrelloPowerUp is undefined'));
      return console.log('[ERROR] TrelloPowerUp library not available.');
    }

    window._trello = TrelloPowerUp.initialize(
      {
        'board-buttons': getBoardButtons,
        'card-buttons': getCardButtons,
        'show-settings': showDashboard,
        'remove-data': removeData,
      },
      {
        targetOrigin: 'https://trello.com',
      }
    );
    const t = window._trello;

    t.member('id')
      .then(function(m) {
        Sentry.configureScope(function(scope) {
          if (m && m.id !== 'notLoggedIn') {
            scope.setUser({ id: m.id });
          }
        });
      })
      .catch(err => util.handleError('configureSentry', err));
  };

  function handleOverrides(t, board, buttons) {
    TrelloApi.getBoard(board, {
      fields: 'prefs',
      members: 'all',
      member_fields: 'id',
    }).then(function(boardInfo) {
      if (boardInfo.prefs.permissionLevel !== 'private') {
        return;
      }
      t.get('board', 'private', 'overrides').then(function(overridesData) {
        const overrides = { ...(overridesData || {}) };
        buttons.forEach(function(button) {
          // Check if the button belongs to a member who's on the board
          const hasButtonCreatorOnBoard = (members, button) =>
            members.some(member => member.id === button.uid);
          // Add override to board or card button if it doesn't belong
          // to any members on the private board
          if (!hasButtonCreatorOnBoard(boardInfo.members, button)) {
            // Create override for button if it doesn't yet exist
            if (!overrides[button.id]) {
              overrides[button.id] = {
                enabled: false,
                ot: +new Date(),
              };
            }
            t.set('board', 'private', 'overrides', overrides);
          }
        });
      });
    });
  }

  function getBoardButtons(t, options) {
    // Use these call as an opportunity to update our Sentry context
    if (window.Sentry) {
      Sentry.configureScope(function(scope) {
        if (t.isMemberSignedIn()) {
          scope.setUser({ id: t.getContext().member });
        }
        scope.setTag('webClient', t.getContext().version || 'unknown');
        scope.setTag('idBoard', t.getContext().board);
      });
    }

    if (!t.isMemberSignedIn() || !t.memberCanWriteToModel('board')) {
      return [];
    }

    CommandStorage.init(t);
    // if we have a token on file for the user, make sure that it is still valid
    // i.e. that the token hasn't been revoked
    Auth.ensureTokenValidity(t)
      .catch(err => util.handleError('ensureTokenValidity', err))
      .then(() => Auth.registerIfNecessary(t, false, CommandStorage, true))
      .catch(err => {
        if (err instanceof Auth.RegistrationError().NotConfirmed) {
          throw err;
        }
        util.handleError('registerIfNecessary', err);
      })
      .then(() =>
        Promise.all([
          Plan.checkUserQuota(t).catch(err => util.handleError('checkUserQuota', err)),
          // Refresh the suggestions asynchronously
          // We do this in the board-buttons capability handler because if the
          // cached suggestions are expired, we want to refresh them as early as
          // possible
          Suggestions.updateSuggestionCounts(t, CommandStorage).catch(err =>
            util.handleError('updateSuggestionCounts', err)
          ),
        ])
      )
      .catch(Auth.RegistrationError().NotConfirmed, () => {});

    const boardButtonTitleContext = t.getContext().butlerName || 'Butler';
    const { butlerkey } = t.getContext();
    function setButlerIcon() {
      if (butlerkey === 'automation') {
        return {
          dark: TrelloPowerUp.util.relativeUrl('./img/automation-light.svg'),
          light: TrelloPowerUp.util.relativeUrl('./img/automation-dark.svg'),
        };
      }

      return {
        dark: TrelloPowerUp.util.relativeUrl('./img/butler-powerup-btn-white.svg'),
        light: TrelloPowerUp.util.relativeUrl('./img/butler-powerup-btn-dark.svg'),
      };
    }

    return TrelloPowerUp.Promise.all([
      Plan.getUserPlanLocal(t),
      CommandStorage.getLocalCommands(),
      Plan.getAttnStatus(t),
      Suggestions.getUnseenSuggestionCount(t),
    ])
      .spread(function(plan, localCommands, attn, unseenSuggestionCounts) {
        const buttons = localCommands.commands;
        const boardButtonTitle = `${boardButtonTitleContext}${
          unseenSuggestionCounts.total
            ? ` (${unseenSuggestionCounts.total} Tip${unseenSuggestionCounts.total > 1 ? 's' : ''})`
            : ''
        }`;

        let default_buttons = [
          {
            icon: setButlerIcon(),
            monochrome: false,
            text: boardButtonTitle,
            callback(cb_t) {
              return Auth.registerIfNecessary(cb_t, true, CommandStorage)
                .then(function() {
                  if (cb_t.getContext().useRoutes !== true) {
                    cb_t.overlay({
                      url: `./powerup-dashboard.html?board=${options.context.board}`,
                      inset: true,
                    });
                    return;
                  }
                  cb_t.board('shortLink', 'name').then(res => {
                    const boardSlug = util.makeSlug(res.name);
                    const boardUrl = `${document.referrer}b/${res.shortLink}/${boardSlug}/butler/`;
                    cb_t.navigate({
                      url: boardUrl,
                    });
                    cb_t.overlay({
                      url: `./powerup-dashboard.html?board=${options.context.board}`,
                      inset: true,
                    });
                  });
                })
                .catch(Auth.RegistrationError(), function() {
                  // swallow registration errors, they have already been reported
                })
                .catch(err => util.handleError('registerIfNecessary', err));
            },
          },
        ];

        if (
          (plan && plan.no_ui) ||
          ('canShowButlerUI' in t.getContext() && !t.getContext().canShowButlerUI)
        ) {
          default_buttons = [];
        }
        if (t.getContext().useNewButton) {
          default_buttons = [];
        }

        const enabledButtons = buttons.filter(({ enabled }) => enabled);
        // Adds overrides to board and card buttons to prevent them from
        // being displayed on private boards if the button owner is
        // not a member of the board
        if (enabledButtons.length > 0) {
          handleOverrides(t, options.context.board, enabledButtons);
        }

        return default_buttons.concat(
          enabledButtons
            .filter(({ type }) => type === 'board-button')
            .sort(function(a, b) {
              return a.is_own ? (b.is_own ? 0 : -1) : b.is_own ? 1 : 0;
            })
            .slice(0, 20)
            .map(function(button) {
              return {
                icon: `./assets/fa-5.1.1/icons/white/${button.image}.svg`,
                text: button.label,
                callback(cb_t) {
                  cb_t
                    .boardBar({
                      height: 38,
                      url: `./powerup-command-runner.html?cmd=${button.id}`,
                    })
                    .catch(err => util.handleError('boardButtonClick', err));
                },
              };
            })
        );
      })
      .catch(err => {
        util.handleError('getBoardButtons', err);
        return [
          {
            icon: {
              dark: TrelloPowerUp.util.relativeUrl('./img/butler-powerup-attn-btn-white.svg'),
              light: TrelloPowerUp.util.relativeUrl('./img/butler-powerup-attn-btn-dark.svg'),
            },
            monochrome: false,
            text: 'Butler',
            callback(cb_t) {
              return Auth.registerIfNecessary(cb_t, true, CommandStorage)
                .then(() => {
                  return cb_t.overlay({
                    url: `./powerup-dashboard.html?board=${options.context.board}`,
                    inset: true,
                  });
                })
                .catch(Auth.RegistrationError(), () => {})
                .catch(error => util.handleError('registerIfNecessary', error));
            },
          },
        ];
      });
  }

  function getCardButtons(t, options) {
    if (
      t.getContext().omitCardButtons ||
      !t.isMemberSignedIn() ||
      !t.memberCanWriteToModel('card')
    ) {
      return [];
    }

    CommandStorage.init(t);
    Plan.checkUserQuota(t).catch(err => util.handleError('checkUserQuota', err));

    return TrelloPowerUp.Promise.all([
      Plan.getUserPlanLocal(t),
      CommandStorage.getLocalCommands(),
      Suggestions.getUnseenSuggestionCount(t),
    ])
      .spread(function(plan, localCommands, unseenSuggestionCount) {
        const buttons = localCommands.commands.filter(function(button) {
          return button.type === 'card-button' && button.enabled;
        });

        let unseenSuggestionButton;
        if (unseenSuggestionCount.total) {
          unseenSuggestionButton = {
            icon: `./img/butler-powerup-card-btn.svg`,
            text: `Butler Tip${unseenSuggestionCount.total > 1 ? 's' : ''} (${
              unseenSuggestionCount.total
            })`,
            callback(cb_t) {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'button',
                actionSubjectId: 'butlerUnseenSuggestionsButton',
                source: 'cardDetailScreen',
                attributes: {
                  numUnseenSuggestions: unseenSuggestionCount.total,
                  section: 'powerupsSection',
                },
              });
              return Auth.registerIfNecessary(cb_t, true, CommandStorage)
                .then(() => {
                  return cb_t.hideCard().then(function() {
                    return cb_t.overlay({
                      url: `./powerup-dashboard.html?board=${options.context.board}&tab=suggestions`,
                      inset: true,
                    });
                  });
                })
                .catch(Auth.RegistrationError(), () => {})
                .catch(error => util.handleError('registerIfNecessary', error));
            },
          };
        }
        const limitedButtons = buttons
          .sort(function(a, b) {
            return a.is_own ? (b.is_own ? 0 : -1) : b.is_own ? 1 : 0;
          })
          .slice(0, 20)
          .map(function(button) {
            return {
              icon: `./assets/fa-5.1.1/icons/grey/${button.image}.svg`,
              text: button.label,
              callback(cb_t) {
                Analytics.sendUIEvent({
                  action: 'clicked',
                  actionSubject: 'button',
                  actionSubjectId: 'butlerCardButton',
                  source: 'cardDetailScreen',
                  attributes: {
                    close: button.close,
                    section: 'powerupsSection',
                  },
                });
                cb_t.boardBar({
                  height: 38,
                  url: `./powerup-command-runner.html?cmd=${button.id}`,
                });
                if (button.close) {
                  cb_t.hideCard().catch(function() {
                    // noop
                  });
                }
              },
            };
          });
        if (unseenSuggestionButton) {
          limitedButtons.push(unseenSuggestionButton);
        }
        return limitedButtons;
      })
      .catch(err => {
        util.handleError('getCardButtons', err);
        return [
          {
            icon: './img/butler-powerup-card-attn-btn.svg',
            text: 'Butler',
            callback(cb_t) {
              return Auth.registerIfNecessary(cb_t, true, CommandStorage)
                .then(() => {
                  return cb_t.overlay({
                    url: `./powerup-dashboard.html?board=${options.context.board}`,
                    inset: true,
                  });
                })
                .catch(Auth.RegistrationError(), () => {})
                .catch(error => util.handleError('registerIfNecessary', error));
            },
          },
        ];
      });
  }

  function showDashboard(t, opts) {
    t.closePopup().catch(() => {});
    if ('canShowButlerUI' in t.getContext() && !t.getContext().canShowButlerUI) {
      return t.alert({
        message: 'Your enterprise has restricted the Butler dashboard to workspace admins.',
        duration: 10,
      });
    }
    if (!t.isMemberSignedIn() || !t.memberCanWriteToModel('board')) {
      return t.alert({
        display: 'warning',
        duration: 10,
        message: 'To use Butler on this board you must be a member of the board.',
      });
    }
    CommandStorage.init(t);
    return Auth.registerIfNecessary(t, true, CommandStorage)
      .then(function() {
        let encodedNewCommand;
        const params = {
          board: opts.context.board,
        };
        const newCommandParams = new URLSearchParams();
        if (opts.butlerTab) {
          params.tab = opts.butlerTab;
        }
        if (opts.butlerCmdEdit) {
          params.commandEdit = opts.butlerCmdEdit;
        }
        if (opts.butlerCmdLog) {
          params.commandLog = opts.butlerCmdLog;
        }
        if (opts.newCommand) {
          // ensure we've got an lz-compressed string
          try {
            const decodedCommand = LZString.decompressFromEncodedURIComponent(opts.newCommand);
            if (!decodedCommand) {
              encodedNewCommand = LZString.compressToEncodedURIComponent(opts.newCommand);
            } else {
              encodedNewCommand = opts.newCommand;
            }
            params.newCommand = encodedNewCommand;
            newCommandParams.set('c', encodedNewCommand);
          } catch (e) {
            encodedNewCommand = null;
          }
        }
        if (opts.newIcon) {
          params.newIcon = opts.newIcon;
          newCommandParams.set('i', opts.newIcon);
        }
        if (opts.newLabel) {
          params.newLabel = opts.newLabel;
          newCommandParams.set('l', opts.newLabel);
        }
        const queryParams = new URLSearchParams(params);
        // if we're using the new button, then the url will already be set correctly by web
        // all we need to do is return the signed iframe url
        if (t.getContext().useNewButton === true) {
          const retUrl = TrelloPowerUp.util.relativeUrl(
            `./powerup-dashboard.html?${queryParams.toString()}`
          );
          const signed = t.signUrl(retUrl, { inset: true });
          return signed;
        }
        if (t.getContext().useRoutes === true) {
          return t.board('shortLink', 'name').then(res => {
            const boardSlug = util.makeSlug(res.name);
            const tabUrlComponent = opts.butlerTab ? util.normalizeTabForUrl(opts.butlerTab) : '';
            const newCommandUrlComponent = encodedNewCommand
              ? `/new?${newCommandParams.toString()}`
              : '';
            const newUrlComponent =
              newCommandUrlComponent ||
              (opts.butlerCmdEdit && opts.butlerCmdEdit === 'new' ? `/new/` : '');
            const editUrlComponent = opts.butlerCmdEdit ? `/edit/${opts.butlerCmdEdit}` : '';
            const logUrlComponent = opts.butlerCmdEdit ? `/log/${opts.butlerCmdLog}` : '';
            const actionUrlComponent = newUrlComponent || editUrlComponent || logUrlComponent;
            const boardUrl = `https://trello.com/b/${res.shortLink}/${boardSlug}/butler/${tabUrlComponent}${actionUrlComponent}`;
            t.navigate({
              url: boardUrl,
            });
            return t
              .overlay({
                url: `./powerup-dashboard.html?${queryParams.toString()}`,
                inset: true,
              })
              .catch(err => util.handleError('showDashboard', err));
          });
        }
        return t
          .overlay({
            url: `./powerup-dashboard.html?${queryParams.toString()}`,
            inset: true,
          })
          .catch(err => util.handleError('showDashboard', err));
      })
      .catch(Auth.RegistrationError(), () => {
        if (t.getContext().useNewButton === true) {
          t.board('shortLink', 'name')
            .then(res => {
              const boardSlug = util.makeSlug(res.name);
              setTimeout(() => {
                t.navigate({
                  url: `https://trello.com/b/${res.shortLink}/${boardSlug}`,
                  trigger: true,
                });
              }, 500);
            })
            .catch(() => {});
        }
      })
      .catch(err => util.handleError('registerIfNecessary', err));
  }

  function removeData(t) {
    Auth.clearMemory(t);
    return true;
  }
})();

window.ButlerPowerUp = ButlerPowerUp;
