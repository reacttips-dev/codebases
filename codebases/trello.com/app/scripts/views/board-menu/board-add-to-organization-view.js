// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let BoardAddToOrganizationView;
const BoardSelectOrganizationView = require('app/scripts/views/board-menu/board-select-organization-view');

module.exports = BoardAddToOrganizationView = (function () {
  BoardAddToOrganizationView = class BoardAddToOrganizationView extends (
    BoardSelectOrganizationView
  ) {
    static initClass() {
      this.prototype.viewTitleKey = 'add to a team';
    }

    getTemplateData() {
      const data = super.getTemplateData();
      data.addToTeam = true;

      return data;
    }
  };
  BoardAddToOrganizationView.initClass();
  return BoardAddToOrganizationView;
})();
