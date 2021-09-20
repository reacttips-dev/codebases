// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const templates = require('app/scripts/views/internal/templates');
const View = require('app/scripts/views/internal/view');

class LabelLimitsErrorView extends View {
  static initClass() {
    this.prototype.tagName = 'span';
    this.prototype.className = 'error';
  }
  renderOnce() {
    return this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/label_limit_exceeded'),
      ),
    );
  }
}
LabelLimitsErrorView.initClass();

module.exports = LabelLimitsErrorView;
