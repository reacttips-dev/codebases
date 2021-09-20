// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const SelectMemberView = require('app/scripts/views/member/select-member-view');

module.exports = class SelectMemberOnCardView extends SelectMemberView {
  //extra option: card
  initialize() {
    return this.listenTo(
      this.options.card,
      'change:idMembers',
      this.renderActive,
    );
  }

  renderActive() {
    let needle;
    return this.$el.toggleClass(
      'active',
      ((needle = this.model.id),
      Array.from(this.options.card.get('idMembers')).includes(needle)),
    );
  }

  render() {
    super.render(...arguments);
    this.renderActive();

    return this;
  }
};
