/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ActionList } = require('app/scripts/models/collections/action-list');
const ActionListView = require('app/scripts/views/action/action-list-view');
const { Analytics } = require('@trello/atlassian-analytics');
const ViewWithActions = require('app/scripts/views/internal/view-with-actions');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const _ = require('underscore');

class BoardMenuActivityView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'activity';
    this.prototype.viewIcon = 'activity';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-show-all': 'showAll',
      'click .js-show-comments': 'showComments',
      'click .js-more-actions': 'loadMoreActions',
    };
  }

  initialize() {
    this.mode = 'all';

    ({ fullHistory: this.fullHistory } = this.options);
    if (this.fullHistory == null) {
      this.fullHistory = false;
    }

    this.actionListView = this.collectionSubview(
      ActionListView,
      new ActionList(this.getActions(), { modelCache: this.modelCache }),
      {
        renderOpts: {
          compact: !this.fullHistory,
          key: 'boardmenuactivity',
          context: this.model,
          source: 'boardMenuDrawerActivityScreen',
        },
      },
    );

    this.makeDebouncedMethods('renderMoreActionsLink');

    this.listenTo(this.modelCache, `add:Action:${this.model.id}`, () => {
      this.actionListView.collection.reset(this.getActions());
      return this.renderMoreActionsLinkDebounced();
    });

    this.listenTo(this.model.memberList, {
      'change:initials change:avatarUrl change:avatarSource change:fullName change:username': this
        .render,
    });

    this.loadMoreActions();
  }

  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_menu_activity'),
        this.model.toJSON(),
      ),
    );

    this.actionListView.setElement(this.$('.js-list-activity')[0]);
    this.renderActions();
    this.renderMode();

    return this;
  }

  renderActions() {
    this.actionListView.render();
    return this.renderMoreActionsLink();
  }

  renderMoreActionsLink() {
    this.$('.js-more-actions').toggle(this.hasMoreActions());
    return this;
  }

  renderMode() {
    this.$('.js-control-option').removeClass('is-active');

    if (this.mode === 'all') {
      this.$('.js-list-activity').removeClass('is-only-comments');
      this.$('.js-show-all').addClass('is-active');
    } else {
      this.$('.js-list-activity').addClass('is-only-comments');
      this.$('.js-show-comments').addClass('is-active');
    }

    return this;
  }

  showAll(e) {
    this.mode = 'all';
    this.renderMode();
    Analytics.sendClickedButtonEvent({
      buttonName: 'showAllActivityButton',
      source: 'boardMenuDrawerActivityScreen',
    });
  }

  showComments(e) {
    this.mode = 'comments';
    this.renderMode();
    Analytics.sendClickedButtonEvent({
      buttonName: 'showCommentsOnlyButton',
      source: 'boardMenuDrawerActivityScreen',
    });
  }
}
BoardMenuActivityView.initClass();

_.extend(BoardMenuActivityView.prototype, ViewWithActions);

module.exports = BoardMenuActivityView;
