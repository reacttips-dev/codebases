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
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

// emoji-mart uses number values to map out the skin variations
const skinUnifiedMap = {
  1: '',
  2: '1F3FB',
  3: '1F3FC',
  4: '1F3FD',
  5: '1F3FE',
  6: '1F3FF',
};
const unifiedSkinMap = _.invert(skinUnifiedMap);

class Reaction extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Reaction';
  }

  urlRoot() {
    return `/1/actions/${this.get('idModel')}/reactions`;
  }

  toEmojiMart() {
    const emoji = this.get('emoji');
    if (emoji.colons != null) {
      // This is a not-yet persisted reaction, so the emoji object is in the
      // emoji-mart data format
      return { colons: emoji.colons, skin: emoji.skin };
    }
    const emojiMartSkinValue = unifiedSkinMap[emoji.skinVariation];
    return {
      colons: `:${emoji.shortName}${
        emojiMartSkinValue ? `::skin-tone-${emojiMartSkinValue}` : ''
      }:`,
      skin: emojiMartSkinValue || 1,
    };
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);
    return {
      unified: data.emoji.unified.toUpperCase(),
      skinVariation: skinUnifiedMap[data.emoji.skin],
    };
  }
}
Reaction.initClass();

module.exports.Reaction = Reaction;
