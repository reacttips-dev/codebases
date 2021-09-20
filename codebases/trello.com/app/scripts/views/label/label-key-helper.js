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
const { Key } = require('@trello/keybindings');
const { Label } = require('app/scripts/models/label');
const _ = require('underscore');

module.exports = (function () {
  class LabelKeyHelper {
    static initClass() {
      this.keyboardIndex = [_.last(Label.colors)].concat(
        _.initial(Label.colors),
      );
    }

    static keyNumberForColor(color) {
      const ix = this.keyboardIndex.indexOf(color);
      if (ix >= 0) {
        return `${ix}`;
      } else {
        return null;
      }
    }

    static colorForKey(key) {
      const labelIndex = key - Key.Zero;
      return this.keyboardIndex[labelIndex];
    }

    static setLabelFromKey(key, card, fxNoUniqueLabel) {
      const color = this.colorForKey(key);
      const boardMatches = card.getBoard().labelsForColors()[color];
      if ((boardMatches != null ? boardMatches.length : undefined) === 1) {
        card.toggleLabelColor(color);
      } else {
        if (typeof fxNoUniqueLabel === 'function') {
          fxNoUniqueLabel(color);
        }
      }
    }
  }
  LabelKeyHelper.initClass();
  return LabelKeyHelper;
})();
