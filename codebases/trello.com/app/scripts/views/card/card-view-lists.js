/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const {
  shouldFireConfetti,
} = require('app/scripts/views/card/should-fire-confetti');
const confetti = require('canvas-confetti').default;

module.exports.moveTo = function (e, ui, listViewDest, sameList) {
  if (ui.item.parents('.js-list').length === 0) {
    // Sometimes Internet Explorer 10 fires this event when the card is not
    // displayed. Just treat it as a failed drag for now. - Brett, July 2013
    // I can't reproduce this, but I'm afraid to take it out. - Ian, Oct 2014
    // This can happen in supported browsers when another drag starts before
    // the deferred 'moveto' is triggered by triggerOnItem (e.g. on drags
    // during initial load/render when the client is busy) - Daniel, Mar 2021
    return;
  }

  const cards = ui.item
    .parents('.js-list')
    .find('.list-card:not(.placeholder,.js-composer)');
  const index = cards.index(ui.item);

  if (!sameList) {
    if (shouldFireConfetti(listViewDest.model.get('name'))) {
      const listViewOffset = ui.item.offset();
      const cardHeight = ui.item.height();
      const cardWidth = ui.item.width();

      confetti({
        angle: _.random(55, 125),
        spread: _.random(50, 70),
        particleCount: _.random(40, 75),
        origin: {
          x: (listViewOffset.left + cardWidth / 2) / window.innerWidth,
          y: (listViewOffset.top + cardHeight / 2) / window.innerHeight,
        },
      });
    }

    // We don't need the element that they dragged to stick around; we'll add
    // a new one when we modify the list
    ui.item.remove();
  }

  this.model.moveToList(listViewDest.model, index);
};

module.exports.moveIn = function (e, ui, listView) {
  // moveTo always gets called because it's triggered from
  // sortStop even if it's outside the original list.
  if (listView.model.id === this.model.get('idList')) {
    this.moveTo(e, ui, listView, true);
  }
};
