/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');

class UploadingLinkView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'sending links';
  }
  render() {
    this.$el.html('<div class="spinner loading"></div>');
    return this;
  }
}

UploadingLinkView.initClass();
module.exports = UploadingLinkView;
