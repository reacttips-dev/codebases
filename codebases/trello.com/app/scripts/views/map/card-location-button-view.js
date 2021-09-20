// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const sidebarAction = require('app/scripts/views/templates/card_detail_sidebar_button');

class CardLocationButtonView extends View {
  static initClass() {
    this.prototype.tagName = 'span';
  }

  renderOnce() {
    this.$el.html(
      sidebarAction('js-edit-location', 'location', 'location', false),
    );
    return this;
  }
}

CardLocationButtonView.initClass();
module.exports = CardLocationButtonView;
