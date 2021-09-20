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
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { ApiError } = require('app/scripts/network/api-error');
const { Auth } = require('app/scripts/db/auth');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Member } = require('app/scripts/models/member');
const { featureFlagClient } = require('@trello/feature-flag-client');

class MemberList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Member;
    this.prototype.sortField = 'fullName';
  }

  idList() {
    return this.pluck('id');
  }

  removeMembershipWithTracing(member, options, next) {
    this.remove(member);
    const traceId = options.traceId;

    if (!this.sourceModel) {
      if (featureFlagClient.get('dataeng.edit-board-dropped-tasks', false)) {
        next(new Error('sourceModel is not defined'));
      }
      return;
    }

    let route = options?.invite
      ? `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/ghost/${member.id}`
      : `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/members/${member.id}`;
    if (options?.mass) {
      route += '/all';
    }

    return ApiAjax({
      traceId,
      url: route,
      type: 'delete',
      success: (resp) => {
        //The original method contained an early return for the server returning {unreadable: true}
        //when the member removal resulted in the viewing user to lose view permissions. For the board
        //case, the early return did not appear to do anything, so I removed it. If we start seeing
        //uncaught errors, we may want to add "if(resp.unreadable){next(null, resp) return}". If there's
        //no difference with the other models or in error states, please remove this comment when you deprecate
        //the removeMembership method.
        next(null, resp);
      },
      error: (xhr) => {
        const errorMessage = ApiError.parseErrorMessage(xhr);
        const error = ApiError.fromResponse(xhr.status, errorMessage);
        next(error);
      },
    });
  }

  removeMembership(member, options) {
    this.remove(member);

    if (!this.sourceModel) {
      return;
    }

    let route = options?.invite
      ? `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/ghost/${member.id}`
      : `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/members/${member.id}`;
    if (options?.mass) {
      route += '/all';
    }
    return ApiAjax({
      url: route,
      type: 'delete',
      success(resp) {
        // If removing a member would make the member lose view perms for the model, the
        // server sends a 200 with a response of {unreadable:true}. This workaround
        // was put in place to not treat this as response as successful, but it's unclear
        // if that is still needed. I am leaving it intact for now, but when we port this
        // method entirely to removeMembershipWithTracing, we should test if this is
        // necessary to do for org and enterprise. On board, returning here doesn't appear to
        // do anything and complicates tracing.
        if (resp?.unreadable) {
          return;
        }
        return options?.success?.();
      },
    });
  }

  // Returns a new member list without members that you shouldn't be able to see
  // The force option excludes deactivated members, even if you're allowed to
  // see them
  filterDeactivated(param = {}) {
    let { model, force } = param;
    if (!model) {
      model = this.sourceModel;
    }
    if (!force) {
      force = false;
    }
    // We don't want to always use @options.model, since that could be a card and
    // we want to reference the membership model (board in that case)
    // force allows you to forget whether the user can see them or not
    const me = Auth.me();
    return new MemberList(
      this.filter(
        (member) =>
          // Make sure the member is on the model since you could somehow be on a
          // card without being on the board (since removal was broken for some
          // time), and we don't want to hide that member while they wonder why
          // they're getting updates.
          model.hasActiveMembership(member) ||
          (!force &&
            model.isDeactivated(member) &&
            model.canSeeDeactivated(me)),

        this.options,
      ),
    );
  }

  comparator(member) {
    return member.get(this.sortField)?.toLocaleLowerCase();
  }
}
MemberList.initClass();

module.exports.MemberList = MemberList;
