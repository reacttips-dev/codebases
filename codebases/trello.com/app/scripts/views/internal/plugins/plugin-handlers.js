/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const jwtDecode = require('jwt-decode');
const Promise = require('bluebird');
const xtend = require('xtend');

const fireConfetti = require('canvas-confetti').default;

const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const defaultPowerUpIcon = require('resources/images/directory/icons/customIcon.png');
const Dialog = require('app/scripts/views/lib/dialog');
const {
  isWebClientPage,
} = require('app/scripts/lib/util/url/is-web-client-page');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { firstPartyPluginsOrg, pluginCiOrg } = require('@trello/config');
const { getScreenFromUrl } = require('@trello/atlassian-analytics');
const { showFlag, dismissFlag } = require('@trello/nachos/experimental-flags');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const PluginBoardBar = require('app/scripts/views/lib/plugin-board-bar');
const PluginHandlerContext = require('app/scripts/views/internal/plugins/plugin-handler-context');
const PluginModal = require('app/scripts/views/lib/plugin-modal');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginOverlayView = require('app/scripts/views/plugin/plugin-overlay-view');
const PluginPopOverIFrameView = require('app/scripts/views/plugin/plugin-pop-over-iframe-view');
const PluginPopOverConfirmView = require('app/scripts/views/plugin/plugin-pop-over-confirm-view');
const PluginPopOverDateTimeView = require('app/scripts/views/plugin/plugin-pop-over-datetime-view');
const PluginPopOverListView = require('app/scripts/views/plugin/plugin-pop-over-list-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const processCallbacks = require('app/scripts/views/internal/plugins/plugin-process-callbacks');
const {
  sendPluginScreenEvent,
  sendPluginTrackEvent,
  sendPluginOperationalEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { siteDomain } = require('@trello/config');
const { navigate } = require('app/scripts/controller/navigate');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');

const INVALID_HEIGHT = 'Invalid height, must be a positive number';
const INVALID_URL = 'Invalid url, must be http or https';
const MISSING_BOARD = 'Invalid context, missing board';
const MISSING_CARD = 'Invalid context, missing card';
const MISSING_CONTEXT = 'Missing context, command requires context';
const MISSING_EL =
  'Invalid context, missing el (or attempt to use el after initial request)';
const MISSING_LIST = 'Invalid context, missing list';
const MISSING_MEMBER = 'Invalid context, missing member';
const CARD_NOT_FOUND = 'Card not found or not on current board';
const MISSING_ORG = 'Invalid context, missing organization';
const DISABLED = 'Plugin disabled on board';
const INVALID_CONTEXT = 'Invalid context, unable to deserialize';

const isInPopOver = function (t, context) {
  let iframe;
  const { el } = context;

  if (el != null && (PopOver.contains(el) || PopOver.toggledBy(el))) {
    return true;
  }

  if ((iframe = iframeFromHost(t)) != null && PopOver.contains(iframe)) {
    return true;
  }

  return false;
};

let currentOverlayView = null;
const closeOverlay = function () {
  if (currentOverlayView != null) {
    currentOverlayView.remove();
  }
  currentOverlayView = null;
};

const jwtCache = new Map();
let jwtCacheClearInterval = null;
const jwtCacheClearPeriod = 60000;
const clearJWTCache = function () {
  jwtCache.forEach(function (val, key) {
    if (val.expires < Date.now() + 60000) {
      return jwtCache.delete(key);
    }
  });
  if (jwtCache.size === 0) {
    // empty cache, pause the garbage cleaner
    clearInterval(jwtCacheClearInterval);
    return (jwtCacheClearInterval = null);
  }
};

// WARNING: The context is supplied by the power-up, and shouldn't necessarily
// be trusted.
module.exports = function ({ idPlugin, allowRestricted }) {
  const mapHandlers = (handlers) =>
    _.mapObject(
      handlers,
      (fx) =>
        function (t, options) {
          let context, deserializedContext;
          if ((context = options?.context) == null) {
            throw t.NotHandled('Missing context');
          }

          // Process any callbacks in the options we were given, since some things
          // like popups might be using them
          const runCallback = ({ command, el, options: commandOptions }) =>
            Promise.using(
              PluginHandlerContext.serialize({ el }),
              (callbackContext) =>
                t
                  .request(
                    command,
                    xtend(commandOptions, {
                      context: PluginHandlerContext.extend(
                        context,
                        callbackContext,
                      ),
                    }),
                  )
                  .then((response) => {
                    return processCallbacks(response, runCallback);
                  }),
            );
          options = processCallbacks(options, runCallback);

          try {
            deserializedContext = PluginHandlerContext.deserialize(
              context,
              idPlugin,
            );
          } catch (err) {
            if (err instanceof PluginHandlerContext.Error.PluginDisabled) {
              throw t.PluginDisabled(DISABLED);
            }
          }

          if (deserializedContext == null) {
            throw t.InvalidContext(INVALID_CONTEXT);
          }

          return fx.call(
            handlers,
            t,
            xtend(options, { context: deserializedContext }),
          );
        },
    );
  const getArgs = function (t, args, required, allowAnonymous) {
    let { context } = args;
    const { idCard } = args;

    if (context != null && currentModelManager.onAnyCardView()) {
      const currentCardModel = currentModelManager.currentModel.get();
      if (currentCardModel) {
        context = xtend(context, {
          card: currentCardModel,
          board: currentCardModel.getBoard(),
          member: Auth.me(),
        });
      }
    }

    // anonymous requests will have null or empty contexts
    if (context == null || Object.keys(context).length === 0) {
      if (!allowAnonymous) {
        // only commands from allowlist can go forward
        throw t.NotHandled(MISSING_CONTEXT);
      }
      if (!currentModelManager.getCurrentBoard()?.isPluginEnabled(idPlugin)) {
        throw t.PluginDisabled(DISABLED);
      }
      context = {
        board: currentModelManager.getCurrentBoard(),
        member: Auth.me(),
      };
    }

    let { card } = context;
    const { board, el, list, member } = context;
    if (required?.board && board == null) {
      throw t.NotHandled(MISSING_BOARD);
    }
    if (required?.el && el == null) {
      throw t.NotHandled(MISSING_EL);
    }
    if (required?.list && list == null) {
      throw t.NotHandled(MISSING_LIST);
    }
    if (required?.member && member == null) {
      throw t.NotHandled(MISSING_MEMBER);
    }

    if (idCard != null) {
      if (board == null) {
        throw t.NotHandled(MISSING_BOARD);
      }
      if ((card = board.getCard(idCard)) == null) {
        throw t.NotHandled(CARD_NOT_FOUND);
      }
    }

    if (required?.card && card == null) {
      throw t.NotHandled(MISSING_CARD);
    }

    return xtend(args, { context: xtend(context, { card }) });
  };

  const handlers = {
    data(t, opts) {
      const { board, card } = getArgs(t, opts, { board: true }, true).context;
      const cardPluginData = card?.getPluginData(idPlugin);
      const memberPluginData = Auth.me()?.getPluginData(idPlugin);
      return xtend(
        board.getPluginData(idPlugin),
        cardPluginData,
        memberPluginData,
      );
    },

    set(t, opts) {
      const {
        context: { board, card },
        scope,
        visibility,
        data,
      } = getArgs(t, opts, { board: true }, true);

      if (!['private', 'shared'].includes(visibility)) {
        throw t.NotHandled('Invalid value for visibility');
      }
      if (!_.isString(data)) {
        throw t.NotHandled('Invalid value for data');
      }

      const target = (() => {
        switch (scope) {
          case 'card':
            return (
              card ||
              (() => {
                throw t.NotHandled(
                  'Card scope not available without card context',
                );
              })()
            );
          case 'board':
            return board;
          case 'member':
            return (
              Auth.me() ||
              (() => {
                throw t.NotHandled('No active member');
              })()
            );
          case 'organization':
            return (
              board.getOrganization() ||
              (() => {
                throw t.NotHandled(
                  'Unable to save plugin data at the organization level because the member is not in the organization',
                );
              })()
            );
          default:
            throw t.NotHandled('Invalid value for scope');
        }
      })();

      // private data can be set relative to models even if the models themselves aren't directly editable
      // for example storing a private auth token for a member on a public board they aren't a member of
      if (visibility === 'shared') {
        if ((scope === 'card' || scope === 'board') && !target?.editable()) {
          throw t.NotHandled('Scope not editable by active member');
        } else if (
          scope === 'organization' &&
          !target.hasActiveMembership(Auth.me())
        ) {
          throw t.NotHandled('Scope not editable by active member');
        }
      }

      // before we set shared plugindata do a heuristic check to determine
      // if anything sensitive might be being stored here and prevent it
      if (
        visibility === 'shared' &&
        /"(?:(?:auth|refresh)?[_-]?token|secret)":/i.test(data)
      ) {
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: board.id,
          idCard: card.id,
          event: {
            action: 'rejected',
            actionSubject: 'setPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        throw t.NotHandled(
          'Detected potential secret. You should never store secrets like tokens in shared pluginData. See: https://developers.trello.com/v1.0/reference#t-set',
        );
      }

      target.setPluginData(idPlugin, visibility, data);
    },

    navigate(t, opts) {
      const { board } = getArgs(t, opts, {}).context;
      const { url } = opts;
      const trigger =
        idPlugin === BUTLER_POWER_UP_ID && typeof opts.trigger !== 'undefined'
          ? opts.trigger
          : true;
      if (
        trigger &&
        board &&
        url.match(Controller.getBoardUrl(board, 'butler')) &&
        location.pathname.match(Controller.getBoardUrl(board, 'butler'))
      ) {
        return;
      }
      if (!pluginValidators.isValidUrlForIframe(url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (!isWebClientPage(url)) {
        throw t.NotHandled('Navigation only allowed to Trello client URLs');
      }

      const urlTarget = url
        .replace(new RegExp(`^${siteDomain}`), '')
        .replace(new RegExp(`^/(?=.)`), '');

      // location.pathname has a leading "/"; urlTarget does not
      // nothing to do if the url requested is the current url
      if (urlTarget !== location.pathname.slice(1)) {
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: board.id,
          event: {
            action: 'requested',
            actionSubject: 'navigatePluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        navigate(urlTarget, { trigger });
      }
    },

    showCard(t, opts) {
      const { card } = getArgs(t, opts, { card: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idCard: card.id,
        event: {
          action: 'requested',
          actionSubject: 'showCardPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      // to prevent the card appearing behind a modal or overlay, close those first
      closeOverlay();
      PluginModal.close();
      return Controller.showCardDetail(card);
    },

    hideCard(t, opts) {
      getArgs(t, opts, {});
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'hideCardPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      if (Controller.onCardView()) {
        return Dialog.hide();
      }
    },

    alert(t, opts) {
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'alertPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      const {
        isValidAlertDisplayType,
        isValidAlertDuration,
        isValidStringLength,
      } = pluginValidators;
      // required to have a message
      if (!isValidStringLength(opts?.message, 1, 140)) {
        throw t.NotHandled(
          'Invalid message. Must be string and within 140 characters',
        );
      }
      const plugin = ModelCache.get('Plugin', idPlugin);
      const identifier = `plugin-${idPlugin}`;
      const pluginName = plugin.get('name');
      const icon = plugin.get('icon')?.url || defaultPowerUpIcon;
      const duration = isValidAlertDuration(opts.duration) ? opts.duration : 5;
      const displayType = isValidAlertDisplayType(opts.display)
        ? opts.display
        : 'info';

      showFlag({
        id: identifier,
        title: pluginName,
        description: opts.message,
        image: { src: icon, alt: `${pluginName} icon` },
        isAutoDismiss: true,
        msTimeout: duration * 1000,
      });

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupAlertInlineDialog',
        attributes: {
          display: displayType,
        },
      });
    },

    hideAlert(t, opts) {
      getArgs(t, opts, {});
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'hideAlertPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      dismissFlag({ id: `plugin-${idPlugin}` });
    },

    popup(t, opts) {
      const { context, title, content, callback, pos } = getArgs(t, opts, {
        board: true,
      });
      const { board, el } = context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'popupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      const getView = function () {
        const options = { model: board, title, content, callback };
        switch (content.type) {
          case 'iframe':
            if (!pluginValidators.isValidUrlForIframe(content.url)) {
              throw t.NotHandled(INVALID_URL);
            }
            if (
              content.height != null &&
              !pluginValidators.isValidHeight(content.height)
            ) {
              throw t.NotHandled(INVALID_HEIGHT);
            }
            return new PluginPopOverIFrameView(options);
          case 'list':
            return new PluginPopOverListView(options);
          case 'confirm':
            return new PluginPopOverConfirmView(options);
          case 'date':
          case 'datetime':
            return new PluginPopOverDateTimeView(options);
          default:
            throw t.NotHandled('Unknown type for popup');
        }
      };

      const iframe = iframeFromHost(t);

      if (isInPopOver(t, context)) {
        PopOver.pushView({
          view: getView(),
        });
      } else if (el != null) {
        PopOver.toggle({
          elem: el,
          view: getView(),
        });
      } else if (
        pos != null &&
        iframe &&
        pluginValidators.isValidPosition(pos)
      ) {
        const iframeBoundingClientRect = iframe.getBoundingClientRect();
        PopOver.toggle({
          clientx: pos.x + iframeBoundingClientRect.left,
          clienty: pos.y + iframeBoundingClientRect.top,
          view: getView(),
        });
      } else {
        throw t.NotHandled(MISSING_EL);
      }

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupPopupInlineDialog',
        attributes: {
          popupType: content.search ? 'search' : content.type,
        },
      });
    },

    'close-popup'(t, opts) {
      getArgs(t, opts, {});
      const { context } = opts;
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'closePopupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      if (isInPopOver(t, context)) {
        PopOver.hide();
      } else {
        if (typeof console !== 'undefined' && console !== null) {
          console.error(
            'Error: No popover in context. Are you using the correct t?',
          );
        }
      }
    },

    // deprecated in favor of close-popup
    'pop-popup'(t, opts) {
      getArgs(t, opts, {});
      const { context } = opts;
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'popPopupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      if (isInPopOver(t, context)) {
        PopOver.popView();
      }
    },

    overlay(t, opts) {
      const {
        context: { board },
        content,
      } = getArgs(t, opts, { board: true });
      const allowlist = featureFlagClient.get(
        'platform.overlay_deprecation_whitelist',
        [],
      );
      const explicitlyAllowed = Array.from(allowlist).includes(idPlugin);
      if (!explicitlyAllowed && idPlugin > '5bcd4b400000000000000000') {
        // Id representing Oct 22, 2018
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: board.id,
          event: {
            action: 'rejected',
            actionSubject: 'overlayPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        throw t.NotHandled(
          't.overlay is deprecated and is unavailable to Power-Ups created after Oct 22, 2018',
        );
      }

      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'overlayPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (!pluginValidators.isValidUrlForIframe(content.url)) {
        throw t.NotHandled(INVALID_URL);
      }

      closeOverlay();
      // close any currently open PopOvers before drawing the overlay
      PopOver.hide();

      const plugin = ModelCache.get('Plugin', idPlugin);
      const idOrganizationOwner = plugin.get('idOrganizationOwner');
      const ownedByTrello = [firstPartyPluginsOrg, pluginCiOrg].includes(
        idOrganizationOwner,
      );
      if (!content.inset || !ownedByTrello) {
        currentOverlayView = new PluginOverlayView({ model: board, content });
        $('#chrome-container').append(currentOverlayView.render().el);
      }

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupOverlayModal',
      });
    },

    'close-overlay'(t, opts) {
      const args = getArgs(t, opts, { board: true });
      const boardView = Controller.getCurrentBoardView();
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'closeOverlayPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      const plugin = ModelCache.get('Plugin', idPlugin);
      const idOrganizationOwner = plugin.get('idOrganizationOwner');
      const ownedByTrello = [firstPartyPluginsOrg, pluginCiOrg].includes(
        idOrganizationOwner,
      );
      if (args.inset && ownedByTrello && boardView.butlerView != null) {
        boardView.closeButler();
      } else if (currentOverlayView != null) {
        closeOverlay();
      } else {
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('Warning: No overlay is being displayed');
        }
      }
    },

    confetti(t, opts) {
      const { pos, context } = getArgs(t, opts);
      const { el } = context;

      const confettiOptions = {
        particleCount: _.random(40, 75),
        spread: _.random(50, 90),
        angle: _.random(55, 125),
        origin: {
          x: 0.5,
          y: 0.2,
        },
      };

      const iframe = iframeFromHost(t);

      if (iframe) {
        const iframeBoundingClientRect = iframe.getBoundingClientRect();
        if (pos && pluginValidators.isValidPosition(pos)) {
          confettiOptions.origin = {
            x:
              (pos.x + iframeBoundingClientRect.left) /
              document.documentElement.clientWidth,
            y:
              (pos.y + iframeBoundingClientRect.top) /
              document.documentElement.clientHeight,
          };
        }
      } else if (el) {
        const elBoundingClientRect = el.getBoundingClientRect();
        confettiOptions.origin = {
          x: elBoundingClientRect.left / document.documentElement.clientWidth,
          y: elBoundingClientRect.top / document.documentElement.clientHeight,
        };
      }

      fireConfetti(confettiOptions);
    },

    modal(t, opts) {
      const {
        context: { board },
        content,
      } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'modalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (!pluginValidators.isValidUrlForIframe(content.url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (
        content.height != null &&
        !pluginValidators.isValidHeight(content.height)
      ) {
        throw t.NotHandled(INVALID_HEIGHT);
      }

      const plugin = ModelCache.get('Plugin', idPlugin);

      if (!_.isString(content.title)) {
        content.title = plugin?.get('name') || '';
      }
      content.title = content.title.trim();

      content.idPlugin = idPlugin;

      PluginModal.open({ model: board, content });

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupModalModal',
        attributes: {
          fullscreen: content.fullscreen === true,
          totalActions: content.actions ? content.actions.length : 0,
        },
      });
    },

    'update-modal'(t, opts) {
      const { content } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'updateModalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      content.idPlugin = idPlugin;

      PluginModal.update(content);
    },

    'close-modal'(t, opts) {
      getArgs(t, opts, {});
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'closeModalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      return PluginModal.close();
    },

    'board-bar'(t, opts) {
      const {
        context: { board },
        content,
      } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'boardBarPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (!pluginValidators.isValidUrlForIframe(content.url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (
        content.height != null &&
        !pluginValidators.isValidHeight(content.height)
      ) {
        throw t.NotHandled(INVALID_HEIGHT);
      }

      const plugin = ModelCache.get('Plugin', idPlugin);

      if (!content.title) {
        content.title = plugin?.get('name') || '';
      }

      PluginBoardBar.open({ model: board, content });

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupBoardBarModal',
        attributes: {
          totalActions: content.actions ? content.actions.length : 0,
          resizable: content.resizable === true,
        },
      });
    },

    'close-board-bar'(t, opts) {
      getArgs(t, opts, {});
      sendPluginOperationalEvent({
        idPlugin,
        event: {
          action: 'requested',
          actionSubject: 'closeBoardBarPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      return PluginBoardBar.close();
    },

    resize(t, { height }) {
      if (!pluginValidators.isValidHeight(height)) {
        throw t.NotHandled(INVALID_HEIGHT);
      }
      const iframe = iframeFromHost(t);
      if (iframe) {
        if ($(iframe).parents('.plugin-modal>.fullscreen').length) {
          if (typeof console !== 'undefined' && console !== null) {
            console.warn(
              'Warning: Fullscreen modals cannot be resized with t.sizeTo',
            );
          }
          return;
        }
        if (height) {
          // we want to restrict the vertical height of the board bar to 40% the height of the board
          if ($(iframe).parents('.plugin-board-bar').length) {
            PluginBoardBar.setDesiredHeight(height);
            PluginBoardBar.restrictHeight();
          } else {
            iframe.style.height = `${height}px`;
          }
        }
      } else {
        throw t.NotHandled('Could not find iframe to resize');
      }
    },

    card(t, opts) {
      const {
        context: { card },
        fields,
      } = getArgs(t, opts, { card: true });
      return PluginModelSerializer.card(card, fields);
    },

    cards(t, opts) {
      const {
        context: { board },
        fields,
        options,
      } = getArgs(t, opts, { board: true }, true);
      const openCards = board.openCards();

      if (options?.filter) {
        const filteredCards = openCards.filter((card) =>
          board.filter.satisfiesFilter(card),
        );

        return PluginModelSerializer.cards(filteredCards, fields);
      }

      return PluginModelSerializer.cards(openCards, fields);
    },

    list(t, opts) {
      getArgs(t, opts, {});
      const { context, fields } = opts;
      return Promise.try(function () {
        let card, list;
        if ((list = context.list) != null) {
          return list;
        }

        if ((card = context.card) != null) {
          if ((list = card.getList()) != null) {
            return list;
          }

          return ModelLoader.getCardList(card.id);
        }

        return null;
      }).then(function (list) {
        if (list == null) {
          throw t.NotHandled(MISSING_LIST);
        }

        return PluginModelSerializer.list(list, fields);
      });
    },

    lists(t, opts) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      return PluginModelSerializer.lists(board.listList.models, fields);
    },

    member(t, opts) {
      const {
        context: { member },
        fields,
      } = getArgs(t, opts, { member: true }, true);
      return PluginModelSerializer.member(member, fields);
    },

    board(t, opts) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      return PluginModelSerializer.board(board, fields);
    },

    'set-card-cover'(t, opts) {
      const {
        context: { card },
        url,
        file,
      } = getArgs(t, opts, { card: true, board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idCard: card.id,
        event: {
          action: 'requested',
          actionSubject: 'setCardCoverPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      return card.setPluginCover({ idPlugin, url, file });
    },

    'attach-to-card'(t, opts) {
      const {
        context: { card, board },
        url,
        name,
        mimeType,
      } = getArgs(t, opts, { card: true, board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        idCard: card.id,
        event: {
          action: 'requested',
          actionSubject: 'attachToCardCoverPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      return ninvoke(card, 'uploadUrl', { url, name, mimeType })
        .then((data) => {
          const source = getScreenFromUrl();
          return sendPluginTrackEvent({
            idPlugin,
            idBoard: board.id,
            idCard: card.id,
            event: {
              action: 'created',
              actionSubject: 'attachment',
              source,
            },
          });
        })
        .return();
    },

    organization(t, opts) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      if (board.hasOrganization() != null && board.getOrganization() != null) {
        return PluginModelSerializer.organization(
          board.getOrganization(),
          fields,
        );
      } else {
        throw t.NotHandled(MISSING_ORG);
      }
    },

    jwt(t, opts) {
      const {
        context: { board, card },
        includeCard,
        state,
      } = getArgs(t, opts, { board: true, member: true }, true);
      if (state != null && (!_.isString(state) || state.length > 2048)) {
        throw t.NotHandled(
          'Provided state must be a string, less than 2048 characters in length',
        );
      }
      const cacheKey = [
        idPlugin,
        board.id,
        includeCard ? card?.id : '',
        state,
      ].join(':');
      const cached = jwtCache.get(cacheKey);
      if (cached != null && cached.expires > Date.now() + 60000) {
        return cached.jwt;
      }
      return ApiPromise({
        url: `/1/plugin/${idPlugin}/jwt`,
        data: {
          idBoard: board.id,
          idCard: includeCard ? card?.id : undefined,
          state: state || '',
        },
        type: 'post',
      }).then(function (resp) {
        const { jwt } = resp;
        const decoded = jwtDecode(jwt);
        jwtCache.set(cacheKey, { jwt, expires: decoded.exp * 1000 });
        if (jwtCacheClearInterval == null) {
          // enable the garbage collector
          jwtCacheClearInterval = setInterval(
            clearJWTCache,
            jwtCacheClearPeriod,
          );
        }
        return jwt;
      });
    },
  };

  if (allowRestricted) {
    _.extend(handlers, {
      'request-token'(t, { context, name, key, scope }) {
        sendPluginOperationalEvent({
          idPlugin,
          event: {
            action: 'requested',
            actionSubject: 'requestTokenPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        if (!key) {
          throw t.NotHandled('Missing API key');
        }
        if (!name) {
          throw t.NotHandled('Missing app name');
        }
        if (!scope) {
          throw t.NotHandled('Missing scope');
        }
        return new Promise(function (resolve, reject) {
          const handlePost = function (data) {
            const token = /<pre>\s*([0-9a-f]+)\s*<\/pre>/.exec(data);
            if (!token) {
              return reject(t.NotHandled('Failed to fetch token'));
            }
            return resolve(token[1]);
          };
          const handleGet = function (data) {
            const requestKey = /input type="hidden" name="requestKey" value="([0-9a-f]+)"/.exec(
              data,
            );
            const signature = /input type="hidden" name="signature" value="([0-9a-f/]+)"/.exec(
              data,
            );
            if (!requestKey || !signature) {
              return reject(t.NotHandled('Unable to get required parameters'));
            }
            return $.post(
              '/1/token/approve',
              {
                approve: 'Allow',
                requestKey: requestKey[1],
                signature: signature[1],
              },
              handlePost,
            ).fail((err) =>
              reject(
                t.NotHandled(
                  (err && err.responseText) || 'Failed to fetch token',
                ),
              ),
            );
          };
          return $.get(
            `/1/authorize?expiration=never&response_type=token&name=${encodeURIComponent(
              name,
            )}&scope=${encodeURIComponent(scope)}&key=${encodeURIComponent(
              key,
            )}`,
            handleGet,
          ).fail((err) =>
            reject(
              t.NotHandled(
                (err && err.responseText) ||
                  'Unable to get required parameters',
              ),
            ),
          );
        });
      },
      'track-event'(t, opts) {
        const { event } = getArgs(t, opts, {}, true);
        if (!_.isObject(event) || _.isArray(event)) {
          throw t.NotHandled('Invalid event');
        }
        //Snowplow tracking removed needs migration to GAS but GAS requires registration
        sendPluginOperationalEvent({
          idPlugin,
          event: {
            action: 'requested',
            actionSubject: 'trackEventPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
      },
    });
  }

  return mapHandlers(handlers);
};

const iframeFromHost = function (t) {
  const allIframes = document.querySelectorAll('iframe.plugin-iframe');
  return _.find(allIframes, (iframe) => iframe.contentWindow === t.source);
};
