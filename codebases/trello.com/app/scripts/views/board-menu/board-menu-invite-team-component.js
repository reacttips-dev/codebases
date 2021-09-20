// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_menu_invite_team',
);

class BoardMenuInviteTeamComponent extends React.Component {
  static initClass() {
    this.prototype.render = t.renderable(function () {
      const { onClick, availableToInvite } = this.props;

      return t.div('.invite-team', { onMouseDown: onClick }, function () {
        t.span('.icon-lg.icon-organization');
        return t.div('.invite-team-text', () =>
          t.format('add-all-x-team-members', {
            memberCount: availableToInvite.length,
          }),
        );
      });
    });
  }
}

BoardMenuInviteTeamComponent.initClass();
module.exports = BoardMenuInviteTeamComponent;
