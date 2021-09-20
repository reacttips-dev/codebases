/* eslint-disable
    default-case,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Browser = require('@trello/browser');

const DragSort = require('app/scripts/views/lib/drag-sort');
const { Controller } = require('app/scripts/controller');
const { Auth } = require('app/scripts/db/auth');
const templates = require('app/scripts/views/internal/templates');
const { Util } = require('app/scripts/lib/util');

module.exports._applySettings = function () {
  if (this.options.settings == null) {
    return;
  }

  const { menu, filter } = this.options.settings;

  switch (menu) {
    case 'closed':
      this.model.viewState.setShowSidebar(false);
      break;
    case 'filter':
    case 'activity':
      this.sidebarViewPromise.then(() => {
        this.setSidebarShow();
        return this.sidebarView.pushView(menu);
      });
      break;
  }

  if (filter) {
    return this.model.filter.fromQueryString(filter);
  }
};

module.exports.renderOpen = function () {
  this.showSidebarOnOpen();

  const data = {};
  data.url = Controller.getBoardUrl(this.model);
  for (const preference of Array.from(
    this.model.prefNames.concat(this.model.myPrefNames),
  )) {
    data[`${preference}_${this.model.getPref(preference)}`] = true;
  }
  data.canJoin = this.model.canJoin();
  data.canInviteMembers = this.model.canInviteMembers();
  data.confirmed = Auth.me().get('confirmed');

  this.listListView.$el.detach();
  this.$el.html(
    templates.fillFromModel(
      require('app/scripts/views/templates/board'),
      this.model,
      {
        isCollapsedWorkspaceNav:
          this.workspaceNavState.enabled && !this.workspaceNavState.expanded,
      },
    ),
  );

  this.renderBoardHeader();
  this.renderBoardWarnings();
  this.renderBoardBackground();

  // this prevents the sidebar from animating in when first rendering.
  if (this.model.viewState.get('showSidebar')) {
    this.$el.addClass('is-show-menu');
  }

  this.sidebarViewPromise.then(() => {
    this.appendSubview(this.sidebarView, this.$('.js-fill-board-menu'));
    return this.renderSidebarState();
  });

  this.renderLists();
  this.renderInviteeOrientation();

  Controller.setLocation({ title: data.name });

  this.defer(() => {
    this.$('#board')
      .unbind('mousedown.dragscrollable')
      .dragscrollable({
        fxIgnore(event) {
          const boardEl = $(event.target).closest('#board');
          const isScrollbar = event.offsetY > boardEl.height() - 11;
          const isList = $(event.target).closest('.js-list-content').length > 0;
          const isListComposer =
            $(event.target).closest('.js-add-list').length > 0;
          return isScrollbar || isList || isListComposer;
        },
      });

    return DragSort.refreshListSortable();
  });
};

module.exports._shouldCloseBoardMenu = function () {
  const isNewBoard = new Date() - Util.idToDate(this.model.id) < 180000;

  // if a previous render of this board marked it as needing its menu closed,
  // keep it closed until the user opens it themselves
  return (
    this.shouldCloseBoardMenu ||
    // close the menu of the first board they ever load
    !Auth.me().isDismissed('close-menu-of-first-board') ||
    // close menu of first board ever created, which may not be the same as the
    // first board they ever load, because of invitations
    (isNewBoard && this.model.isFirstOwnedBoard())
  );
};

module.exports._isFirstBoardEverLoaded = function () {
  return (
    !Auth.me().isDismissed('close-menu-of-first-board') &&
    !this.model.isWelcomeBoard()
  );
};

module.exports._isGhostUsingInviteLink = function () {
  return Util.hasValidInviteTokenFor(this.model);
};

module.exports.removeSidebarDisplayTypes = function () {
  this.$el.removeClass('sidebar-display-wide');
};

module.exports.renderSidebarDisplayType = function () {
  const displayClass = this.model.viewState.getSidebarDisplayType();
  this.$el.addClass(displayClass);
};

module.exports.showSidebarOnOpen = function () {
  // Orient visitors to public boards if About This Board is enabled
  const fromPrefOrNotLoggedIn =
    this.model.viewState.getShowSidebarFromPref() ||
    Auth.me().get('notLoggedIn');
  const hasDesc = !!this.model.get('desc');
  const isMember = this.model.isMember(Auth.me());
  if (
    this.model.isPublic() &&
    !isMember &&
    hasDesc &&
    fromPrefOrNotLoggedIn &&
    !Browser.isTouch()
  ) {
    return this.model.viewState.set('showSidebar', true);
  } else if (this._shouldCloseBoardMenu() || Browser.isTouch()) {
    this.model.viewState.set('showSidebar', false);
    if (this._isFirstBoardEverLoaded() && !this._isGhostUsingInviteLink()) {
      this.shouldCloseBoardMenu = true;
      if (Auth.isLoggedIn()) {
        return Auth.me().dismiss('close-menu-of-first-board');
      }
    }
  } else {
    return this.model.viewState.setShowSidebarFromPref();
  }
};

module.exports.renderSidebarState = function () {
  this.renderSidebarDisplayType();

  if (this.model.viewState.get('showSidebar')) {
    this.showSidebar();
  } else {
    this.hideSidebar();
  }
};

module.exports.toggleSidebar = function () {
  return this.model.viewState.setShowSidebar(
    !this.model.viewState.get('showSidebar'),
  );
};

module.exports.setSidebarShow = function () {
  this.model.viewState.setShowSidebar(true);
  this.shouldCloseboardMenu = false;
};

module.exports.showSidebar = function () {
  this.renderSidebarDisplayType();
  // this hides team onboarding tooltip that shows after you dismiss
  // the popover, which we should just close when the sidebar opens
  this.unmountTeamOnboardingPupTooltip();

  // Hacky... the entire transition will be hidden if
  // there isn't a slight delay between unhiding and
  // enabling the transition class.
  clearTimeout(this._sidebarHideTimeout);
  this.$('.js-fill-board-menu').removeClass('hide');
  this.defer(() => {
    return this.$el.addClass('is-show-menu');
  });

  this.sidebarViewPromise.then(() => {
    return this.sidebarView.sendDrawerScreenEvent(
      this.sidebarView.topSidebarViewName(),
      'showSidebar',
    );
  });
};

module.exports.hideSidebar = function () {
  this.$el.removeClass('is-show-menu');
  clearTimeout(this._sidebarHideTimeout);
  // Even though the is-show-menu class moves the menu out of view, we want
  // to also *actually* hide it, so the browser doesn't does something weird
  // when the user does something like Ctrl+F for text that appears in the
  // sidebar.
  //
  // We're delaying the hide because we're giving the CSS transition time to
  // complete.  We could try to trigger off of the transitionEnd event but
  // that can be problematic (if another transition starts before the first
  // one finishes or doesn't happen at all because there isn't actually a
  // change in the property being transitioned)
  //
  // The timeout value we're using here isn't meant to match the length of the
  // transition, but hopefully it's longer than whatever the transition is,
  // but not so short that someone could reasonably hide the menu and then
  // Ctrl+F for something that was on it
  this._sidebarHideTimeout = this.setTimeout(() => {
    this.$('.js-fill-board-menu').addClass('hide');
  }, 250);
};
