// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');

const WINDOW_MEDIUM = { width: 750 };
const WINDOW_LARGE = { width: 900 };
const WINDOW_EXTRA_LARGE = { width: 1280 };

module.exports.WindowSize = {
  calc() {
    this.ranCalc = true;
    const width = $(window).width();

    this.fExtraLarge = this.fLarge = this.fMedium = this.fSmall = false;

    if (width > WINDOW_EXTRA_LARGE.width) {
      this.fExtraLarge = true;
    } else if (width > WINDOW_LARGE.width) {
      this.fLarge = true;
    } else if (width > WINDOW_MEDIUM.width) {
      this.fMedium = true;
    } else {
      this.fSmall = true;
    }

    return $(this).triggerHandler('windowClassChange');
  },

  ensureRun() {
    if (!this.ranCalc) {
      return this.calc();
    }
  },
};
