// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ChangeBoardCommentingPermsView;
const ChangeBoardPermsView = require('app/scripts/views/board-menu/change-board-perms-view');

module.exports = ChangeBoardCommentingPermsView = (function () {
  ChangeBoardCommentingPermsView = class ChangeBoardCommentingPermsView extends (
    ChangeBoardPermsView
  ) {
    static initClass() {
      this.prototype.viewTitleKey = 'commenting permissions';
    }
    getTemplate() {
      return require('app/scripts/views/templates/board_menu_commenting');
    }
    getPerm() {
      return 'comments';
    }
  };
  ChangeBoardCommentingPermsView.initClass();
  return ChangeBoardCommentingPermsView;
})();
