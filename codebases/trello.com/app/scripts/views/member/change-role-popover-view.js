/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { showFlag } = require('@trello/nachos/experimental-flags');
const { Auth } = require('app/scripts/db/auth');
const Confirm = require('app/scripts/views/lib/confirm');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');

class ChangeRolePopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change permissions';

    this.prototype.events = {
      'click .js-make-admin': 'makeAdmin',
      'click .js-make-member': 'makeMember',
      'click .js-make-observer': 'makeObserver',
    };
  }

  initialize() {
    this.parent = this.options.parent;
    this.listenTo(this.parent, 'change:memberships', this.render);
  }

  render() {
    const data = this.model.getMembershipData(this.parent);

    data.showObserver = this.parent.hasObservers();
    data.canMakeAdmin = this.model.get('confirmed');

    const localizationKey = (() => {
      if (this.parent.typeName === 'Organization') {
        return 'org roles';
      } else if (this.parent.typeName === 'Board') {
        return 'board roles';
      } else {
        throw new Error('A fragile abstraction has broken');
      }
    })();

    for (const role of Array.from(this.parent.getAvailableRoles())) {
      data[`roleText_${role}`] = l([localizationKey, role, 'text']);
    }
    if (data['roleText_admin'] == null) {
      data['roleText_admin'] = data['roleText_superadmin'];
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_change_roles'),
        data,
      ),
    );

    return this;
  }

  apiChangeRole(type, traceId) {
    this.$el.find('ul a').addClass('disabled');

    const currentMemberType = this.getMemberType();

    this.parent
      .changeMemberRole(this.model, { type }, traceId)
      .then(() => {
        Analytics.taskSucceeded({
          taskName: 'edit-board/members/role',
          source: 'changeBoardMemberRoleInlineDialog',
          traceId,
        });
      })
      .catch((error) => {
        Analytics.taskFailed({
          taskName: 'edit-board/members/role',
          source: 'changeBoardMemberRoleInlineDialog',
          traceId,
          error,
        });

        if (
          error.message ===
          'Guest cannot be granted admin privileges on enterprise board'
        ) {
          this.parent.setOnMembership(this.model, {
            memberType: currentMemberType,
          });

          showFlag({
            id: 'change-role-error',
            title: l(['board permissions', 'title error']),
            description: l([
              'board permissions',
              'Elevate guest to enterprise board admin',
            ]),
            isAutoDismiss: true,
            appearance: 'error',
            msTimeout: 5 * 1000,
          });
        }
      })
      .done();
    PopOver.hide();
  }

  getMemberType() {
    return this.parent.getExplicitMemberType(this.model);
  }
  isAdminAndMe() {
    return this.getMemberType() === 'admin' && Auth.isMe(this.model);
  }
  isEnterpriseAdmin() {
    return __guard__(
      typeof this.parent.getEnterprise === 'function'
        ? this.parent.getEnterprise()
        : undefined,
      (x) => x.isAdmin(this.model),
    );
  }

  makeAdmin(e) {
    Util.stop(e);
    if ($(e.target).closest('a').hasClass('disabled')) {
      return;
    }

    if (this.getMemberType() === 'admin') {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/members/role',
      source: 'changeBoardMemberRoleInlineDialog',
    });

    this.apiChangeRole('admin', traceId);
  }

  makeMember(e) {
    Util.stop(e);
    if ($(e.target).closest('a').hasClass('disabled')) {
      return;
    }

    if (this.getMemberType() === 'normal') {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/members/role',
      source: 'changeBoardMemberRoleInlineDialog',
    });

    if (this.isAdminAndMe() && !this.isEnterpriseAdmin()) {
      Confirm.pushView('demote admin to normal member', {
        fxConfirm: (e) => {
          return this.apiChangeRole('normal', traceId);
        },
      });
    } else {
      this.apiChangeRole('normal', traceId);
    }
  }

  makeObserver(e) {
    Util.stop(e);
    if ($(e.target).closest('a').hasClass('disabled')) {
      return;
    }

    if (this.getMemberType() === 'observer') {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/members/role',
      source: 'changeBoardMemberRoleInlineDialog',
    });

    if (this.isAdminAndMe()) {
      Confirm.pushView('demote admin to observer', {
        fxConfirm: (e) => {
          return this.apiChangeRole('observer', traceId);
        },
      });
    } else {
      this.apiChangeRole('observer', traceId);
    }
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
ChangeRolePopoverView.initClass();
module.exports = ChangeRolePopoverView;
