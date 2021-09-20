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
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const Browser = require('@trello/browser');
const CardLabelSelectView = require('app/scripts/views/label/card-label-select-view');
const CardMemberSelectView = require('app/scripts/views/card/card-member-select-view');
const CardViewHelpers = require('app/scripts/views/card/card-view-helpers');
const CardViewMixins = require('./card-view-mixins');
const { Controller } = require('app/scripts/controller');
const DatePickerView = require('app/scripts/views/card/date-picker-view');
const { Dates } = require('app/scripts/lib/dates');
require('app/scripts/views/internal/data-transfer/drag-drop-events');
const DragSort = require('app/scripts/views/lib/drag-sort');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const { forTemplate } = require('@trello/i18n');
const { seesVersionedVariation } = require('@trello/feature-flag-client');
const LabelKeyHelper = require('app/scripts/views/label/label-key-helper');
const {
  LazyDateRangePicker,
} = require('app/src/components/DateRangePicker/LazyDateRangePicker');
const PasteInput = require('app/scripts/views/internal/paste-input');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const { repeatAction } = require('app/scripts/lib/last-action');
const Queue = require('promise-queue');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const {
  Analytics,
  Apdex,
  tracingCallback,
} = require('@trello/atlassian-analytics');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const cardTemplate = require('app/scripts/views/templates/card_in_list');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { renderName, openQuickCardEditor } = require('./card-view-name-edit');
const { showCover } = require('./card-view-cover');
const {
  labelClick,
  labelMouseEnter,
  labelMouseLeave,
} = require('./card-view-label');
const {
  dragenter,
  dragleave,
  dropFiles,
  dropUrl,
} = require('./card-view-attachment');
const { moveTo, moveIn } = require('./card-view-lists');
let { isOnBoardTemplate } = require('./card-view-templates');
const {
  addNewStickerToList,
  showStickers,
  renderStickers,
  renderCustomFieldItems,
  renderPluginBadges,
  renderPowerUpEffects,
  moveToCalendarDay,
  moveInCalendarDay,
  renderDueComplete,
} = require('./card-view-plugins');
const { featureFlagClient } = require('@trello/feature-flag-client');

const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { BoardCard } = require('app/src/components/CardFronts/BoardCard');
const { MirrorCard } = require('app/src/components/CardFronts/MirrorCard');
const {
  SeparatorCard,
} = require('app/src/components/CardFronts/SeparatorCard');
const { LinkCard } = require('app/src/components/CardFronts/LinkCard');

const HOOK_DROPPABLE_QUEUE = new Queue(1);
const enqueueDroppable = function (cardView) {
  HOOK_DROPPABLE_QUEUE.add(
    () =>
      new Promise(function (resolve) {
        cardView.hookDroppable();
        _.defer(resolve);
      }),
  );
};

const format = forTemplate('due_date_picker');

