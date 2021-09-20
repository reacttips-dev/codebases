/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Sticker } = require('app/scripts/models/Sticker');
const _ = require('underscore');

class StickerList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Sticker;
  }
  url() {
    return `/1/cards/${this.card.get('id')}/stickers`;
  }

  initialize(list, { card }) {
    this.card = card;
    this.listenTo(this, 'change:zIndex', this.sort);
  }

  comparator(sticker) {
    return sticker.get('zIndex') || 0;
  }

  nextZIndex(model) {
    if (this.length > 0) {
      const currentMax = _.max(this.pluck('zIndex'));

      // If the specified model is already at the max, and nothing else is
      // return the current max
      if (
        (model != null ? model.get('zIndex') : undefined) === currentMax &&
        this.filter((s) => s.get('zIndex') === currentMax).length === 1
      ) {
        return currentMax;
      } else {
        return currentMax + 1;
      }
    } else {
      return 1;
    }
  }
}
StickerList.initClass();

module.exports.StickerList = StickerList;
