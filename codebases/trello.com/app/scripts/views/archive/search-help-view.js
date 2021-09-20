// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/search_help_popover');

class SearchHelpView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'help';
  }

  render() {
    this.$el.html(template());

    return this;
  }
}

SearchHelpView.initClass();
module.exports = SearchHelpView;