const INVALID_SHORTCUTS_FOR_CARDS_WITH_ROLE = [
  'l',
  '-',
  'd',
  'a',
  'm',
  'v',
  's',
  ' ',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

class CardView extends View {
  static initClass() {
    _.extend(this.prototype, CardViewHelpers, CardViewMixins);
    this.prototype.tagName = function () {
      const cardRole = this.model.getCardRole();
      return cardRole && cardRole !== 'mirror' ? 'div' : 'a';
    };

    this.prototype.filterDeactivated = true;
    this.prototype.applyBoardCardFilter = true;
    this.prototype.trackApdex = true;

    this.prototype.events = {
      moveto: 'moveTo',
      movein: 'moveIn',

      moveToCalendarDay: 'moveToCalendarDay',
      moveInCalendarDay: 'moveInCalendarDay',

      'click .js-open-quick-card-editor': 'openQuickCardEditor',
      'click .js-member-on-card-menu': 'openMemberOnCardMenu',
      'click .card-label.mod-card-front': 'labelClick',
      'click .js-due-date-badge': 'toggleDueDateComplete',
      click: 'handleClick',

      contextmenu(e) {
        // If they've got a modifier key pressed, maybe they're trying to get at the
        // system version of the context menu.  Also let developers opt out of it
        // completely with a localStorage key
        if (
          e.ctrlKey ||
          e.metaKey ||
          e.shiftKey ||
          TrelloStorage.get('nocontext')
        ) {
          return;
        }

        return this.openQuickCardEditor(e);
      },

      mouseenter() {
        return this.trigger('mouseEnterCardView');
      },
      mousemove() {
        return this.trigger('mouseMoveCardView');
      },
      mouseleave() {
        return this.trigger('mouseLeaveCardView');
      },

      'mouseenter .card-label.mod-card-front': 'labelMouseEnter',
      'mouseleave .card-label.mod-card-front': 'labelMouseLeave',

      'dd-enter:files': 'dragenter',
      'dd-leave:files': 'dragleave',
      'dd-drop:files': 'dropFiles',
      'dd-enter:url': 'dragenter',
      'dd-leave:url': 'dragleave',
      'dd-drop:url': 'dropUrl',

      'pasteinput:files': 'dropFiles',
      'pasteinput:url': 'dropUrl',
    };

    this.prototype.isOnBoardTemplate = isOnBoardTemplate;

    this.prototype.addNewStickerToList = addNewStickerToList;

    this.prototype.showStickers = showStickers;

    this.prototype.renderStickers = renderStickers;

    this.prototype.renderName = renderName;

    this.prototype.renderCustomFieldItems = renderCustomFieldItems;

    this.prototype.renderPluginBadges = renderPluginBadges;

    this.prototype.showCover = showCover;

    this.prototype.renderDueComplete = renderDueComplete;

    this.prototype.renderPowerUpEffects = renderPowerUpEffects;

    this.prototype.openQuickCardEditor = openQuickCardEditor;

    this.prototype.labelClick = labelClick;

    this.prototype.labelMouseEnter = labelMouseEnter;

    this.prototype.labelMouseLeave = labelMouseLeave;

    this.prototype.moveToCalendarDay = moveToCalendarDay;

    this.prototype.moveInCalendarDay = moveInCalendarDay;

    this.prototype.moveTo = moveTo;

    this.prototype.moveIn = moveIn;

    this.prototype.dragenter = dragenter;

    this.prototype.dragleave = dragleave;

    this.prototype.dropFiles = dropFiles;

    this.prototype.dropUrl = dropUrl;
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);

    // This prevents users from holding shortcuts and spamming the API and tracking
    const keypressThrottleWaitMs = 500;
    this.throttledJoin = this.throttle(this.onJoin, keypressThrottleWaitMs);
    this.throttledClose = this.throttle(this.onClose, keypressThrottleWaitMs);
    this.throttledMoveToNextList = this.throttle(
      this.onMoveToNextList,
      keypressThrottleWaitMs,
    );
    this.throttledMoveToPrevList = this.throttle(
      this.onMoveToPrevList,
      keypressThrottleWaitMs,
    );
    this.throttledSubscribe = this.throttle(
      this.onSubscribe,
      keypressThrottleWaitMs,
    );
  }

  className() {
    const baseClassName = 'list-card js-member-droppable';

    if (
      __guard__(this.model.getBoard(), (x) => x.getPref('cardCovers')) &&
      this.model.get('cover') != null
    ) {
      const {
        size,
        brightness,
        color,
        idAttachment,
        idUploadedBackground,
        idPlugin,
      } = this.model.get('cover');
      if (
        (idAttachment || idUploadedBackground || color || idPlugin) &&
        size === 'full' &&
        this.shouldRenderFullCover()
      ) {
        const brightnessDarkClass =
          brightness === 'dark' ? 'full-cover-list-card-dark' : '';
        const colorCoverClass = color
          ? `color-card-cover color-card-cover-${color}`
          : '';
        return `${baseClassName} full-cover-list-card ${brightnessDarkClass} ${colorCoverClass}`;
      }
    }

    return baseClassName;
  }

  attributes() {
    if (
      __guard__(this.model.getBoard(), (x) => x.getPref('cardCovers')) &&
      this.model.get('cover') != null
    ) {
      const {
        size,
        idAttachment,
        idUploadedBackground,
        color,
        idPlugin,
      } = this.model.get('cover');

      if (
        (idAttachment || idUploadedBackground || color || idPlugin) &&
        size === 'full' &&
        this.shouldRenderFullCover()
      ) {
        const style = this.getFullCoverStylesForInitialRender();
        if (style != null) {
          return { style };
        }
      }
    }

    return {};
  }

  initialize() {
    for (const opt of [
      'filterDeactivated',
      'applyBoardCardFilter',
      'trackApdex',
    ]) {
      if (this.options[opt] != null) {
        this[opt] = this.options[opt];
      }
    }

    this.whenIdle(`initialize_cardview_${this.cid}`, () => {
      // Since PostRender runs this on the browser's next idle period, assume
      // this wasn't run immediately and we missed some socket updates, so
      // re-render to catch up.
      this.render();

      this.makeDebouncedMethods(
        'render',
        'renderName',
        'renderLabels',
        'renderCover',
        'renderFiltered',
        'renderPowerUpEffects',
        'renderStickers',
        'renderBadges',
        'renderDueComplete',
        'renderCustomFieldItems',
        'updateDateBadges',
        'updateBadges',
      );

      this.listenTo(this.model, {
        'change:cardRole': this.render,
        'change:id': this.render,
        'change:name': () => {
          if (this.model.get('cardRole')) {
            this.render();
          } else {
            this.renderNameDebounced();
          }
        },
        'change:labels': this.renderLabelsDebounced,
        'change:idAttachmentCover change:cover': this.renderCoverDebounced,
        'change:name change:labels change:idLabels change:due change:start change:dueComplete': this
          .renderFilteredDebounced,
        'change:due change:start change:badges': this
          .updateRenderIntervalSubscription,
        'change:dueComplete': this.renderDueComplete,
        'change:dateLastActivity': () => {
          this.renderCoverDebounced();
          return this.renderPowerUpEffectsDebounced();
        },
        'change:due change:start change:subscribed change:isTemplate': this
          .renderBadgesDebounced,
        'change:badges': this.updateBadgesDebounced,
        keyboardMove: this.scrollIntoView,
      });

      this.listenTo(
        this.model.customFieldItemList,
        'add remove reset change',
        this.frameDebounce(function () {
          this.renderCustomFieldItems();
          return this.renderFiltered();
        }),
      );

      this.listenTo(
        this.modelCache,
        'add:Notification remove:Notification change:Notification',
        this.renderBadgesDebounced,
      );

      this.listenTo(
        this.model.memberList,
        'change:initials change:avatarUrl change:avatarSource change:fullName change:username',
        this.renderMembers,
      );

      // Don't attach two listeners to the same event! Single listener, 2 function calls
      this.listenTo(
        this.model.memberList,
        'add remove reset',
        this.frameDebounce(function () {
          this.renderMembers();
          return this.renderFiltered();
        }),
      );

      this.listenTo(
        this.model.labelList,
        'add remove reset change',
        this.renderLabelsDebounced,
      );

      this.listenTo(this.model.stickerList, {
        'add remove reset change sort': this.renderStickersDebounced,
      });

      const board = this.model.getBoard();
      this.listenTo(
        board,
        'change:powerUps change:prefs.cardAging',
        this.renderPowerUpEffectsDebounced,
      );
      this.subscribe(pluginsChangedSignal(board, this.model), () => {
        this.renderCoverDebounced();
        return this.renderPowerUpEffectsDebounced();
      });
      this.listenTo(board.filter, 'change', this.renderFilteredDebounced);
      this.listenTo(board, 'change:labels', this.renderLabelsDebounced);
      // Possible for a user to become deactivated
      this.listenTo(board, 'change:memberships', this.renderMembers);
      this.listenTo(
        board,
        'change:prefs.hideVotes',
        this.renderBadgesDebounced,
      );
      this.listenTo(board, 'change:prefs.cardCovers', () => {
        this.renderCoverDebounced();

        if (
          this.model.get('cardRole') === 'link' &&
          featureFlagClient.get('wildcard.link-cards', false)
        ) {
          this.render();
        }
      });

      this.listenTo(
        board.customFieldList,
        'add remove reset change',
        this.renderCustomFieldItemsDebounced,
      );

      this.listenTo(board.boardPluginList, 'add remove reset change', () => {
        this.renderCustomFieldItemsDebounced();
        return this.renderBadgesDebounced();
      });

      this.listenTo(
        board.viewState,
        'active-card-changed',
        this.renderActiveState,
      );

      this.listenTo(board, 'permChange', this.render);

      // This is just here in case you're dragging a member somewhere before
      // we've managed to hook droppable. It won't work all the time; it's
      // just another cheap chance for us to get it right.
      this.listenTo(this, 'mouseEnterCardView', function () {
        return enqueueDroppable(this);
      });

      return this.updateRenderIntervalSubscription();
    });
  }

  shouldRenderFullCover() {
    return true;
  }

  renderActiveState() {
    // Don't ask me. This was here before. Should never happen, but who knows?
    if (this.$el == null) {
      return;
    }

    const isActive = __guard__(this.model.getBoard(), (x) =>
      x.viewState.isCardSelected(this.model),
    );
    this.$el.toggleClass('active-card', isActive);

    if (isActive) {
      PasteInput.addHandler(this, { scope: 'card' });
      registerShortcutHandler(this.onShortcut, { scope: Scope.Card });
    } else {
      PasteInput.removeHandler(this);
      unregisterShortcutHandler(this.onShortcut, { scope: Scope.Card });
    }
  }

  remove() {
    unregisterShortcutHandler(this.onShortcut);
    return super.remove(...arguments);
  }

  onClose(event, sendShortcutEvent, editable) {
    if (editable) {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/closed',
        source: 'cardView',
      });

      this.model.close(traceId, (err, card) => {
        if (err) {
          throw Analytics.taskFailed({
            taskName: 'edit-card/closed',
            traceId,
            source: 'cardView',
            error: err,
          });
        } else {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'closed',
            source: 'cardView',
            containers: {
              card: { id: card.id },
              board: { id: card.idBoard },
              list: { id: card.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });
          Analytics.taskSucceeded({
            taskName: 'edit-card/closed',
            traceId,
            source: 'cardView',
          });
        }
      });

      event.preventDefault();
      sendShortcutEvent('archiveCardShortcut');
    }
  }

  onMoveToNextList(event, key, sendShortcutEvent, editable, onCalendar) {
    if (editable && !onCalendar) {
      this.model.moveToNextList(key === Key.AngleRight ? 'top' : 'bottom');
      event.preventDefault();
      sendShortcutEvent('moveToNextListShortcut');
    }
  }

  onMoveToPrevList(event, key, sendShortcutEvent, editable, onCalendar) {
    if (editable && !onCalendar) {
      this.model.moveToPrevList(key === Key.AngleLeft ? 'top' : 'bottom');
      event.preventDefault();
      sendShortcutEvent('moveToPreviousListShortcut');
    }
  }

  handleClick(e) {
    const cardRole = this.model.getCardRole();

    if (!cardRole) {
      this.showDetail(e);
    }
  }

  onSubscribe(event, sendShortcutEvent, loggedIn) {
    if (loggedIn && !this.isOnBoardTemplate()) {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/subscribed',
        source: 'cardView',
      });
      const subscribed = this.model.get('subscribed');
      this.model.subscribeWithTracing(
        !subscribed,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/subscribed',
            source: 'cardView',
            traceId,
          },
          (_err, response) => {
            if (response) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'subscribed',
                source: 'cardView',
                containers: {
                  card: { id: response.id },
                  board: { id: response.idBoard },
                  list: { id: response.idList },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
      event.preventDefault();
      sendShortcutEvent('subscribeShortcut', {
        toggleValue: subscribed ? 'unsubscribe' : 'subscribe',
      });
    }
  }

  onJoin(event, sendShortcutEvent, editable) {
    const board = this.model.getBoard();
    isOnBoardTemplate = this.isOnBoardTemplate();
    if (
      editable &&
      !isOnBoardTemplate &&
      (board.hasActiveMembership(Auth.me()) ||
        board.isEditableByTeamMemberAndIsNotABoardMember())
    ) {
      if (board.isEditableByTeamMemberAndIsNotABoardMember()) {
        board.optimisticJoinBoard();
      }
      const source = 'cardView';
      const traceId = Analytics.startTask({
        taskName: 'edit-card/idMembers',
        source,
      });

      this.model.toggleMemberWithTracing(
        Auth.myId(),
        { traceId },
        tracingCallback(
          {
            taskName: 'edit-card/idMembers',
            traceId,
            source,
          },
          (_err, res) => {
            if (res) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idMembers',
                source,
                containers: {
                  card: { id: this.model.id },
                  board: { id: this.model.get('idBoard') },
                  list: { id: this.model.get('idList') },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
    }

    event.preventDefault();
    sendShortcutEvent('assignSelfShortcut', {
      shortcutKey: 'Space',
      toggleValue: this.model.hasMember(Auth.myId()) ? 'add' : 'remove',
    });
  }

  onShortcut(event) {
    if (Controller.showingBoardOverlay()) {
      return;
    }

    const loggedIn = Auth.isLoggedIn();
    const editable = this.model.editable();
    const isTemplate = !!this.model.get('isTemplate');
    const { onCalendar } = this;
    const key = getKey(event);

    if (
      this.model.getCardRole() &&
      INVALID_SHORTCUTS_FOR_CARDS_WITH_ROLE.includes(key)
    ) {
      return;
    }

    const sendShortcutEvent = (
      shortcutName,
      { shortcutKey = key, toggleValue } = {},
    ) => {
      Analytics.sendPressedShortcutEvent({
        shortcutName,
        source: 'cardView',
        keyValue: shortcutKey,
        containers: this.model.getAnalyticsContainers(),
        attributes: {
          toggleValue:
            toggleValue !== undefined ? toggleValue.toLowerCase() : undefined,
        },
      });
    };

    switch (key) {
      case Key.Enter:
        this.showDetail();
        event.preventDefault();
        sendShortcutEvent('openCardShortcut');
        return;

      case Key.e:
        this.openQuickCardEditor();
        event.preventDefault();
        sendShortcutEvent('quickCardEditorShortcut');
        return;

      case Key.t:
        Controller.showCardDetail(this.model, {
          runMethod: 'editTitle',
          method: 'via the T shortcut from card front',
        });
        event.preventDefault();
        sendShortcutEvent('openCardAndEditTitleShortcut');
        return;

      case Key.Dash:
        Controller.showCardDetail(this.model, {
          runMethod: 'onChecklistShortcut',
          method: 'via the dash shortcut from card front',
        });
        event.preventDefault();
        sendShortcutEvent('addChecklistShortcut');
        return;

      case Key.d:
        if (editable && !isTemplate) {
          const seeDateRangePicker = seesVersionedVariation(
            'ecosystem.timeline-version',
            'stable',
          );
          if (seeDateRangePicker) {
            this.showDateRangePicker();
          } else {
            this.showPopOver(DatePickerView, {
              trackingCategory: 'keyboard shortcut',
            });
          }
          event.preventDefault();
          sendShortcutEvent('dueDatesShortcut');
        }
        return;

      case Key.l:
        if (editable) {
          this.showPopOver(CardLabelSelectView, { hideOnSelect: false });
          event.preventDefault();
          sendShortcutEvent('editLabelsShortcut');
        }
        return;

      case Key.Zero:
      case Key.One:
      case Key.Two:
      case Key.Three:
      case Key.Four:
      case Key.Five:
      case Key.Six:
      case Key.Seven:
      case Key.Eight:
      case Key.Nine: {
        if (editable) {
          let hasUniqueLabel = true;
          const fxNoUniqueLabel = (color) => {
            hasUniqueLabel = false;
            return this.showPopOver(CardLabelSelectView, {
              searchInit: color,
              hideOnSelect: true,
            });
          };
          LabelKeyHelper.setLabelFromKey(key, this.model, fxNoUniqueLabel);
          event.preventDefault();

          let toggleValue = 'showLabelsPopover';
          if (hasUniqueLabel) {
            const color = LabelKeyHelper.colorForKey(key);
            toggleValue = this.model.hasLabel(color) ? 'add' : 'remove';
          }
          sendShortcutEvent('toggleLabelShortcut', { toggleValue });
        }
        return;
      }

      case Key.a:
      case Key.m:
        if (editable && !this.isOnBoardTemplate()) {
          this.showPopOver(CardMemberSelectView);
          event.preventDefault();
          sendShortcutEvent('assignMembersShortcut');
        }
        return;

      case Key.Space:
        this.throttledJoin(event, sendShortcutEvent, editable);
        return;

      case Key.c:
        this.throttledClose(event, sendShortcutEvent, editable);
        return;

      case Key.AngleRight:
      case Key.Period:
        this.throttledMoveToNextList(
          event,
          key,
          sendShortcutEvent,
          editable,
          onCalendar,
        );
        return;

      case Key.AngleLeft:
      case Key.Comma:
        this.throttledMoveToPrevList(
          event,
          key,
          sendShortcutEvent,
          editable,
          onCalendar,
        );
        return;

      case Key.v:
        if (
          loggedIn &&
          !isTemplate &&
          this.model.getBoard().canVote(Auth.me())
        ) {
          this.model.toggleVote();
          event.preventDefault();
          sendShortcutEvent('voteShortcut', {
            toggleValue: this.model.voted() ? 'vote' : 'unvote',
          });
        }
        return;

      case Key.s:
        this.throttledSubscribe(event, sendShortcutEvent, loggedIn);
        return;

      case Key.r:
        if (editable) {
          event.preventDefault();
          return this.waitForId(this.model, () => {
            repeatAction({
              source: 'cardView',
              idBoard: this.model.getBoard().id,
              idCard: this.model.id,
            });
            sendShortcutEvent('repeatActionShortcut');
          });
        }
        return;

      default:
        return;
    }
  }

  showPopOver(viewClass, options) {
    if (options == null) {
      options = {};
    }
    return PopOver.toggle({
      elem: this.$('.js-card-menu'),
      view: viewClass,
      options: _.extend(
        {
          model: this.model,
          modelCache: this.modelCache,
          hideOnSelect: true,
        },
        options,
      ),
    });
  }

  // Use this to pop open the date range picker from outside the context
  // of clicking a button. E.g. keyboard shortcut.
  showDateRangePicker = function () {
    const elem = this.$('.js-card-menu');
    if (elem) {
      return PopOver.toggle({
        elem,
        getViewTitle: () => format('dates'),
        keepEdits: true,
        reactElement: React.createElement(LazyDateRangePicker, {
          due: this.model.get('due'),
          start: this.model.get('start'),
          dueReminder: this.model.get('dueReminder'),
          hidePopover: () => PopOver.hide(),
          idCard: this.model.id,
          idBoard: this.model.getBoard()?.id,
          idOrg: this.model.getBoard()?.get('idOrganization'),
        }),
      });
    }
  };

  render() {
    const data = this.model.toJSON();

    const cardRole = this.model.getCardRole();

    if (cardRole === 'separator') {
      this.unmountReactCard = renderComponent(
        React.createElement(SeparatorCard, {
          openEditor: (e) => {
            e.preventDefault();
            this.openQuickCardEditor();
          },
          isEditable: this.model.editable(),
          analyticsContainers: this.model.getAnalyticsContainers(),
        }),
        this.el,
      );
    } else if (cardRole === 'mirror') {
      this.unmountReactCard = renderComponent(
        React.createElement(MirrorCard, {
          openEditor: (e) => {
            e.preventDefault();
            this.openQuickCardEditor();
          },
          cardUrl: data.name,
          mirrorCardUrl: data.url,
          isEditable: this.model.editable() && !this.model.get('closed'),
          isClosed: this.model.get('closed'),
          analyticsContainers: this.model.getAnalyticsContainers(),
        }),
        this.el,
      );
    } else if (cardRole === 'board') {
      this.unmountReactCard = renderComponent(
        React.createElement(BoardCard, {
          openEditor: (e) => {
            e.preventDefault();
            this.openQuickCardEditor();
          },
          boardUrl: data.name,
          isEditable: this.model.editable() && !this.model.get('closed'),
          isClosed: this.model.get('closed'),
          analyticsContainers: this.model.getAnalyticsContainers(),
        }),
        this.el,
      );
    } else if (
      cardRole === 'link' &&
      /^https?:\/\/\S+$/.test(this.model.get('name'))
    ) {
      const cardCoversPrefs = this.model.getBoard()?.getPref('cardCovers');

      this.unmountReactCard = renderComponent(
        React.createElement(LinkCard, {
          openEditor: (e) => {
            e.preventDefault();
            this.openQuickCardEditor();
          },
          url: data.name,
          hideCover: !cardCoversPrefs,
          isEditable: this.model.editable() && !this.options.quickEditHidden,
          analyticsContainers: this.model.getAnalyticsContainers(),
        }),
        this.el,
      );
    } else {
      if (this.unmountReactCard) {
        this.unmountReactCard();
      }

      data.showCover = this.showCover();
      data.showEditor = this.model.editable() && !this.options.hideMenu;

      if (this.model.hasStickers()) {
        data.hasStickers = true;
      }

      // render this stuff upfront so we don't have to thrash the layout again.
      data.labels = this.labelsData();

      const board = this.model.getBoard();

      data.members = [];
      for (let i = this.model.memberList.models.length - 1; i >= 0; i--) {
        const member = this.model.memberList.models[i];
        const memberData = member.toJSON();
        memberData.isVirtual =
          __guard__(board.getOrganization(), (x) => x.isVirtual(member)) ||
          board.isVirtual(member);
        memberData.isDeactivated = board.isDeactivated(member);

        data.members.push(memberData);
      }

      // Needed to pre-render covers to reduce flickering when the card is moved around.
      data.cover = this.model.get('cover');
      if (this.model.get('idAttachmentCover')) {
        data.attachmentCoverUrl = __guard__(
          this.model.attachmentList.get(this.model.get('idAttachmentCover')),
          (x1) => x1.get('url'),
        );
      }
      data.hideCover =
        !this.model.getBoard().getPref('cardCovers') || this.onCalendar;
      data.hasCover = this.model.hasCover();

      // add classes before adding to the DOM to prevent layout thrashing.
      this.$el.toggleClass('js-archive-card', this.model.get('closed'));

      if (this.showCover() && this.model.hasCover()) {
        this.$el.addClass('is-covered');
      }

      if (this.model.hasStickers()) {
        this.$el.addClass('is-stickered');
      }

      this.$el.html(cardTemplate(data));
      this.renderName();
      this.renderBadges();
      this.renderCustomFieldItems();
      this.renderDueComplete();
      this.whenIdle(`render_${this.cid}`, () => {
        // make sure cards stay active when re-rendered
        this.renderPluginBadges();
        this.renderActiveState();
        this.renderCover();
        this.renderStickers();
        this.renderPowerUpEffects();
        this.waitForId(this.model, () => this.renderLink());
        // Hooking droppable is expensive. Use a worker queue.
        this._droppableHookedSinceRender = false;
        return enqueueDroppable(this);
      });
    }

    this.renderFiltered();

    return this;
  }

  // Hook a jquery.ui.droppable for dropping members from the sidebar
  // This is inordinately expensive to run, because of the width and height
  // calculations done in 'droppable', see the HOOK_DROPPABLE_QUEUE above
  hookDroppable() {
    if (Browser.isTouch()) {
      return;
    }
    // It's possible that we've been removed from the DOM/destroyed
    // If that's the case, then just abort
    if (this.$el == null) {
      return;
    }

    // We're using an event handler AND a queue, so only hook once per render
    if (this._droppableHookedSinceRender) {
      return;
    }

    this._droppableHookedSinceRender = true;

    if (!Browser.isTouch()) {
      const getFrame = this.throttle(
        () => $('.board-canvas')[0].getBoundingClientRect(),
        100,
        { trailing: false },
      );
      this.$el.droppable({
        refreshPositions: true,
        inBounds(e) {
          // This is used to make sure we don't drop onto cards through the
          // sidebar. We have to recalculate this in case the user toggles
          // the sidebar with the keyboard shortcut.
          const frame = getFrame();
          return (
            frame.left <= e.pageX &&
            e.pageX < frame.right &&
            frame.top <= e.pageY &&
            e.pageY < frame.bottom
          );
        },
        accept: (el) => {
          if (el.is('.js-list-draggable-board-members .member')) {
            return true;
          }
          if (el.is('.js-draggable-sticker') && !this.model.getCardRole()) {
            return !__guardMethod__(this.model, 'isOverLimit', (o) =>
              o.isOverLimit('stickers', 'perCard'),
            );
          }
          return false;
        },
        hoverClass: 'active-card',
        drop: (e, ui) => {
          if (ui.draggable.hasClass('member')) {
            const dragged_mem_id = ui.draggable.data('id');
            const fInclude = this.model.memberList.detect(
              (member) => member.id === dragged_mem_id,
            );

            if (!fInclude) {
              const source = 'cardView';
              const traceId = Analytics.startTask({
                taskName: 'edit-card/idMembers',
                source,
              });

              this.model.addMemberWithTracing(
                dragged_mem_id,
                traceId,
                tracingCallback(
                  {
                    taskName: 'edit-card/idMembers',
                    traceId,
                    source,
                  },
                  (_err, res) => {
                    if (res) {
                      Analytics.sendUpdatedCardFieldEvent({
                        field: 'idMembers',
                        source,
                        containers: {
                          card: { id: this.model.id },
                          board: { id: this.model.get('idBoard') },
                          list: { id: this.model.get('idList') },
                        },
                        attributes: {
                          taskId: traceId,
                        },
                      });
                    }
                  },
                ),
              );
            }
          } else if (ui.draggable.hasClass('js-draggable-sticker')) {
            let borderLeftWidth, borderRightWidth, rotate, top;
            const sticker = ui.draggable.data('sticker');

            const borderTopWidth = (borderLeftWidth = borderRightWidth = 1);

            // Figure out where the sticker area would be, if the card had a
            // sticker area
            const stickerOffset = ui.helper.offset();
            const targetOffset = {
              top: this.$el.offset().top + borderTopWidth,
              left: this.$el.offset().left + borderLeftWidth,
            };

            const targetWidth =
              this.$el.outerWidth() - borderLeftWidth - borderRightWidth;

            const offsetLeft = stickerOffset.left - targetOffset.left;
            const offsetTop = stickerOffset.top - targetOffset.top;

            const left = (offsetLeft / targetWidth) * 100;
            const stickerAreaHeight = this.$('.js-card-stickers').height();

            if (
              this.$el.hasClass('is-stickered') ||
              this.$el.hasClass('is-covered')
            ) {
              top = (offsetTop / stickerAreaHeight) * 100;
            } else {
              // This card doesn't have anything on it yet; it's unlikely that
              // you're trying to place it at an exact vertical position, and
              // putting it right where you drop it will put part of the sticker
              // off of the card
              top = 0;
            }

            // if the user tries to put the sticker below the valid area, move
            // it as far down as possible
            if (top > stickerAreaHeight) {
              top = stickerAreaHeight;
            }

            const transformMatrix = Util.getElemTransformMatrix(
              ui.helper.find('.sticker-select-fixed'),
            );
            if (transformMatrix != null) {
              rotate = Util.getMatrixDegrees(transformMatrix) % 360;
            } else {
              rotate = 0;
            }

            this.addNewStickerToList(sticker, left, top, rotate);
          }
        },
      });
    }
  }

  renderLink() {
    const cardRole = this.model.getCardRole();
    if (cardRole && cardRole !== 'mirror') return;

    const url = Controller.getCardUrl(this.model);

    this.$el.attr('href', url);

    return this;
  }

  renderFiltered(e) {
    if (this.options.dontFilter != null) {
      return;
    }

    if (this._visible == null) {
      this._visible = true;
    }
    const board = this.model.getBoard();
    // You can see the card if you aren't looking at it's board, or it matches
    // the filter of the board you're looking at
    const visible =
      board == null ||
      !currentModelManager.onBoardView(board.id) ||
      !this.applyBoardCardFilter ||
      board.filter.satisfiesFilter(this.model);
    if (this._visible !== visible) {
      // We set the height in order to help out dragsort.
      // http://stackoverflow.com/questions/9440664
      this.$el.toggleClass('hide', !visible).height(visible ? '' : 0);
      this._visible = visible;
    }
    return this;
  }

  showDetail(e) {
    if (e && (e.ctrlKey || e.metaKey || e.shiftKey)) {
      return;
    }

    // Stop the event so we don't end up running the click handler for the URL
    // as well.
    // This must run first if this event fires with no modifier keys.
    // otherwise it exposes a firefox bug where dropping the card
    // can cause the card detail to open
    Util.stop(e);

    // We don't want to open the card detail if we're in the middle of
    // dragging a card around; the "click" is probably the member dropping
    // the card
    if (DragSort.sorting) {
      return;
    }

    const tracingAttributes = {
      taskName: 'view-card',
      source: 'boardScreen',
    };

    const traceId = Analytics.startTask(tracingAttributes);

    const onSuccess = () => {
      Analytics.taskSucceeded({
        ...tracingAttributes,
        traceId,
      });
    };

    const onFail = (error) => {
      Analytics.taskFailed({
        ...tracingAttributes,
        traceId,
        error,
      });
    };

    const onAbort = (error) => {
      Analytics.taskAborted({
        ...tracingAttributes,
        traceId,
        error,
      });
    };

    if (this.options.trackEvent) {
      this.options.trackEvent();
    }

    if (this.trackApdex) {
      Apdex.start({
        task: 'cardFromBoard',
        taskId: this.model.id,
      });
    }

    Controller.showCardDetail(this.model, {
      runMethod: this.model.shouldSuggestDescription()
        ? 'expandDesc'
        : undefined,
      method: 'from card front',
      onSuccess,
      onFail,
      onAbort,
    });

    if (this.trackApdex) {
      return Apdex.stop({
        task: 'cardFromBoard',
        taskId: this.model.id,
      });
    }
  }

  scrollIntoView() {
    // Usually just .scrollIntoView() would do
    // but IE10 scrolls the whole thing to the left
    const board = this.$el.closest('#board');
    const list = this.$el.closest('.js-list');
    const listRect = list[0].getBoundingClientRect();
    const scrollDelta = listRect.left + listRect.width - window.innerWidth;

    this.$el.closest('.js-list-cards').scrollTop(this.$el.position().top);

    if (listRect.left < 0) {
      return board.animate({ scrollLeft: list.position().left }, 150);
    } else if (scrollDelta > 0) {
      return board.animate(
        { scrollLeft: board.scrollLeft() + scrollDelta },
        150,
      );
    }
  }

  updateRenderIntervalSubscription() {
    if (
      this.model.get('due') ||
      (this.advancedChecklistsV2Enabled &&
        __guard__(this.model.get('badges'), (x) => x.checkItemsEarliestDue))
    ) {
      this.listenTo(Dates, 'renderInterval', this.updateDateBadgesDebounced);
      return;
    }
    return this.stopListening(
      Dates,
      'renderInterval',
      this.updateDateBadgesDebounced,
    );
  }
}

CardView.initClass();
module.exports = CardView;
