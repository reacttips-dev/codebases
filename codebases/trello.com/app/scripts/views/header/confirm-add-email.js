// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Confirm = require('app/scripts/views/lib/confirm');
const SelectMemberView = require('app/scripts/views/member/select-member-view');

module.exports = class ConfirmAddEmail extends Confirm {
  constructor() {
    super(...arguments);
    this.template = 'confirm_merge';
  }

  render() {
    super.render(...arguments);
    this.appendSubview(
      this.subview(SelectMemberView, this.model),
      this.$('.js-member'),
    );
    return this;
  }
};
