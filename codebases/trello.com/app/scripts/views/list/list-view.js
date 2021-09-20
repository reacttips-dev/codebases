/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const Browser = require('@trello/browser');
const CardComposerInlineView = require('app/scripts/views/card-composer/card-composer-inline-view');
const {
  maybeDisplayLimitsErrorOnCardAdd,
  canAddCard,
} = require('app/scripts/views/card/card-limits-error');
const CardListView = require('app/scripts/views/card/card-list-view');
const { Controller } = require('app/scripts/controller');
require('app/scripts/views/internal/data-transfer/drag-drop-events');
const DragSort = require('app/scripts/views/lib/drag-sort');
const View = require('app/scripts/views/internal/view');
const ListMenuView = require('app/scripts/views/list/list-menu-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { trelloClipboard } = require('app/scripts/lib/trello-clipboard');
const { parseTrelloUrl } = require('app/scripts/lib/util/url/parse-trello-url');
const parseUrl = require('url-parse');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const Promise = require('bluebird');
const PasteInput = require('app/scripts/views/internal/paste-input');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const listTemplate = require('app/scripts/views/templates/list');
const { localizeCount } = require('app/scripts/lib/localize-count');
const warnIfFileTooLarge = require('app/scripts/views/internal/warn-if-file-too-large');
const pastedFileName = require('app/scripts/views/internal/pasted-file-name');
const { getKey, Key } = require('@trello/keybindings');
const { l } = require('app/scripts/lib/localize');
const f = require('effing');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const { removeAllRanges } = require('app/scripts/lib/util/removeAllRanges');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { idCache } = require('@trello/shortlinks');
const { ModelLoader } = require('app/scripts/db/model-loader');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  CardTemplatesButton,
} = require('app/src/components/CardTemplatesPopover');
const {
  LazyVideoRecordButton,
  isLoomIntegrationEnabled,
} = require('app/src/components/VideoRecordButton');
const {
  getSeparatorClassName,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const {
  objectResolverClient,
} = require('app/scripts/network/object-resolver-client');

class ListView extends View {
  static initClass() {
    this.prototype.className = 'js-list list-wrapper';

    this.prototype.events = {
      'mouseenter .js-open-list-menu': 'preloadMenu',
      'click .js-open-list-menu': 'openMenu',
      'mousedown .list-cards': 'eventStopPropagation',
      'click .js-open-card-composer': 'openCardComposer',

      'keydown  .js-list-name-input': 'keyDownEvent',
      'blur     .js-list-name-input': 'stopEditing',

      'click    .js-editing-target': 'startEditing',
      'focus    .js-list-name-input': 'startEditing',

      movelist: 'moveList',

      sortreceive: 'sortReceive',
      sortcommit: 'sortCommit',

      'dd-drop:files': 'dropFiles',
      'dd-drop:text': 'dropText',
      'dd-drop:url': 'dropUrl',

      mouseenter: 'mouseenter',
      mouseleave: 'mouseleave',
      mousemove: 'mousemove',
      'pasteinput:text': 'dropText',
      'pasteinput:files': 'dropFiles',
      'pasteinput:url': 'dropUrl',
    };
  }

  initialize() {
    super.initialize(...arguments);

    this.isLoomIntegrationEnabled = isLoomIntegrationEnabled(
      this.model.getBoard()?.get('idEnterprise'),
    );

    this.fEditingName = false;

    this.makeDebouncedMethods(
      'render',
      'toggleComposerLink',
      'renderComposer',
      'renderCardCount',
      'renderName',
      'renderListLimit',
    );

    if (!this.isLoomIntegrationEnabled) {
      this.makeDebouncedMethods('renderAddButton');
    }

    this.listenTo(this.model, {
      'change:limits': this.renderLimits,
      'change:name': this.renderNameDebounced,
      'change:subscribed': this.renderSubscribed,
      'change:softLimit': this.renderListLimit,
      'change:id': () => {
        this.renderCardTemplateButton();
        if (this.isLoomIntegrationEnabled) {
          this.renderCardRecordButton();
        }
      },
    });

    this.listenTo(this.model.cardList, {
      'add remove change:idList change:closed reset'() {
        this.renderCardCountDebounced();
        if (!this.isLoomIntegrationEnabled) {
          this.renderAddButtonDebounced();
        }
        return this.renderListLimitDebounced();
      },
    });

    this.listenTo(this.model.getBoard().boardPluginList, 'add remove', () => {
      return this.renderListLimitDebounced();
    });

    this.listenTo(this.model.getBoard(), 'permChange', this.renderEditable);

    this.listenTo(this.model.getBoard().composer, {
      'change:list change:index change:vis': this.renderComposerDebounced,
      'change:list change:vis'() {
        return this.toggleComposerLinkDebounced();
      },
    });

    this.listenTo(this.model.getBoard(), {
      'change:prefs.isTemplate': this.renderDebounced,
    });

    this.cardListView = this.collectionSubview(
      CardListView,
      this.model.cardList,
      {
        className: 'list-cards u-fancy-scrollbar u-clearfix js-list-cards',
        deferCards: this.options.deferCards,
      },
    );

    $(window).on(
      `resize.${this.uniqueId()}`,
      f(this, 'hackFlexboxForSadBrowsers'),
    );

    for (const eventName of [
      'mouseEnterCardView',
      'mouseLeaveCardView',
      'mouseMoveCardView',
    ]) {
      ((eventName) => {
        return this.listenTo(this.cardListView, eventName, function (cardView) {
          return this.trigger(eventName, cardView);
        });
      })(eventName);
    }
  }

  renderLimits() {
    const limited = !canAddCard({ destinationList: this.model });
    this.cardListView.$el.toggleClass('card-limits-full', limited);
    return this;
  }

  render() {
    this.cardListView.$el.detach();

    this.$el.html(
      listTemplate({
        name: this.model.get('name'),
        subscribed: this.model.get('subscribed'),
        loggedIn: Auth.isLoggedIn(),
        editable: this.model.editable(),
        isTemplate: this.model.isTemplate(),
        canRecordVideo: this.isLoomIntegrationEnabled,
      }),
    );

    this.cardListView.$el.insertAfter(this.$('.js-list-header'));
    this.cardListView.render();
    this.cardListView.$el.toggleClass('js-sortable', this.model.editable());

    this.renderLimits();

    this.renderListLimit();

    this.toggleComposerLinkDebounced();
    this.renderComposerDebounced();

    this.renderCardCount();
    this.renderEditable();

    if (!this.isLoomIntegrationEnabled) {
      this.renderAddButton();
    }
    this.renderCardTemplateButton();

    if (this.isLoomIntegrationEnabled) {
      this.renderCardRecordButton();
    }

    this.hackFlexboxForSadBrowsers();

    // The short delay causes the UI thread to complete before calling autosize.
    // We'll call autosize in react's componentDidMount when it comes to this
    // view eventually.
    _.defer(() => {
      return this.$('.js-list-name-input').autosize({ append: false });
    });

    return this;
  }

  remove() {
    $(window).off(`.${this.uniqueId()}`);
    this.removeCardTemplateButton();
    if (this.isLoomIntegrationEnabled) {
      this.removeCardRecordButton();
    }
    return super.remove(...arguments);
  }

  renderName() {
    this.$('.js-list-name-assist').text(this.model.get('name'));

    // don't update while your typing.
    if (!this.fEditingName) {
      this.$('.js-list-name-input')
        .val(this.model.get('name'))
        .trigger('autosize.resize', false);
    }

    return this;
  }

  renderSubscribed() {
    this.$('.js-list-subscribed').toggleClass(
      'hide',
      !(this.model.get('subscribed') ?? false),
    );
    this.$('.js-list-header').toggleClass(
      'is-subscribe-shown',
      this.model.get('subscribed') ?? false,
    );
    this.$('.js-list-name-input').trigger('autosize.resize', false);
    return this;
  }

  renderEditable() {
    // NOTE: The best thing to do here is probably to toggle an 'editable' or
    // 'readonly' class on the $el, and use CSS to control the visibility of
    // things.  Not making this change because a lot of the templates are being
    // re-written.
    const editable = this.model.editable();

    this.$('.js-list-cards').toggleClass('js-sortable', editable);

    if (!editable) {
      this.$('.js-list-name-input').attr('disabled', 'disabled');
    } else {
      this.$('.js-list-name-input').removeAttr('disabled');
    }

    this.$('.js-open-card-composer').toggleClass('hide', !editable);

    DragSort.refreshListCardSortable();

    return this;
  }

  hackFlexboxForSadBrowsers() {
    if (!['explorer-10', 'explorer-11'].includes(Browser.browserVersionStr)) {
      return;
    }
    this.defer(() => {
      const listHeaderHeight = this.$('.list-header').outerHeight();
      const composerHeight = this.$('.open-card-composer').outerHeight();
      const boardHeight = $('#board').height();
      const height = boardHeight - listHeaderHeight - composerHeight - 20;
      return this.$('.list-cards').css({ 'max-height': height });
    });
  }

  saveListName(e) {
    const $input = this.$('.js-list-name-input');

    const name = this.model.get('name');
    let newValue = $input.val();

    // remove new lines and extra whitespace
    newValue = newValue.replace(/\s+/g, ' ').trim();

    // if it's the same name, don't save
    if (newValue === name) {
      return;
    }

    // if it's too long, don't save
    if (newValue.length > 16384) {
      return;
    }

    // don't save if empty.
    if (newValue.trim().length === 0) {
      return;
    }

    // We should handle the returned `err` someday…
    this.model.update('name', newValue);
  }

  keyDownEvent(e) {
    if (getKey(e) === Key.Enter) {
      Util.stop(e); // prevents new lines.
      this.stopEditing();
      return;
    }

    if (getKey(e) === Key.Escape) {
      this.stopEditing();
      return;
    }
  }

  startEditing(e) {
    Util.stop(e);

    if (!this.fEditingName && this.model.editable() && !DragSort.sorting) {
      this.fEditingName = true;

      this.$('.js-editing-target').addClass('is-hidden');

      _.defer(() => {
        return this.$('.js-list-name-input')
          .focus()
          .select()
          .addClass('is-editing');
      });
    }
  }

  stopEditing(e) {
    if (this.fEditingName) {
      this.$('.js-editing-target').removeClass('is-hidden');

      const $input = this.$('.js-list-name-input').removeClass('is-editing');
      if ($input.is(':focus')) {
        $input.blur();
      }
      removeAllRanges();

      this.fEditingName = false;
      this.saveListName();
      this.renderNameDebounced();
    }
  }

  toggleComposerLink() {
    this.$('.js-open-card-composer').toggleClass(
      'hide',
      this.composerOpen() || !this.model.editable(),
    );
    return this.$('.js-card-composer-container').toggleClass(
      'hide',
      this.composerOpen() || !this.model.editable(),
    );
  }

  composerOpen() {
    const composer = this.model.getBoard()?.composer;
    return (
      composer != null &&
      composer.get('vis') &&
      composer.get('list') === this.model
    );
  }

  renderComposer() {
    if (this.composerOpen()) {
      const { composer } = this.model.getBoard();
      const composerView = Controller.getCurrentBoardView().subview(
        CardComposerInlineView,
        composer,
      );
      this.insertComposerAtIndex(composer.get('index'), composerView);
      composerView.scrollIntoView();
      _.debounce(composerView.delegateEvents(), 150);
    }

    return this;
  }

  insertComposerAtIndex(index, composerView) {
    if (index === 0) {
      this.$('.list-cards').prepend(composerView.render().el);
    } else {
      let cardIndex = index - 1;
      const $cards = this.$('.list-card').not('.js-composer');
      if (cardIndex >= $cards.length) {
        cardIndex = $cards.length - 1;
      }
      $cards.eq(cardIndex).after(composerView.render().el);
    }
  }

  renderCardCount() {
    return this.$('.js-num-cards').text(
      localizeCount('cards', this.model.openCards().length),
    );
  }

  openCardComposer(e) {
    Util.stop(e);

    PopOver.hide();

    const board = this.model.getBoard();
    const options = {
      $elem: $(e.target),
      destinationBoard: board,
      destinationList: this.model,
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    board.composer.save({
      list: this.model,
      index: this.model.openCards().length,
      vis: true,
    });

    Analytics.sendClickedButtonEvent({
      buttonName: 'addAnotherCardButton',
      source: 'listFooter',
      containers: {
        board: {
          id: board?.id,
        },
        list: {
          id: this.model?.id,
        },
        organization: {
          id: board?.getOrganization()?.id,
        },
      },
    });
  }

  triggerOnItem(e, ui, sEvent) {
    Util.stopPropagation(e);

    // Don't kick off any re-renders until sortable puts the card in the DOM
    this.defer(() => ui.item.trigger(sEvent, [ui, this]));
  }

  sortReceive(e, ui) {
    this.triggerOnItem(e, ui, 'moveto');
  }

  sortCommit(e, ui) {
    this.triggerOnItem(e, ui, 'movein');
  }

  loadPluginActions(target, timeout) {
    return PluginRunner.all({
      timeout,
      command: 'list-actions',
      el: target,
      board: this.model.getBoard(),
      list: this.model,
    })
      .catch(() => [])
      .then((pluginActions) =>
        // limit to three actions per plugin
        _.chain(pluginActions)
          .groupBy('idPlugin')
          .map((val, idPlugin) => val.slice(0, 3))
          .flatten()
          .value(),
      );
  }

  preloadMenu(e) {
    if (!DragSort.sorting && this.pluginActionsPromise == null) {
      return (this.pluginActionsPromise = this.loadPluginActions(
        e.currentTarget,
        500,
      ).then((pluginActions) => {
        this.pluginActionsPromise = null;
        this.pluginActions = pluginActions;
        this.pluginActionsExpiry = Date.now() + 5000;
        return pluginActions;
      }));
    }
  }

  openMenu(e) {
    if (!DragSort.sorting) {
      Util.preventDefault(e);

      Analytics.sendClickedButtonEvent({
        buttonName: 'listMenuButton',
        source: 'listHeader',
        containers: {
          board: {
            id: this.model?.getBoard()?.id,
          },
          list: {
            id: this.model?.id,
          },
          organization: {
            id: this.model?.getBoard()?.getOrganization()?.id,
          },
        },
      });

      let pluginActions = [];

      if (this.pluginActions != null && this.pluginActionsExpiry > Date.now()) {
        ({ pluginActions } = this);
      } else if (this.pluginActionsPromise != null) {
        pluginActions = this.pluginActionsPromise;
      } else {
        pluginActions = this.loadPluginActions(e.currentTarget, 150);
      }

      Promise.resolve(pluginActions).then((pluginActions) => {
        PopOver.toggle({
          elem: e.currentTarget,
          view: new ListMenuView({
            model: this.model,
            modelCache: this.modelCache,
            pluginActions,
          }),
        });
        return (this.pluginActions = null);
      });

      return false;
    }
  }

  moveList(e, ui) {
    Util.stop(e);
    const lists = ui.item.parent().children();
    const pos = lists.index(ui.item);
    this.model.move(pos);
  }

  eventStopPropagation(e) {
    Util.stopPropagation(e);
  }

  scrollToCard(card) {
    const cardView = this.cardListView.viewForModel(card);
    Util.scrollElementIntoView(this.$('.js-list-cards')[0], cardView.el, {
      vertical: true,
      animated: true,
    });
  }

  mouseenter(e) {
    this.trigger('mouseEnterListView');
    return PasteInput.addHandler(this, { scope: 'list' });
  }

  mouseleave(e) {
    this.trigger('mouseLeaveListView');
    return PasteInput.removeHandler(this, { scope: 'list' });
  }

  mousemove(e) {
    return this.trigger('mouseMoveListView');
  }

  dropText(e) {
    if (!this.model.editable()) {
      return;
    }

    const board = this.model.getBoard();
    const options = {
      $elem: $(e.target),
      destinationBoard: board,
      destinationList: this.model,
      hasAttachments: true,
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    const text = e.detail;

    const traceId = Analytics.startTask({
      taskName: 'create-card/paste-text',
      source: 'cardFromClipboard',
    });

    return ninvoke(this.model, 'uploadText', text, traceId)
      .then((data) => {
        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'cardFromClipboard',
          containers: {
            board: { id: this.model.getBoard().id },
            list: { id: this.model.id },
            card: { id: data.id },
          },
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-card/paste-text',
          traceId,
          source: 'cardFromClipboard',
        });
      })
      .catch((error) => {
        throw Analytics.taskFailed({
          taskName: 'create-card/paste-text',
          traceId,
          source: 'cardFromClipboard',
          error,
        });
      });
  }

  dropUrl(e) {
    if (!this.model.editable()) {
      return;
    }

    const board = this.model.getBoard();
    const options = {
      $elem: $(e.target),
      destinationBoard: board,
      destinationList: this.model,
      hasAttachments: true,
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    e.stopPropagation();
    const url = e.detail;

    if (board.attachmentUrlRestricted(url)) {
      return;
    }

    const parsedTrello = parseTrelloUrl(url);
    if (parsedTrello.type === 'card') {
      this.handlePastedCardUrl(parsedTrello.shortLink, url);
    } else {
      this.createCardFromUrl({ url });
    }
  }

  handlePastedCardUrl(shortLink, url) {
    let traceId = '';
    return Promise.try(() => {
      let left;
      const idCard =
        (left = idCache.getId('Card', shortLink)) != null ? left : shortLink;
      const card = this.modelCache.get('Card', idCard);
      if (card != null) {
        return card;
      }
      return ModelLoader.loadCardData(idCard);
    })
      .then((card) => {
        return Promise.try(() => {
          const board = card.getBoard();
          if (board?.get('memberships')?.length) {
            return board;
          }
          return ModelLoader.loadBoardMinimal(this.get('idBoard'));
        }).then((board) => {
          let me;
          const isCut = trelloClipboard.isCut(url) && board.editable();
          const isCopy = !isCut;
          const event = isCut ? 'moveCard' : 'copyCard';
          if (isCopy) {
            traceId = Analytics.startTask({
              taskName: 'create-card/paste-url',
              source: 'powerUpCardFromTrelloUrl',
            });
          }
          if (board.get('enterpriseOwned')) {
            const isGuest = board.isGuest(Auth.me());
            if (
              isGuest &&
              board.get('id') !== this.model.getBoard().get('id')
            ) {
              Alerts.show(
                [
                  'can only copy within board',
                  {
                    boardName: board.get('name'),
                  },
                ],
                'error',
                'trello-clipboard',
                5000,
              );
              if (isCopy) {
                Analytics.taskAborted({
                  taskName: 'create-card/paste-url',
                  traceId,
                  error: new Error('can only copy within board'),
                  source: 'powerUpCardFromTrelloUrl',
                });
              }
              return;
            } else if (
              board.getOrganization()?.get('idEnterprise') !==
              this.model.getBoard().getOrganization()?.get('idEnterprise')
            ) {
              Alerts.show(
                [
                  'can only copy within enterprise',
                  {
                    enterpriseName: board.getEnterprise().get('displayName'),
                  },
                ],
                'error',
                'trello-clipboard',
                5000,
              );
              if (isCopy) {
                Analytics.taskAborted({
                  taskName: 'create-card/paste-url',
                  traceId,
                  error: new Error('can only copy within enterprise'),
                  source: 'powerUpCardFromTrelloUrl',
                });
              }
              return;
            }
          }

          this.trigger(event, {
            shortLink,
            idList: this.model.id,
            traceId,
          });

          if (isCopy) {
            Analytics.sendTrackEvent({
              action: 'created',
              actionSubject: 'card',
              source: 'powerUpCardFromTrelloUrl',
              containers: {
                board: { id: this.model.getBoard().id },
                list: { id: this.model.id },
              },
              attributes: {
                taskId: traceId,
              },
            });
            Analytics.taskSucceeded({
              taskName: 'create-card/paste-url',
              traceId,
              source: 'powerUpCardFromTrelloUrl',
            });
          }

          if ((me = Auth.me())) {
            const oneTimeMessage = `pasteAlert-${event}`;
            if (!me.isDismissed(oneTimeMessage)) {
              return me.dismiss(oneTimeMessage);
            }
          }
        });
      })
      .catch((e) => {
        if (traceId) {
          Analytics.taskFailed({
            taskName: 'create-card/paste-url',
            traceId,
            source: 'powerUpCardFromTrelloUrl',
            error: e,
          });
        }
        return this.createCardFromUrl({ url });
      });
  }

  createCardFromUrl({
    url,
    analyticsTaskName = 'create-card/paste-url',
    analyticsSource = 'powerUpCardFromUrl',
  }) {
    const analyticsContainers = {
      board: { id: this.model.getBoard()?.id },
      list: { id: this.model.id },
      enterprise: {
        id: this.model.getBoard()?.get('idEnterprise'),
      },
      organization: {
        id: this.model?.getBoard()?.getOrganization()?.id,
      },
    };

    return new Promise((resolve, reject) => {
      const traceId = Analytics.startTask({
        taskName: analyticsTaskName,
        source: analyticsSource,
        containers: analyticsContainers,
      });
      let domain;
      const parsed = parseUrl(url);
      if ((domain = parsed.host) != null) {
        return PluginRunner.one({
          timeout: 2000,
          command: 'card-from-url',
          list: this.model,
          board: this.model.getBoard(),
          options: {
            url,
          },
        })
          .catch(PluginRunner.Error.NotHandled, () => ({}))
          .then(async (dataFromPlugin) => {
            const placeholder = l('loading from domain', { domain });
            const cardData = _.pick(dataFromPlugin, 'name', 'desc');

            let createCardPromise;

            if (featureFlagClient.get('wildcard.link-cards', false)) {
              // Only create a Link card here if there was no cardData provided by a plugin.
              const hasData = cardData && Object.keys(cardData).length > 0;

              if (!hasData) {
                const resolved = await objectResolverClient.resolveUrl(url);

                // We only want to create a Link card if it can be resolved with the ORS.
                if (resolved) {
                  createCardPromise = ninvoke(
                    this.model.cardList,
                    'create',
                    {
                      name: url,
                      pos: this.model.bottomCardPos(),
                    },
                    {
                      traceId,
                    },
                  );
                }
              }
            }

            if (!createCardPromise) {
              createCardPromise = ninvoke(
                this.model,
                'uploadUrl',
                url,
                cardData,
                placeholder,
                traceId,
              );
            }

            try {
              const data = await createCardPromise;
              // there might not be a idPlugin if the client
              // doesn't find a power-up match for this url
              if (
                dataFromPlugin != null ? dataFromPlugin.idPlugin : undefined
              ) {
                return sendPluginTrackEvent({
                  idPlugin: dataFromPlugin.idPlugin,
                  idBoard: this.model.getBoard().id,
                  idCard: data.id,
                  event: {
                    action: 'created',
                    actionSubject: 'card',
                    source: 'powerUpCardFromUrl',
                    attributes: {
                      taskId: traceId,
                    },
                  },
                });
              } else {
                Analytics.sendTrackEvent({
                  action: 'created',
                  actionSubject: 'card',
                  source: analyticsSource,
                  containers: {
                    ...analyticsContainers,
                    card: { id: data.id },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
              Analytics.taskSucceeded({
                taskName: analyticsTaskName,
                traceId,
                source: analyticsSource,
                containers: {
                  ...analyticsContainers,
                  card: { id: data.id },
                },
              });
            } catch (error) {
              throw Analytics.taskFailed({
                taskName: analyticsTaskName,
                traceId,
                source: analyticsSource,
                containers: analyticsContainers,
                error,
              });
            }
          })
          .done(() => resolve());
      }
      return resolve();
    });
  }

  dropFiles(e) {
    if (!this.model.editable()) {
      return;
    }

    const board = this.model.getBoard();

    if (board.attachmentTypeRestricted('computer')) {
      return;
    }

    const options = {
      $elem: $(e.target),
      destinationBoard: board,
      destinationList: this.model,
      hasAttachments: true,
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    const files = e.detail;

    if (warnIfFileTooLarge(this.model.getBoard(), files)) {
      return;
    }

    return Promise.resolve(files)
      .each((file) => {
        const name = file.name || pastedFileName();

        const traceId = Analytics.startTask({
          taskName: 'create-card/paste-file',
          source: 'cardFromClipboard',
        });

        return ninvoke(this.model, 'upload', file, name, traceId).then(
          (data) => {
            if (data) {
              Analytics.sendTrackEvent({
                action: 'created',
                actionSubject: 'card',
                source: 'cardFromClipboard',
                containers: {
                  board: { id: this.model.getBoard().id },
                  list: { id: this.model.id },
                  card: { id: data.id },
                },
                attributes: {
                  taskId: traceId,
                },
              });

              Analytics.taskSucceeded({
                taskName: 'create-card/paste-file',
                traceId,
                source: 'cardFromClipboard',
              });
            } else {
              Analytics.taskAborted({
                taskName: 'create-card/paste-file',
                traceId,
                source: 'cardFromClipboard',
              });
            }
          },
          (error) => {
            throw Analytics.taskFailed({
              taskName: 'create-card/paste-file',
              traceId,
              source: 'cardFromClipboard',
              error,
            });
          },
        );
      })
      .catch(function () {})
      .done();
  }

  // TODO: Remove this function when removing 'teamplates.web.loom-integration'
  //        feature flag
  renderAddButton() {
    const listIsEmpty = this.model.cardList.length === 0;
    this.$('.js-add-a-card').toggleClass('hide', !listIsEmpty);
    return this.$('.js-add-another-card').toggleClass('hide', listIsEmpty);
  }

  renderListLimit() {
    const $listContent = this.$('.js-list-content');
    const $listLimitBadge = this.$('.js-list-limit-badge');
    const $listHeader = this.$('.js-list-header');
    const listLimitsEnabled = this.model
      .getBoard()
      .isListLimitsPowerUpEnabled();

    if (listLimitsEnabled) {
      const softLimit = this.model.get('softLimit');

      if (softLimit != null) {
        // ignore separator cards when counting for list limits
        const cardCount = this.model.cardList.filter(
          (card) => !getSeparatorClassName(card.get('name')),
        ).length;
        const hasExceededLimit = cardCount > softLimit;

        $listLimitBadge.text(`${cardCount} / ${softLimit}`);
        $listHeader.addClass('is-list-limit-shown');
        $listLimitBadge.removeClass('hide');
        $listContent.toggleClass('exceeds-list-limit', hasExceededLimit);
        return $listLimitBadge.toggleClass('mod-warning', hasExceededLimit);
      } else {
        $listContent.removeClass('exceeds-list-limit');
        $listLimitBadge.addClass('hide');
        return $listHeader.removeClass('is-list-limit-shown');
      }
    } else {
      $listContent.removeClass('exceeds-list-limit');
      $listLimitBadge.addClass('hide');
      return $listHeader.removeClass('is-list-limit-shown');
    }
  }

  createCardFromTemplate(name, idCardSource, keepFromSourceArray) {
    if (keepFromSourceArray == null) {
      keepFromSourceArray = [];
    }
    const traceId = Analytics.startTask({
      taskName: 'create-card/template',
      source: 'createCardFromTemplateInlineDialog',
    });
    return new Promise((resolve, reject) => {
      const newCard = this.model.cardList.createWithTracing(
        {
          name,
          idCardSource,
          keepFromSource: keepFromSourceArray.join(','),
        },
        {
          traceId,
          error: (model, error) => {
            this.model.cardList.remove(newCard);
            Analytics.taskFailed({
              taskName: 'create-card/template',
              traceId,
              source: 'createCardFromTemplateInlineDialog',
              error,
            });
            return reject();
          },
          success: (card) => {
            Analytics.sendTrackEvent({
              action: 'created',
              actionSubject: 'card',
              source: 'createCardFromTemplateInlineDialog',
              attributes: {
                cardSourceId: idCardSource,
                taskId: traceId,
              },
              containers: {
                card: { id: card.id },
                board: {
                  id: this.model?.getBoard()?.id,
                },
                list: {
                  id: this.model?.id,
                },
                organization: {
                  id: this.model?.getBoard()?.getOrganization()?.id,
                },
              },
            });
            Analytics.taskSucceeded({
              taskName: 'create-card/template',
              traceId,
              source: 'createCardFromTemplateInlineDialog',
            });
            return resolve(() => this.cardListView.scrollToCardView(card));
          },
        },
      );

      const board = this.model.getBoard();
      return board.filter.addNewCard(newCard);
    });
  }

  renderCardTemplateButton() {
    if (this.model.id != null) {
      renderComponent(
        <CardTemplatesButton
          idList={this.model.id}
          idBoard={this.model.getBoard().id}
          // eslint-disable-next-line react/jsx-no-bind
          createCard={(name, idCardSource, keepFromSourceArray) => {
            return this.createCardFromTemplate(
              name,
              idCardSource,
              keepFromSourceArray,
            );
          }}
        />,
        this.$('.js-card-templates-button')[0],
      );
    }

    return this;
  }

  removeCardTemplateButton() {
    if (this.$('.js-card-templates-button').length) {
      return ReactDOM.unmountComponentAtNode(
        this.$('.js-card-templates-button')[0],
      );
    }
  }

  renderCardRecordButton() {
    if (this.model.id != null && this.$('.js-card-record-button').length) {
      renderComponent(
        <LazyVideoRecordButton
          id={`list-record-${this.model.id}`}
          // eslint-disable-next-line react/jsx-no-bind
          insert={(url) => {
            return this.createCardFromUrl({
              url,
              analyticsTaskName: 'create-card/record-video',
              analyticsSource: 'videoRecordButton',
            });
          }}
          analyticsSource="listFooter"
          analyticsContainers={{
            list: {
              id: this.model.id,
            },
            board: {
              id: this.model.getBoard()?.id,
            },
            enterprise: {
              id: this.model.getBoard()?.get('idEnterprise'),
            },
            organization: {
              id: this.model?.getBoard()?.getOrganization()?.id,
            },
          }}
          iconColor="quiet"
          showTooltip
        />,
        this.$('.js-card-record-button')[0],
      );
    }

    return this;
  }

  removeCardRecordButton() {
    if (this.$('.js-card-record-button').length) {
      return ReactDOM.unmountComponentAtNode(
        this.$('.js-card-record-button')[0],
      );
    }
  }
}

ListView.initClass();
module.exports = ListView;
