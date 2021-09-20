/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');

const LengthCheckingMixin = {
  checkLength(e) {
    const text = $(e.target).val();
    const maxLength = this.maxLength || 16384;
    const isEmpty = text.length === 0 || /^\s*$/.test(text);
    const isTooLong = !isEmpty && text.length > maxLength;
    if (this.preventSubmit != null) {
      this.preventSubmit(isTooLong, isEmpty);
    } else {
      this._preventSubmit(isTooLong, isEmpty);
    }
  },

  _preventSubmit(isTooLong, isEmpty) {
    this.$('.js-too-long-warning').toggleClass('hide', !isTooLong);
    this.$('.js-is-empty-warning').toggleClass('hide', !isEmpty);
    return this.$('input[type="submit"]').prop(
      'disabled',
      isEmpty || isTooLong,
    );
  },
};

module.exports = LengthCheckingMixin;
