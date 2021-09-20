/* eslint-disable
    default-case,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');

const { l } = require('app/scripts/lib/localize');
const template = require('app/scripts/views/templates/board_menu_about_this_board');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  BoardMenuViewsAndCopies,
} = require('app/src/components/BoardMenuViewsAndCopies/BoardMenuViewsAndCopies');

const AboutThisBoardAdminListView = require('app/scripts/views/board-menu/about-this-board-admin-list-view');
const DescriptionView = require('app/scripts/views/description/description-view');
const MemberMiniProfileView = require('app/scripts/views/member-menu-profile/member-mini-profile-view');
const MemberOnBoardView = require('app/scripts/views/member-menu-profile/member-on-board-view');
const SearchInputView = require('app/scripts/views/board-menu/search-input-view');
const {
  workspaceNavigationState,
} = require('app/src/components/WorkspaceNavigation');
const { Analytics } = require('@trello/atlassian-analytics');

const MAX_FACEPILE_SIZE = 5;

class BoardMenuAboutThisBoardView extends View {
  static initClass() {
    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-change-permissions': 'changePermissions',
      'click .js-fill-board-admin-count': 'openAllMembers',
    };
  }

  initialize({ sidebarView }) {
    this.sidebarView = sidebarView;
    super.initialize(...arguments);

    this.listenTo(this.model, {
      'change:memberships': this.renderDebounced,
      'change:prefs.voting': this.renderDebounced,
      'change:prefs.comments': this.renderDebounced,
      'change:desc': this.renderDebounced,
    });

    this.descView = this.subview(DescriptionView, this.model, {
      maxDescLength: 700,
      board: this.model,
      placeholderKey: this.getPlaceHolderText(),
      source: 'boardMenuDrawerAboutScreen',
    }); // for GAS analytics

    return this.makeDebouncedMethods('render');
  }

  getPlaceHolderText() {
    const isTemplate = this.model.isTemplate();
    const me = Auth.me();
    const isAdmin = this.model.ownedByMember(me);
    const isMember = this.model.isMember(me);

    // About this Template description for:
    if (isTemplate) {
      // 1. admin/s and/or member/s of the board
      if (isAdmin || isMember) {
        return 'about-this-template-description-admin';
        // 2. for visitors who:
        // a. Don't have a Trello account
        // b. Who have a Trello account but aren't members of the template
      } else {
        return 'about-this-template-description-visitor';
      }
    } else {
      // About this Board description JUST for admin/s and member/s
      // Board visitors don't get a description
      return 'its-your-boards-time-to-shine';
    }
  }

  getViewTitle() {
    if (this.model.isTemplate()) {
      return l(['view title', 'about-this-template']);
    } else {
      return l(['view title', 'about-this-board']);
    }
  }

  render() {
    const isPublicTemplate = this.model.isPublic() && this.model.isTemplate();
    if (isPublicTemplate) {
      workspaceNavigationState.setValue({ expanded: false });
    }
    const isLoggedIn = Auth.isLoggedIn();
    const me = Auth.me();

    const data = {};
    data.isLoggedIn = isLoggedIn;
    data.isAdmin = this.model.ownedByMember(me);
    data.isNonAdminMember = this.model.isMember(me) && !data.isAdmin;
    data.isTemplate = this.model.isTemplate();

    // Permissions data
    if (data.isAdmin) {
      // what users at all levels can see
      const commentLevel = this.model.getCommentPerm();
      const votingLevel = this.model.getPref('voting');
      data.canComment = commentLevel !== 'disabled';
      data.canVote = votingLevel !== 'disabled';
      data.commentHeader = this.getPermissionsLevelHeader(commentLevel);
      data.votingHeader = this.getPermissionsLevelHeader(votingLevel);
      data.permissionsHierarchy = this.getPermissionsHierarchy(
        commentLevel,
        votingLevel,
      );
    } else if (isLoggedIn) {
      // what you can see as a Trello member
      data.canComment = this.model.canComment(me);
      data.canVote = this.model.canVote(me);
    } else {
      // what logged-out users can see
      data.canComment = this.model.getCommentPerm() === 'public';
      data.canVote = this.model.getPref('voting') === 'public';
    }

    this.$el.html(template(data));

    const singleAdmin = this.model.adminList.length === 1;
    if (singleAdmin) {
      this.renderSingleAdminProfile();
    } else {
      this.renderAdminFacepile();
    }
    this.$('.about-this-board-multi-admin').toggleClass('hide', singleAdmin);
    this.$('.about-this-board-desc').toggleClass(
      'visitor-single-admin',
      singleAdmin && !data.isAdmin,
    );

    // the outer view is responsible for proving the placeholderkey
    // through the descView, which is now dynamic.
    this.descView.placeholderKey = this.getPlaceHolderText();
    this.appendSubview(this.descView, this.$('.js-fill-atb-desc'));
    this.renderSearchInputView();
    this.renderViewCopyCount();

    return this;
  }

  renderSingleAdminProfile() {
    const admin = this.model.adminList.models[0];
    const data = admin.toJSON();
    data.showEmail = false;
    data.isMe = admin === Auth.me();
    const $target = this.$('.js-made-by');

    const miniProfileSubview = this.subview(MemberMiniProfileView, admin);
    return this.ensureSubview(miniProfileSubview, $target);
  }

  renderAdminFacepile() {
    const $target = this.$('.js-made-by-facepile');
    const visibleAdmins = this.model.orderedVisibleAdmins();
    const numAdmins = visibleAdmins.length;
    const visibleAdminList = visibleAdmins.slice(0, MAX_FACEPILE_SIZE);
    const overflowAdminCount = numAdmins - MAX_FACEPILE_SIZE;

    if (overflowAdminCount > 0) {
      this.$('.js-fill-board-admin-count').text(`+${overflowAdminCount}`);
      this.$('.js-fill-board-admin-count').toggleClass(
        'pile',
        overflowAdminCount < 100,
      );
      this.$('.js-fill-board-admin-count').toggleClass(
        'pile-lg',
        overflowAdminCount >= 100,
      );
    } else {
      this.$('.js-fill-board-admin-count').text('');
    }

    const subviews = Array.from(visibleAdminList).map((admin) =>
      this.subview(MemberOnBoardView, admin, { board: this.model }),
    );

    if ($target.length) {
      return this.ensureSubviews(subviews, $target);
    }
  }

  openAllMembers(e) {
    Util.stop(e);
    // Migrating this event to a screen event in the subview
    Analytics.sendUIEvent({
      action: 'toggled',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'adminListInlineDialog',
      source: 'boardMenuDrawerAboutScreen',
      containers: {
        board: {
          id: this.model.id,
        },
        workspace: {
          id: this.model.getOrganization()?.id,
        },
        enterprise: {
          id: this.model.getEnterprise()?.id,
        },
      },
    });

    return PopOver.toggle({
      elem: this.$('.js-fill-board-admin-count'),
      maxWidth: 304,
      view: AboutThisBoardAdminListView,
      options: {
        model: this.model,
        modelCache: this.modelCache,
      },
    });
  }

  getPermissionsLevelHeader(level) {
    switch (level) {
      case 'members':
        return 'members-can';
      case 'observers':
        return 'members-and-observers-can';
      case 'org':
        return 'team-members-can';
      case 'public':
        return 'any-trello-user-can';
    }
  }

  getPermissionsHierarchy(commentLevel, votingLevel) {
    if (commentLevel === votingLevel) {
      return 'equal';
    } else if (commentLevel !== 'disabled' && votingLevel === 'disabled') {
      return 'comment';
    } else if (commentLevel === 'disabled' && votingLevel !== 'disabled') {
      return 'voting';
    } else {
      const hierarchy = ['members', 'observers', 'org', 'public'];
      if (hierarchy.indexOf(commentLevel) < hierarchy.indexOf(votingLevel)) {
        return 'comment';
      } else {
        return 'voting';
      }
    }
  }

  changePermissions(e) {
    Util.stop(e);
    this.sidebarView.pushView('settings');
  }

  showCardFilter(e) {
    Util.stop(e);
    this.sidebarView.pushView('filter');
  }

  renderSearchInputView() {
    // For visitors in template mode, card filter is shown
    const container = this.$('.js-search-input-view');

    if (container.length) {
      const subview = this.subview(SearchInputView, this.model.filter, {
        showCardFilter: this.showCardFilter.bind(this),
      });
      return this.appendSubview(subview, container);
    }
  }

  renderViewCopyCount() {
    renderComponent(
      <BoardMenuViewsAndCopies
        idBoard={this.model.id}
        isTemplate={this.model.isTemplate()}
        showLabels={false}
      />,
      this.$('.js-view-copy-count')[0],
    );

    return this;
  }
}

BoardMenuAboutThisBoardView.initClass();
module.exports = BoardMenuAboutThisBoardView;
