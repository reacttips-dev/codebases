// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const templates = require('app/scripts/views/internal/templates');
const View = require('app/scripts/views/internal/view');

const template = t.renderable(function ({ newBillableGuests }) {
  this.newBillableGuests = newBillableGuests;
  return t.ul('.pop-over-member-list.js-billable-guest-list');
});

class BillableGuestListPopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'billable guest list';
  }
  initialize({ newBillableGuests }) {
    this.newBillableGuests = newBillableGuests;
  }
  render() {
    this.$el.html(template({ newBillableGuests: this.newBillableGuests }));
    const $billableGuestList = this.$('.js-billable-guest-list')
      .first()
      .empty();

    for (const member of Array.from(this.newBillableGuests)) {
      const data = Object.assign(member, {
        url: `/${member.username}`,
        unconfirmed: !member.confirmed,
      });
      $billableGuestList.append(
        templates.fill(
          require('app/scripts/views/templates/select_member'),
          data,
          {},
          { member: templates.member },
        ),
      );
    }
    return this;
  }
}

BillableGuestListPopoverView.initClass();
module.exports = BillableGuestListPopoverView;
