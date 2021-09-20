// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/member_large_avatar');

class LargeAvatarView extends View {
  static initClass() {
    this.prototype.displayType = 'mod-avdetail';
  }
  getViewTitle() {
    return this.model.get('fullName');
  }

  render() {
    const data = this.model.toJSON();

    this.$el.html(template(data));

    return this;
  }
}

LargeAvatarView.initClass();
module.exports = LargeAvatarView;
