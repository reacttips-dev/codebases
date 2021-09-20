// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ActionList } = require('app/scripts/models/collections/action-list');
const ActionListView = require('app/scripts/views/action/action-list-view');
const Payloads = require('app/scripts/network/payloads').default;
const ViewWithActions = require('app/scripts/views/internal/view-with-actions');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const _ = require('underscore');

class MemberBoardProfileView extends View {
  static initClass() {
    this.prototype.events = { 'click .js-more-actions': 'loadMoreActions' };
  }

  initialize() {
    this.board = this.options.board;
    this.listenTo(
      this.board.memberList,
      'add remove reset',
      this.frameDebounce(this.render),
    );

    this.actionListView = this.collectionSubview(
      ActionListView,
      new ActionList(this.model.getActions(this.board), {
        modelCache: this.modelCache,
      }),
      {
        renderOpts: {
          context: this.model,
          readOnly: true,
          source: 'boardScreen',
        },
      },
    );

    this.listenTo(
      this.modelCache,
      `add:Action:${this.model.id} remove:Action:${this.model.id}`,
      () => {
        this.actionListView.collection.reset(
          this.model.getActions(this.board),
          { silent: true },
        );
        return this.renderActions();
      },
    );

    this.idModels = [this.board.id];
    this.nextPage = 0;
    return this.loadMoreActions();
  }

  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_member_profile'),
        this.model.toJSON(),
      ),
    );
    this.actionListView.setElement(this.$('.list-actions')[0]);
    return this.renderActions();
  }

  renderActions() {
    this.actionListView.render();
    this.$('.js-more-actions').toggle(this.hasMoreActions());
    return this;
  }

  getActionsFilter() {
    return Payloads.memberActions;
  }
}
MemberBoardProfileView.initClass();

_.extend(MemberBoardProfileView.prototype, ViewWithActions);

module.exports = MemberBoardProfileView;
