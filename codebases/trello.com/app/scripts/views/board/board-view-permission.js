// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Controller } = require('app/scripts/controller');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const permsTemplate = require('app/scripts/views/templates/board_header_permissions');
const { l } = require('app/scripts/lib/localize');
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const { Analytics } = require('@trello/atlassian-analytics');
const ChangeBoardVisibilityView = require('app/scripts/views/board-menu/change-board-visibility-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const BoardAddToOrganizationView = require('app/scripts/views/board-menu/board-add-to-organization-view');

module.exports.permChange = function (newPerm) {
  if (newPerm === 'none') {
    Controller.memberHomePage();
  } else {
    this.render();
    // If we can't edit the board, hide the card composer (if it's open)
    if (!this.model.editable()) {
      this.model.composer.save('vis', false);
    }
  }
};

module.exports.renderPermissionLevel = function () {
  const $perm = this.$('#permission-level');
  const data = {
    permIconClass: BoardDisplayHelpers.getPermLevelIconClassForBoard(
      this.model,
    ),
    permText: l(['board perms', this.model.getPermLevel(), 'name']),
  };

  $perm.html(permsTemplate(data));

  if (this.model.isTemplate()) {
    $perm.attr(
      'title',
      BoardDisplayHelpers.getPermLevelAltTextForTemplate(this.model),
    );
  } else {
    $perm.attr(
      'title',
      BoardDisplayHelpers.getPermLevelAltTextForBoard(this.model),
    );
  }

  const canInvite = this.model.canInvite(Auth.me());
  this.$('.js-manage-board-members').toggle(canInvite);

  return this;
};

module.exports.changeVis = function (e) {
  Util.stop(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'changeBoardVisibilityButton',
    source: 'boardScreen',
  });

  PopOver.toggle({
    elem: this.$('.js-change-vis'),
    view: ChangeBoardVisibilityView,
    options: { model: this.model, modelCache: this.modelCache },
  });
};

module.exports.addBoardToTeam = function (e) {
  Util.stop(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'changeBoardWorkspaceButton',
    source: 'boardScreen',
  });

  return PopOver.toggle({
    elem: this.$('.js-add-board-to-team'),
    view: BoardAddToOrganizationView,
    options: { model: this.model, modelCache: this.modelCache },
  });
};
