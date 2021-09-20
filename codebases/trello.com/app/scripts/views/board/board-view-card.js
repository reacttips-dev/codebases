/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const { idCache } = require('@trello/shortlinks');
const { Card } = require('app/scripts/models/card');
const Payloads = require('app/scripts/network/payloads').default;
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const AddListPopoverView = require('app/scripts/views/board/add-list-popover-view');
const { canAddCard } = require('app/scripts/views/card/card-limits-error');

module.exports.openCardComposerInFirstList = function () {
  const firstList = this.model.listList.first();
  this.model.composer.save({
    list: firstList,
    index: firstList.openCards().length,
    vis: true,
  });
  Analytics.sendUIEvent({
    action: 'opened',
    actionSubject: 'cardComposer',
    source: 'boardScreen',
    attributes: {
      method: 'firstList',
    },
  });
};

module.exports.scrollToCard = function (card) {
  const list = card.getList();
  this.scrollToList(list);
  return this.viewForList(list).scrollToCard(card);
};

module.exports.preventScrollSelection = function () {
  // So here's the deal.
  //
  // When you're selecting cards with the keyboard, we'll scroll the
  // board and the lists on it to ensure the currently selected card
  // is always visible.
  //
  // As a result of this scrolling, it's possible that the mouseenter event
  // will fire on a CardView -- which, if you look above at the handling of
  // mouseEnterCardView, will cause us to mark the newly hovered card as
  // selected, even though you didn't actually move the mouse at all.
  //
  // So we remember that we've just selected something with the keyboard,
  // and we should ignore mouse events until the next time the user moves
  // the mouse.
  //
  // But.
  //
  // Chrome will fire mousemove events even when the mouse *hasn't* moved,
  // as a result of the scroll.
  //
  // https://code.google.com/p/chromium/issues/detail?id=241476
  //
  // So we can't just wait for the next mousemove event -- we have to wait
  // for the next mousemove event that has occurred as the result of the
  // user moving the mouse.
  //
  // Detecting that is a bit of a hack, but appears to work well enough for
  // now.
  //
  // IE 10 will apparently just fire mousemove events constantly, even
  // when a scroll doesn't occur. I don't know how to fix that. I can't find
  // a good workaround for IE 10. So that's just not gonna work.

  if (this.ignoreMouseCardSelects) {
    return;
  }

  const isResultOfActualPhysicalMouseMovement = function (e) {
    const { movementX: x, movementY: y } = e.originalEvent;
    return x !== 0 || y !== 0;
  };

  this.ignoreMouseCardSelects = true;

  const bindOnce = () => {
    return $(document).one('mousemove', (e) => {
      if (isResultOfActualPhysicalMouseMovement(e)) {
        this.ignoreMouseCardSelects = false;
      } else {
        bindOnce();
      }
    });
  };

  bindOnce();
};

