// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ChangeBoardAddMemberPermsView;
const ChangeBoardPermsView = require('app/scripts/views/board-menu/change-board-perms-view');

module.exports = ChangeBoardAddMemberPermsView = (function () {
  ChangeBoardAddMemberPermsView = class ChangeBoardAddMemberPermsView extends (
    ChangeBoardPermsView
  ) {
    static initClass() {
      this.prototype.viewTitleKey = 'add member permissions';
    }
    getTemplate() {
      return require('app/scripts/views/templates/board_menu_invitations');
    }
    getPerm() {
      return 'invitations';
    }
  };
  ChangeBoardAddMemberPermsView.initClass();
  return ChangeBoardAddMemberPermsView;
})();
