// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Card } = require('app/scripts/models/card');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');

class CardList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Card;

    this.prototype.url = '/1/cards';
  }
  initialize(models, options) {
    this.listenTo(this, 'change:pos', this.sort);
    this.list = options.list;
  }

  comparator(card) {
    return card.get('pos') || 0;
  }
}
CardList.initClass();

module.exports.CardList = CardList;
