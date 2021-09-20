/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { trelloClipboard } = require('app/scripts/lib/trello-clipboard');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { WindowSize } = require('app/scripts/lib/window-size');
const _ = require('underscore');

// TODO: This is a weird model that does not persist, and probably should
// not exist, at least not as an actual model.
// See https://trello.com/c/mvr7u2zf
module.exports.BoardState = class BoardState extends TrelloModel {
  sync(method, model, options) {
    throw new Error('BoardState is a special weird non-persistent thing');
  }

  initialize(data, options) {
    super.initialize(...arguments);
    ({ board: this.board } = options);

    if (this.useSidebarPref()) {
      this.setShowSidebarFromPref();
      this.listenTo(this.board, 'change:myPrefs', this.setShowSidebarFromPref);
    } else {
      this.set('showSidebar', !WindowSize.fSmall);
    }

    return this.set('listComposerOpen', false);
  }

  setSidebarDisplayType(type) {
    return this.set('sidebarDisplayType', type != null ? type : '');
  }

  getSidebarDisplayType() {
    return this.get('sidebarDisplayType');
  }

  selectCard(card) {
    this._selectedList = null;
    if (card === this._selectedCard) {
      return;
    }

    if (this._selectedCard) {
      this.stopListening(this._selectedCard, 'change:closed');
    }

    this._selectedCard = card;

    if (this._selectedCard != null) {
      this.listenTo(this._selectedCard, 'change:closed', () => {
        return this.selectCardAfter(this._selectedCard);
      });

      this.waitForId(this._selectedCard, () => {
        // We may have created additional cards between the original selectCard
        // and now, so make sure we haven't selected something else
        if (this._selectedCard === card) {
          return trelloClipboard.set(card.getFullUrl());
        }
      });
    }

    this.trigger('active-card-changed');
  }

  selectList(list) {
    return (this._selectedList = list);
  }

  isCardSelected(card) {
    return card != null && card === this._selectedCard;
  }

  clearSelectedCard() {
    return this.selectCard(null);
  }

  getCard() {
    return this._selectedCard;
  }

  getList() {
    const card = this.getCard();
    if (card != null) {
      return card.getList();
    } else {
      return this._selectedList;
    }
  }

  selectCardAfter(card) {
    const list = card.getList();
    const visibleCards =
      list != null
        ? list.cardList.filter((card) =>
            this.board.filter.satisfiesFilter(card),
          )
        : undefined;

    const nextCard = (() => {
      if (list == null || visibleCards.length === 0) {
        return null;
      } else {
        const comesAfter = (masterCard) => {
          return (otherCard) =>
            otherCard !== masterCard &&
            otherCard.get('pos') >= masterCard.get('pos');
        };

        return _.find(visibleCards, comesAfter(card));
      }
    })();

    return this.selectCard(nextCard != null ? nextCard : _.last(visibleCards));
  }

  openListComposer() {
    return this.set('listComposerOpen', true);
  }

  closeListComposer() {
    this.$('.js-open-add-list').removeAttr('tabindex');
    return this.set('listComposerOpen', false);
  }

  useSidebarPref() {
    return (
      Auth.isLoggedIn() &&
      (WindowSize.fExtraLarge || WindowSize.fLarge || WindowSize.fMedium)
    );
  }

  setShowSidebar(show) {
    if (show !== this.get('showSidebar')) {
      this.set('showSidebar', show);

      // if we are currently in a state where the pref should be used, update it
      if (this.useSidebarPref()) {
        return this.board.setPref('showSidebar', show);
      }
    }
  }

  setShowSidebarFromPref() {
    return this.waitForAttr(this.board, 'myPrefs', () => {
      return this.set('showSidebar', this.board.getPref('showSidebar'));
    });
  }

  getShowSidebarFromPref() {
    return this.waitForAttr(this.board, 'myPrefs', () => {
      return this.board.getPref('showSidebar');
    });
  }
};