module.exports.moveCard = function (direction) {
  let card, newCardIndex;
  this.preventScrollSelection();

  const selectedCard = this.model.viewState.getCard();

  if (selectedCard == null) {
    // Select the first card in the first list that has a card
    const listWithCards = this.model.listList.find(
      (list) => !list.openCards().isEmpty(),
    );
    if (listWithCards != null) {
      listWithCards.selectFirstCardInList();
    }
    return;
  }

  const selectedList = selectedCard.getList();

  const openCards = selectedList.openCards();
  const cardIndex = openCards.indexOf(selectedCard);

  const findNextGoodIndex = (
    currentIndex,
    indexDelta,
    upperBound,
    fxIndexIsGood,
  ) => {
    let newIndex = currentIndex + indexDelta;
    if (this.model.filter.isFiltering) {
      while (
        0 <= newIndex &&
        newIndex < upperBound &&
        !fxIndexIsGood(newIndex)
      ) {
        newIndex += indexDelta;
      }
    }
    // We just return something out of bounds if there's no index that works
    return newIndex;
  };

  if (['up', 'down'].includes(direction)) {
    const indexDelta = direction === 'up' ? -1 : 1;
    newCardIndex = findNextGoodIndex(
      cardIndex,
      indexDelta,
      openCards.length,
      (newCardIndex) => {
        return this.model.filter.satisfiesFilter(openCards.at(newCardIndex));
      },
    );

    if (0 <= newCardIndex && newCardIndex < openCards.length) {
      card = openCards.at(newCardIndex);
      this.scrollToCard(card);
      return this.model.viewState.selectCard(card);
    }
  } else if (['left', 'right'].includes(direction)) {
    const openLists = this.model.listList;
    const listIndex = openLists.indexOf(selectedList);

    const listIndexDelta = direction === 'left' ? -1 : 1;
    const newListIndex = findNextGoodIndex(
      listIndex,
      listIndexDelta,
      openLists.length,
      (newListIndex) => {
        return openLists
          .at(newListIndex)
          .openCards()
          .any((card) => {
            return this.model.filter.satisfiesFilter(card);
          });
      },
    );
    if (0 <= newListIndex && newListIndex < openLists.length) {
      const newList = openLists.at(newListIndex);
      const newListOpenCards = newList.openCards();
      const newCardIndexStart = Math.min(
        cardIndex,
        newListOpenCards.length - 1,
      );
      return (() => {
        const result = [];
        for (const delta of [1, -1]) {
          newCardIndex = findNextGoodIndex(
            newCardIndexStart - delta,
            delta,
            newListOpenCards.length,
            (newCardIndex) => {
              return this.model.filter.satisfiesFilter(
                newListOpenCards.at(newCardIndex),
              );
            },
          );
          if (0 <= newCardIndex && newCardIndex < newListOpenCards.length) {
            card = newListOpenCards.at(newCardIndex);
            this.model.viewState.selectCard(card);
            this.scrollToCard(card);
            break;
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
};

module.exports.dblClickAddListMenu = function (e) {
  Util.stop(e);

  if ($(e.target).closest('.js-card-templates-button').length > 0) {
    return;
  }

  if (this.model.editable()) {
    let list;
    if ($(e.target).closest('.js-list-content').length === 0) {
      if (!this.model.viewState.get('listComposerOpen')) {
        // They didn't click inside a list
        Analytics.sendScreenEvent({
          name: 'addListInlineDialog',
          attributes: {
            method: 'doubleClick',
          },
        });

        PopOver.show({
          clientx: e.clientX,
          clienty: e.clientY,
          view: new AddListPopoverView({
            model: this.model,
            modelCache: this.modelCache,
            didAddList: (list) => this.scrollToList(list),
          }),
        });
      }
    } else if ((list = this.model.viewState.getList()) != null) {
      const $elClicked = this.$(
        document.elementFromPoint(e.clientX, e.clientY),
      );

      if (
        $elClicked.closest('.list-header-name,.card-composer,.list-card')
          .length === 0
      ) {
        const $card = this.$(
          document.elementFromPoint(e.clientX, e.clientY - 16),
        ).closest('.list-card');

        Analytics.sendUIEvent({
          action: 'opened',
          actionSubject: 'cardComposer',
          source: 'boardScreen',
          attributes: {
            method: 'doubleClick',
          },
        });

        this.model.composer.save({
          list,
          index: $card.length
            ? // Put the composer one spot after the card above where we double clicked
              Math.max(
                $card
                  .closest('.js-list-cards')
                  .find('>.list-card')
                  .index($card),
                0,
              ) + 1
            : // Put the composer at the top
              0,
          vis: true,
        });
      }
    }
  }
};

// Returns the idList/index to move a card to.  It prefers to move the card
// above the card that is 'active', and will fall back to inserting the card
// at the bottom of idListDefault if no card is active
module.exports._insertCardPosition = function (idListDefault) {
  const activeCard = this.model.viewState.getCard();
  if (activeCard != null) {
    return {
      idList: activeCard.get('idList'),
      index: activeCard.getIndexInList(),
    };
  } else {
    return {
      idList: idListDefault,
      index: this.model.listList.get(idListDefault).cardList.length,
    };
  }
};

module.exports.moveCardRequested = function (listView, { shortLink, idList }) {
  let index, left;
  ({ idList, index } = this._insertCardPosition(idList));
  const idCard =
    (left = idCache.getId('Card', shortLink)) != null ? left : shortLink;

  return Card.load(idCard, Payloads.cardMinimal, this.modelCache)
    .then((card) => {
      const list = this.model.listList.get(idList);
      if (
        card.get('idList') === idList ||
        canAddCard({ destinationList: list })
      ) {
        return card.moveToList(list, index);
      }
    })
    .done();
};

module.exports.copyCardRequested = function (
  listView,
  { shortLink, idList, traceId },
) {
  let index, left;
  ({ idList, index } = this._insertCardPosition(idList));
  const idCard =
    (left = idCache.getId('Card', shortLink)) != null ? left : shortLink;

  return Card.load(idCard, Payloads.cardMinimal, this.modelCache)
    .then((card) => {
      const list = this.model.listList.get(idList);

      const options = {
        hasChecklists: card.checklistList.length > 0,
        hasAttachments: card.attachmentList.length > 0,
        destinationBoard: this.model,
        destinationList: list,
      };
      if (canAddCard(options)) {
        return card.copyTo({
          idList,
          pos: this.model.listList.get(idList).calcPos(index, card),
          traceId,
        });
      }
    })
    .done();
};
