/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const BoardMemberMenuView = require('app/scripts/views/member-menu-profile/board-member-menu-view');
const DragSort = require('app/scripts/views/lib/drag-sort');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const assert = require('app/scripts/lib/assert');
const template = require('app/scripts/views/templates/member');

class MemberOnBoardView extends View {
  static initClass() {
    this.prototype.tagName = 'a';
    this.prototype.className = 'member js-member';
    this.prototype.viewTitleKey = 'change permissions';

    this.prototype.attributes = { tabindex: 0 };

    this.prototype.zIndex = 0;

    this.prototype.events = {
      click: 'showMenu',
      keydown: 'showMenu',
    };
  }

  initialize({ board, notClickable, small, hideBadges, zIndex }) {
    this.board = board;
    this.notClickable = notClickable;
    this.small = small;
    this.hideBadges = hideBadges;
    this.zIndex = zIndex;
    assert(
      this.model != null,
      'You cannot have a deleted member as a board member!',
    );
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.board, 'change:memberships', this.render);
  }

  render() {
    const data = this.model.toJSON();

    const isAdmin = (parent) => {
      const membership = parent.getMembershipFor(this.model);
      return (
        (membership != null ? membership.memberType : undefined) === 'admin'
      );
    };

    // if the person is a BC org admin, then they are board admin, too, dang it
    data.isBoardAdmin =
      isAdmin(this.board) ||
      __guard__(this.board.getOrganization(), (x) =>
        x.isPremOrgAdmin(this.model),
      );

    data.isGhost = this.model.get('memberType') === 'ghost';
    data.isDeactivated = this.board.isDeactivated(this.model);
    data.hideBadges = this.hideBadges;

    this.$el.html(template(data)).css('z-index', this.zIndex);

    if (this.model.isFeatureEnabled('crown')) {
      this.$el.addClass('has-crown');
    }

    if (this.small) {
      this.$el.addClass('m-member-mod-24');
    }
    if (this.notClickable) {
      this.$el.addClass('m-member-mod-no-click');
    }

    this.$el.toggleClass(
      'member-deactivated js-member-deactivated',
      data.isDeactivated,
    );
    this.$el.toggleClass(
      'member-virtual-invitee',
      data.memberType === 'ghost' &&
        (data.idMemberReferrer == null ||
          data.idMemberReferrer === Auth.me().id),
    );

    this.$el.toggleClass(
      'long-initials',
      (data.initials != null ? data.initials.length : undefined) > 2,
    );

    if (data.isGhost) {
      this.$el.addClass('member-virtual');
    }

    this.$el.data('id', this.model.id);
    return this;
  }

  showMenu(e) {
    if (DragSort.sorting || this.notClickable) {
      return;
    }

    if (e.type === 'keydown') {
      Util.stopPropagation(e);
      if (e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
    } else {
      Util.stop(e);
    }

    const popoverMethod = this.options.pushView ? 'pushView' : 'toggle';
    PopOver[popoverMethod]({
      elem: e.currentTarget,
      view: new BoardMemberMenuView({
        board: this.board,
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
MemberOnBoardView.initClass();
module.exports = MemberOnBoardView;
