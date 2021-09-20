/* eslint-disable
    @typescript-eslint/no-this-alias,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { ApiError } = require('app/scripts/network/api-error');
const Browser = require('@trello/browser');
const ComposerLabelSelectorView = require('app/scripts/views/card-composer/composer-label-selector-view');
const ComposerMemberSelectorView = require('app/scripts/views/card-composer/composer-member-selector-view');
const ComposerPosSelectorView = require('app/scripts/views/card-composer/composer-pos-selector-view');
const ComposerSelectorMenuView = require('app/scripts/views/card-composer/composer-selector-menu-view');
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const Confirm = require('app/scripts/views/lib/confirm');
const { Controller } = require('app/scripts/controller');
const { htmlEncode } = require('app/scripts/lib/util/text/html-encode');
const { Key, getKey, isArrow } = require('@trello/keybindings');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const Queue = require('promise-queue');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const memberTemplate = require('app/scripts/views/templates/member');
const {
  trackSeparator,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const {
  objectResolverClient,
} = require('app/scripts/network/object-resolver-client');

const CardComposerError = makeErrorEnum('CardComposer', ['TooManyCards']);

const MAX_PARALLEL_CARD_CREATION = 5;
const MAX_CARD_TITLE_LENGTH = 16384;

class CardComposerInlineView extends View {
  className() {
    return 'card-composer';
  }

  events() {
    return {
      'click .js-add-card': 'submitCard',
      'click .js-cancel': 'clearAndHide',
      'click .js-cc-menu': 'openMenu',

      keyup: 'keyupEvent',
      paste: 'pasteEvent',
      keydown: 'keydownEvent',
    };
  }

  initialize() {
    this.makeDebouncedMethods('render');

    this.listenTo(
      this.model,
      'change:idLabels change:idMembers',
      this.renderSelectedItems,
    );
    this.listenTo(this.model, 'change:vis', this.autosaveCard);
    this.listenTo(
      this.model.labelList,
      'add remove reset change',
      this.frameDebounce(this.renderSelectedItems),
    );

    this._cardCreationApiQueue = new Queue(MAX_PARALLEL_CARD_CREATION);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    $(document).on('click', this.handleClickOutside);
  }

  remove() {
    $(document).off('click', this.handleClickOutside);
    return super.remove(...arguments);
  }

  handleClickOutside(event) {
    // We aren't interested in this event if the card composer is not open
    if (!this.model.get('vis')) {
      return;
    }

    const $target = $(event.target);

    // We deem the click 'outside' the the card composer if the click wasn't within it's
    // panel, or within the popover that can be used to add Members/Labels etc to the Card
    const wasClickOutside =
      $target.closest('.card-composer').length === 0 &&
      $target.closest('.pop-over').length === 0;
    if (wasClickOutside) {
      return this.model.save('vis', false);
    }
  }

  render(args, callback) {
    Analytics.sendScreenEvent({
      name: 'inlineCardComposerInlineDialog',
      containers: {
        board: {
          id: this.model.getBoard()?.id,
        },
        list: {
          id: this.model.attributes?.list.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });

    const data = {
      placeholder: this.getPlaceholder(),
      ...this.model.toJSON({ board: true }),
    };

    // this toggles classes so lets do it before adding stuff to the DOM
    this.renderVisibility();

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/card_composer_inline'),
        data,
      ),
    );

    this.renderSelectedItems();

    this.defer(() => {
      // we could focus().select() here, but it might override what was typed
      // in the time between submitting the card and getting it
      // back from the server.
      Util.setCaretAtEnd(this.$('.js-card-title')[0]);

      // will select card with this callback if we just submitted a card
      return typeof callback === 'function' ? callback() : undefined;
    });

    this.$('.js-card-title').autosize();

    return this;
  }

  autosaveCard() {
    const val = $.trim(this.$('.js-card-title').val());
    // Check placeholder value because of IE bug where it will save the placeholder
    if (
      val !== '' &&
      val !== this.getPlaceholder() &&
      val.length <= MAX_CARD_TITLE_LENGTH
    ) {
      return this.submitCard(null, true);
    } else {
      return this.frameDebounce(this.renderVisibility());
    }
  }

  renderVisibility() {
    this.$el.toggleClass('hide', !this.model.get('vis'));
    return this;
  }

  clearTextField() {
    this.model.save('title', '');
    return this.$('.js-card-title').val('').trigger('autosize.resize');
  }

  submitCard(e, addedFromAutosave = false) {
    if (e) {
      Util.stop(e);
    }

    // Hide 'add label', 'select members', etc. popovers
    PopOver.hide();

    const s = $.trim(this.$('.js-card-title').val());

    if (s === '') {
      this.$el.find('.js-card-title').focus().select();
      return;
    }

    if (s.length > MAX_CARD_TITLE_LENGTH) {
      this.$el.find('.js-card-title').focus().select();
      Alerts.flash('card title too long', 'error', 'card-composer');
      return;
    }

    const $manyCardsPopOverTarget = e ? $(e.target) : this.$el;
    const options = {
      $elem: $manyCardsPopOverTarget,
      destinationBoard: this.model.getBoard(),
      destinationList: this.model.getList(),
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    const cardTitles = _.compact(s.split(/\r\n|\r|\n/));
    const count = cardTitles.length;
    const countString = count.toString();

    Promise.try(() => {
      if (count > 100) {
        throw new CardComposerError.TooManyCards();
      }

      if (count > 1) {
        return new Promise((resolve) =>
          Confirm.toggle('create many cards', {
            elem: $manyCardsPopOverTarget,
            html: l('confirm.create many cards.text', { count: countString }),
            confirmText: l('confirm.create many cards.confirm', {
              count: countString,
            }),
            fxConfirm: (e) => resolve(true),
            fxCancel: (e) => resolve(false),
          }),
        );
      } else {
        return false;
      }
    })
      .then((createOnePerLine) => {
        this.clearTextField();
        const openCard = e?.shiftKey === true;

        if (createOnePerLine) {
          this.createMultipleCards(cardTitles, openCard);
        } else {
          // Dont select the card in autocreate card experiment so that a user
          // can use keyboard on board after creating card
          this.createCard(s, {
            openCard,
            selectCard: !addedFromAutosave,
            removeNewLines: true,
          }).catch(ApiError, () =>
            Alerts.flash('could not connect', 'error', 'card-composer'),
          );
        }

        return this.clearItems();
      })
      .then(() => {
        if (addedFromAutosave) {
          this.hide();
          return this.renderVisibility();
        }
      })
      .catch(CardComposerError.TooManyCards, () =>
        // too many cards
        Confirm.toggle('too many cards', {
          elem: $manyCardsPopOverTarget,
          html: l('confirm.too many cards.text', { count: countString }),
          fxConfirm: (e) => PopOver.hide(),
        }),
      )
      .done();
  }

  queueCreateCard(title, params = {}) {
    params.requestData = this._createCardRequestData(
      title,
      params.removeNewLines,
    );
    return this._cardCreationApiQueue.add(() => this.createCard(title, params));
  }

  _createCardRequestData(title, removeNewLines) {
    title = title?.trim();

    this.$el.trigger('prevent-scroll-selection');

    if (removeNewLines) {
      title = title.replace(/(\r\n|\n|\r)/gm, ' ');
    }

    // clone members and labels you added
    const membersToAdd = _.clone(this.model.get('idMembers'));
    const idLabelsToAdd = _.pluck(this.model.labelList.models, 'id');

    const newCardData = {
      name: title,
      closed: false,
      idLabels: idLabelsToAdd,
      idMembers: membersToAdd,
      dateLastActivity: Date.now(),
    };

    const addsLabels = idLabelsToAdd.length > 0;

    return { newCardData, addsLabels, membersToAdd };
  }

  createCard(title, param = {}) {
    const { openCard, selectCard, removeNewLines, requestData } = param;
    return new Promise((resolve, reject) => {
      const { newCardData, addsLabels, membersToAdd } =
        requestData ?? this._createCardRequestData(title, removeNewLines);

      if (title === '') {
        return resolve();
      } else {
        const traceId = Analytics.startTask({
          taskName: 'create-card/list',
          source: 'inlineCardComposerInlineDialog',
        });
        // pos needs to be calculated immediately before insertion
        newCardData.pos = this.model.getList().calcPos(this.model.get('index'));
        this.model.moveToNext();

        const card = this.model
          .getList()
          .cardList.createWithTracing(newCardData, {
            traceId: traceId,
            error: (model, error) => {
              this.model.getList().cardList.remove(card);
              Analytics.taskFailed({
                taskName: 'create-card/list',
                traceId,
                source: 'inlineCardComposerInlineDialog',
                error,
              });
              return reject(error);
            },

            success: async (card) => {
              let linkCardProvider = undefined;
              const cardRole = card?.getCardRole();

              if (cardRole === 'link') {
                const resolvedUrl = await objectResolverClient.resolveUrl(
                  card.get('name'),
                );

                if (resolvedUrl && resolvedUrl.meta) {
                  linkCardProvider =
                    resolvedUrl.meta.key || resolvedUrl.meta.definitionId;
                }
              }

              Analytics.sendTrackEvent({
                action: 'created',
                actionSubject: 'card',
                source: 'inlineCardComposerInlineDialog',
                attributes: {
                  numMembersAdded: membersToAdd?.length,
                  labelsAdded: addsLabels,
                  taskId: traceId,
                  cardRole,
                  linkCardProvider,
                },
                containers: {
                  card: {
                    id: card?.id,
                  },
                  list: {
                    id: card?.getList()?.id,
                  },
                  board: {
                    id: card?.getBoard()?.id,
                  },
                  organization: {
                    id: card?.getBoard()?.getOrganization()?.id,
                  },
                },
              });

              trackSeparator(title, {
                category: 'card composer',
                method: 'by creating a card',
              });

              Analytics.taskSucceeded({
                taskName: 'create-card/list',
                traceId,
                source: 'inlineCardComposerInlineDialog',
              });

              resolve();
            },
            modelCache: this.modelCache,
          });

        const board = this.model.getBoard();
        board.filter.addNewCard(card);

        if (selectCard) {
          board.viewState.selectCard(card);
        }

        if (openCard) {
          return Controller.showCardDetail(card, {
            runMethod: card.shouldSuggestDescription()
              ? 'expandDesc'
              : undefined,
            method: 'via the Shift shortcut from card composer',
          });
        }
      }
    });
  }

  createMultipleCards(cardTitles, openCard) {
    const numCardsLength = cardTitles.length;

    for (let i = 0; i < cardTitles.length; i++) {
      const title = cardTitles[i];
      if (cardTitles.length - 1 === i) {
        this.queueCreateCard(title, { openCard, selectCard: true });
      } else {
        this.queueCreateCard(title);
      }
    }

    Analytics.sendTrackEvent({
      action: 'created',
      actionSubject: 'multipleCards',
      source: 'createMultipleCardsInlineDialog',
      attributes: {
        numCardsLength,
      },
      containers: {
        board: {
          id: this.model.getBoard()?.id,
        },
        list: {
          id: this.model.attributes?.list.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });
  }

  pasteEvent() {
    this.$('.js-card-title').focus().keyup().trigger('autosize.resize');
  }

  keydownEvent(e) {
    const key = getKey(e);
    const $titleInput = this.$('.js-card-title');
    const isTitle = $(e.target)
      .closest('.js-card-title')
      .hasClass('js-card-title');
    const isJsAddCard = $(e.target)
      .closest('.js-add-card')
      .hasClass('js-add-card');

    if ((isTitle || isJsAddCard) && !PopOver.isVisible && key === Key.Enter) {
      Util.stop(e);
      this.submitCard(e);
      return;
    }

    if (key === Key.Escape) {
      return this.saveDraftAndHide();
    } else if ([Key.Tab, Key.Enter].includes(key)) {
      $titleInput.focus();

      const word = Util.getWordFromCaret($titleInput[0]);

      const poEl = $(PopOver.view?.el);

      let found = false;

      if (PopOver.view instanceof ComposerMemberSelectorView) {
        poEl
          .find('.js-members-list .item.selected:first .js-select-member')
          .first()
          .click();
        found = true;
      } else if (PopOver.view instanceof ComposerLabelSelectorView) {
        poEl.find('.js-select-label.selected').first().click();
        found = true;
      } else if (PopOver.view instanceof ComposerPosSelectorView) {
        if (poEl.find('.js-pos-results').length > 0) {
          poEl.find('.js-pos-results li.selected:first a').first().click();
          found = true;
        }
      } else if (key === Key.Tab && $titleInput.val() === '') {
        Util.stop(e);
        this.hide();
        if (e.shiftKey) {
          $(this.el)
            .closest('.js-list')
            .find('.editable:first .current')
            .click();
        } else {
          $(this.el)
            .closest('.js-list')
            .next()
            .find('.editable:first .current')
            .click();
        }
      }

      if (found) {
        Util.stop(e);
        Util.insertSelection($titleInput, '', word.start, word.end);
        this.model.set('title', $titleInput.val());
      }

      this.renderSelectedItems();
      PopOver.hide();
    }
  }

  keyupEvent(e) {
    const $titleInput = this.$('.js-card-title');

    const key = getKey(e);

    if ([Key.Tab, Key.Enter].includes(key)) {
      return;
    }

    if (key === Key.Escape) {
      Util.stop(e);
      PopOver.hide();
      $titleInput.focus();
      return;
    }

    // navigate menu list
    if (isArrow(key)) {
      Util.stop(e);

      const poEl = $(PopOver.view?.el);

      if (PopOver.view instanceof ComposerMemberSelectorView) {
        Util.navMenuList(poEl.find('.js-members-list'), '.item', key);
      } else if (PopOver.view instanceof ComposerLabelSelectorView) {
        Util.navMenuList(poEl, '.js-select-label', key);
      } else if (PopOver.view instanceof ComposerPosSelectorView) {
        if (poEl.find('.js-pos-results').length > 0) {
          Util.navMenuList(poEl.find('.js-pos-results'), 'li', key);
        }
      }

      return;
    }

    if (
      !Browser.isTouch() &&
      $(e.target).closest('.js-card-title').hasClass('js-card-title')
    ) {
      const word = Util.getWordFromCaret($titleInput[0]);
      const isMemberMatch = new RegExp(`^@\\S`).test(word.str.substring(0, 2));
      const isLabelMatch = new RegExp(`^\\#\\S`).test(word.str.substring(0, 2));
      const isPosMatch = new RegExp(`^\\^\\S`).test(word.str.substring(0, 2));
      const term = word.str.substring(1).toLowerCase();

      // if match members, labels, or positions
      if (isMemberMatch || isLabelMatch || isPosMatch) {
        if (![Key.Shift, Key.Alt, Key.Control].includes(key)) {
          let elem, view;
          if (isMemberMatch) {
            view = new ComposerMemberSelectorView({
              model: this.model,
              modelCache: this.modelCache,
            });

            const idBoardMems = _.pluck(
              this.model
                .getBoard()
                .memberList.filterDeactivated({ force: true }).models,
              'id',
            );
            const idMems = Util.filterMembers(
              this.modelCache,
              term,
              idBoardMems,
            );

            if (idMems.length > 0) {
              view.populate(idMems, true);

              PopOver.show({
                elem: this.$('.js-cc-menu'),
                view,
              });

              $titleInput.focus();
              elem = $(view.el).find('.js-members-list .item:first');
              return Util.selectMenuItem(
                $(view.el).find('.js-members-list'),
                '.item',
                elem,
              );
            } else {
              return PopOver.hide();
            }
          } else if (isLabelMatch) {
            view = new ComposerLabelSelectorView({
              model: this.model,
              modelCache: this.modelCache,
            });

            const labelNames = this.model.getBoard().filterLabels(term);

            if (labelNames.length > 0) {
              view.populate(labelNames);

              PopOver.show({
                elem: this.$('.js-cc-menu'),
                view,
              });

              $titleInput.focus();
              elem = $(view.el).find(
                '.edit-labels-pop-over .js-select-label:first',
              );
              return Util.selectMenuItem(
                $(view.el).find('.edit-labels-pop-over'),
                'li',
                elem,
              );
            } else {
              return PopOver.hide();
            }
          } else if (isPosMatch) {
            view = new ComposerPosSelectorView({
              model: this.model,
              modelCache: this.modelCache,
            });
            const posNames = view.filterPos(term);

            if (posNames.hasData) {
              view.populateResults(posNames);

              PopOver.show({
                elem: this.$('.js-cc-menu'),
                view,
              });

              $titleInput.focus();
              elem = $(view.el).find('.js-pos-results li:first');
              return Util.selectMenuItem(
                $(view.el).find('.js-pos-results'),
                'li',
                elem,
              );
            } else {
              return PopOver.hide();
            }
          }
        }
      } else {
        // add current text
        this.model.set('title', this.$('.js-card-title').val());

        return PopOver.hide();
      }
    }
  }

  renderSelectedItems() {
    // members
    const idMembers = this.model.get('idMembers');
    const hasMembers = !_.isEmpty(idMembers);
    const $members = this.$('.js-list-card-composer-members').empty();
    for (const mem of Array.from(this.modelCache.get('Member', idMembers))) {
      $members.append(
        `<div class='member js-remove-member' idMember='${mem}'>${memberTemplate(
          mem.toJSON(),
        )}</div>`,
      );
    }

    // labels
    const labels = this.model.get('labels');
    const hasLabels = !_.isEmpty(labels);
    const $labels = this.$('.js-list-card-composer-labels').empty();

    for (const label of Array.from(this.model.labelList.models)) {
      if (!_.isEmpty(label.get('color'))) {
        $labels.append(`<div \
class='card-label card-label-${label.get('color')} mod-card-front' \
title='${htmlEncode(label.get('name'))}' \
>${htmlEncode(label.get('name'))}</div>`);
      }
    }

    this.$('.js-clear-all-items').toggle(hasLabels || hasMembers);
  }

  openMenu(e) {
    Util.stop(e);

    Analytics.sendClickedButtonEvent({
      buttonName: 'cardComposerMenuButton',
      source: 'inlineCardComposerInlineDialog',
      containers: {
        board: {
          id: this.model.getBoard()?.id,
        },
        list: {
          id: this.model.attributes.list.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });

    return PopOver.toggle({
      elem: e.target,
      view: new ComposerSelectorMenuView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }

  clearItems(e) {
    return this.model.clearItems();
  }

  hide(e) {
    this.model.save('vis', false);
  }

  saveDraftAndHide() {
    this.model.save('title', this.$('.js-card-title').val());
    this.$('.js-card-title').val('');
    return this.hide();
  }

  clearAndHide(e) {
    // Set title to nothing so that autosave doesn't save on close
    this.$('.js-card-title').val('');
    this.clearItems();
    return this.hide();
  }

  scrollIntoView() {
    const { top } = this.$el.offset();
    const scrollable = this.$el.closest('.list-cards');

    return scrollable.scrollTop(top + this.$el.height());
  }

  getPlaceholder() {
    return l([
      'templates',
      'card_composer_inline',
      'enter-a-title-for-this-card-ellipsis',
    ]);
  }
}

module.exports = CardComposerInlineView;
