/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const removeById = require('app/scripts/lib/util/array/remove-by-id');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const xtend = require('xtend');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

// Mixin for models that have memberships
module.exports.MembershipModel = {
  orderedVisibleAdmins() {
    return this.adminList
      .sortBy((member) => {
        const prefix = Auth.isMe(member)
          ? // The current user is always first in the list
            '0'
          : this.isDeactivated(member)
          ? // Deactivated users always come last
            '4'
          : this.isVirtual(member)
          ? '3'
          : this.getMemberType(member) === 'admin'
          ? // Admins toward the front
            '1'
          : '2';

        return (
          prefix +
          __guard__(member.get('fullName'), (x) => x.toLocaleLowerCase())
        );
      })
      .filter((member) => {
        return !this.isDeactivated(member) || this.canSeeDeactivated(Auth.me());
      });
  },

  orderedVisibleMembers() {
    return this.memberList
      .sortBy((member) => {
        const prefix = Auth.isMe(member)
          ? // The current user is always first in the list
            '0'
          : this.isDeactivated(member)
          ? // Deactivated users always come last
            '4'
          : this.isVirtual(member)
          ? '3'
          : this.getMemberType(member) === 'admin'
          ? // Admins toward the front
            '1'
          : '2';

        return (
          prefix +
          __guard__(member.get('fullName'), (x) => x.toLocaleLowerCase())
        );
      })
      .filter((member) => {
        return !this.isDeactivated(member) || this.canSeeDeactivated(Auth.me());
      });
  },

  getMemberType(member, opts) {
    let memberType;
    if (opts == null) {
      opts = {};
    }
    const { ignoreEntAdminStatus } = opts;
    if (
      !ignoreEntAdminStatus &&
      __guard__(
        typeof this.getEnterprise === 'function'
          ? this.getEnterprise()
          : undefined,
        (x) => x.isAdmin(member),
      )
    ) {
      memberType = 'admin';
    } else if (
      __guard__(
        typeof this.getOrganization === 'function'
          ? this.getOrganization()
          : undefined,
        (x1) => x1.isPremOrgAdmin(member),
      )
    ) {
      memberType = 'admin';
    } else {
      memberType = this.getExplicitMemberType(member);
    }

    if (
      memberType !== 'public' &&
      (typeof this.isVirtual === 'function'
        ? this.isVirtual(member)
        : undefined)
    ) {
      memberType = 'virtual';
    }

    return memberType;
  },

  _refreshMemberships() {
    return this._memberships.update(this.get('memberships'));
  },

  _getMembershipFor(member) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const {
      MembershipList,
    } = require('app/scripts/models/collections/membership-list');

    if (!this._memberships) {
      this._memberships = new MembershipList();
      this._refreshMemberships();

      this.listenTo(this, 'change:memberships', this._refreshMemberships);
    }

    return this._memberships.getMember(member);
  },

  getMembershipFor(member) {
    // Much of the underlying code expects a basic object, and not a model. This
    // is something we can change in the future by moving more methods on to the
    // membership model.
    return __guard__(this._getMembershipFor(member), (x) => x.toJSON());
  },

  hasActiveMembership(member) {
    return (
      this._getMembershipFor(member) != null && !this.isDeactivated(member)
    );
  },

  isMember(member) {
    let needle;
    return (
      (needle = this.getMemberType(member)),
      ['virtual', 'normal', 'admin'].includes(needle)
    );
  },

  isVirtual(member) {
    return (member != null ? member.get('memberType') : undefined) === 'ghost';
  },

  isDeactivated(member) {
    return (
      __guard__(this._getMembershipFor(member), (x) => x.get('deactivated')) ===
      true
    );
  },

  isUnconfirmed(member) {
    return (
      __guard__(this._getMembershipFor(member), (x) => x.get('unconfirmed')) ===
      true
    );
  },

  isObserver(member) {
    return this.getExplicitMemberType(member) === 'observer';
  },

  isPremOrgAdmin(memberOrId) {
    // 'memberOrId' can be a member or just an id here, hence the extra checks
    // This is true for many of the methods in this file. Presumably this
    // is so we can handle deleted members properly. Item to clean
    // this up on card https://trello.com/c/jB0cQJPR

    let left;
    if (_.isString(memberOrId)) {
      memberOrId = this.modelCache.get('Member', memberOrId);
    }

    const idPremOrgsAdmin =
      (left = __guardMethod__(memberOrId, 'get', (o) =>
        o.get('idPremOrgsAdmin'),
      )) != null
        ? left
        : [];

    const idOrganization = this.getOrganization
      ? __guard__(this.getOrganization(), (x) => x.id)
      : this.id;

    return Array.from(idPremOrgsAdmin).includes(idOrganization);
  },

  getExplicitMemberType(member) {
    let membership;
    if (this.isDeactivated(member)) {
      return 'deactivated';
    } else if (this.isUnconfirmed(member)) {
      return 'unconfirmed';
    } else if ((membership = this._getMembershipFor(member))) {
      return membership.get('memberType');
    } else if (
      __guard__(
        typeof this.getOrganization === 'function'
          ? this.getOrganization()
          : undefined,
        (x) => x.isMember(member),
      )
    ) {
      return 'org';
    } else {
      return 'public';
    }
  },

  canSeeDeactivated(member) {
    return (
      this.isMember(member) ||
      (member.organizationList != null
        ? member.organizationList.get(
            __guard__(this.getOrganization(), (x) => x.id),
          )
        : undefined)
    );
  },

  addMembership(membership) {
    const newMemberships =
      this.get('memberships') != null ? _.clone(this.get('memberships')) : [];
    newMemberships.push(membership);
    return this.set('memberships', newMemberships);
  },

  _removeFromMembershipsAttribute(membership) {
    if (!this.get('memberships')) {
      return;
    }

    return this.set(
      'memberships',
      removeById(this.get('memberships'), membership),
    );
  },

  removeMembership(membership) {
    this._memberships.remove(membership);
    return this._removeFromMembershipsAttribute(membership);
  },

  setOnMembership(member, attrs) {
    return this.set({
      memberships: this.get('memberships').map(function (membership) {
        if (membership.idMember === member.id) {
          return xtend(membership, attrs);
        } else {
          return membership;
        }
      }),
    });
  },

  toggleMemberHidden(member, opts) {
    return ApiPromise({
      url: `/1/${this.typeName.toLowerCase()}/${
        this.id
      }/hiddenGoogleAppsMembers`,
      type: opts.type,
      data: {
        gMail: member.get('gMail'),
      },
    });
  },

  addMemberRole(opts) {
    return ApiPromise({
      type: 'PUT',
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members`,
      data: opts,
    }).then(function () {
      return Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'member',
        source: 'inviteToBoardInlineDialog',
        attributes: {
          role: opts.type,
        },
        containers: {
          organization: {
            id: this.id,
          },
        },
      });
    });
  },
};
