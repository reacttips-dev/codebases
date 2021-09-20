/* eslint-disable
    eqeqeq,
    no-undef,
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
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const DragSort = require('app/scripts/views/lib/drag-sort');
const MemberOnBoardView = require('app/scripts/views/member-menu-profile/member-on-board-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { searchFilter } = require('app/scripts/lib/util/text/search-filter');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const boardAllMembersTemplate = require('app/scripts/views/templates/popover_board_header_all_members');
const BoardMemberAddMultipleView = require('app/scripts/views/board-menu/board-member-add-multiple-view');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardHeaderAllMembersView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'board members';

    this.prototype.events = {
      'input .js-search-board-member': 'onSearchEvent',
      'click .js-invite-to-board-link': 'renderInvitationLink',
    };
  }

  renderMembers(visibleMembers) {
    let member;
    if (visibleMembers == null) {
      visibleMembers = this.model.orderedVisibleMembers();
    }
    const newInviteesIds = _.pluck(this.options.newInvitees, 'id');
    const hasOrg = this.model.get('idOrganization') != null;
    const org = this.model.getOrganization();

    const me = Auth.me();
    const isAffiliated =
      this.model.isMember(me) ||
      this.model.isObserver(me) ||
      (org != null ? org.isMember(me) : undefined);

    const groups = isAffiliated
      ? _.groupBy(visibleMembers, (member) => {
          const membership = this.model.getMembershipFor(member);

          if (Array.from(newInviteesIds).includes(member.id)) {
            return 'recentlyJoined';
          } else if (this.model.isVirtual(member)) {
            return 'invited';
          } else if (membership == null) {
            return 'other';
          } else if (membership.deactivated) {
            return 'deactivated';
          } else if (membership.memberType === 'observer') {
            return 'observer';
          } else if (
            membership.orgMemberType != null ||
            (org != null ? org.getMembershipFor(member) : undefined) != null
          ) {
            return 'team';
          } else if (!hasOrg) {
            return 'member';
          } else {
            return 'other';
          }
        })
      : // If we're not affiliated with the board/team (e.g. it's a public board)
        // then we don't need to differentiate between the different sorts of
        // members
        {
          member: _.filter(visibleMembers, (member) => {
            const membership = this.model.getMembershipFor(member);
            return (
              !membership.deactivated && membership.memberType !== 'observer'
            );
          }),
        };

    const memberGroups = [
      { selector: '.js-list-members', list: groups.member },
      { selector: '.js-list-team-members', list: groups.team },
      {
        selector: '.js-list-recently-joined-members',
        list: groups.recentlyJoined,
      },
      { selector: '.js-list-invited-members', list: groups.invited },
      { selector: '.js-list-guests', list: groups.other },
      { selector: '.js-list-observers', list: groups.observer },
      { selector: '.js-deactivated-members', list: groups.deactivated },
    ];

    const hideHeadings =
      _.keys(groups).length === 1 &&
      (groups.member != null || groups.team != null);
    const rowMax = 8;

    for (const { selector, list = [] } of Array.from(memberGroups)) {
      const $section = this.$(selector);
      const $list = $section.find('.js-list');
      const $heading = $section.find('.js-heading');

      $section.toggleClass('is-hidden', list.length === 0);
      $heading.toggleClass('is-hidden', hideHeadings);
      $section.toggleClass('is-partial-row', list.length < rowMax);

      const subviews = (() => {
        const result = [];
        for (member of Array.from(list)) {
          result.push(
            this.subview(MemberOnBoardView, member, {
              board: this.model,
              pushView: true,
            }),
          );
        }
        return result;
      })();

      if ($list.length) {
        this.ensureSubviews(subviews, $list);
      }
    }

    return this.defer(() => DragSort.refreshDraggableSidebarMembers());
  }

  filterMembersResult(term) {
    const satisfiesSearch = searchFilter(term);

    return _.filter(this.model.orderedVisibleMembers(), (member) => {
      return satisfiesSearch(Util.getMemNameArray(member));
    });
  }

  onSearchEvent(e) {
    this.memberSearch = this.$('.js-search-board-member').val().trim();

    const membersToRender = this.memberSearch
      ? this.filterMembersResult(this.memberSearch)
      : this.model.orderedVisibleMembers();

    this.$('.js-invite-no-results').toggleClass(
      'hide',
      membersToRender.length !== 0,
    );
    return this.renderMembers(membersToRender);
  }

  renderInvitationLink(e) {
    Util.stop(e);
    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToBoardLink',
      source: 'allBoardMembersInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
    });

    const view = new BoardMemberAddMultipleView({
      model: this.model,
      modelCache: this.modelCache,
    });
    view.loadOrgData();

    PopOver.toggle({
      elem: $('.js-open-manage-board-members'),
      view,
    });
  }

  render() {
    const data = {
      canAssign: this.model.editable(),
      showInviteLink: this.model.canInviteMembers(),
    };

    this.$el.html(boardAllMembersTemplate(data));

    this.renderMembers();

    Analytics.sendScreenEvent({
      name: 'allBoardMembersInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
      attributes: {
        numMembers: this.model.orderedVisibleMembers().length,
      },
    });

    return this;
  }
}

BoardHeaderAllMembersView.initClass();
module.exports = BoardHeaderAllMembersView;
