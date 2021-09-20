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
const templates = require('app/scripts/views/internal/templates');

class FormattingHelpView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'formatting help';
  }

  render() {
    this.$el.html(
      templates.fill(require('app/scripts/views/templates/formatting_help')),
    );
    return this;
  }
}

FormattingHelpView.initClass();
module.exports = FormattingHelpView;
