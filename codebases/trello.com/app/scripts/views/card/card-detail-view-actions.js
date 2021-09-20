/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const {
  Noun,
  Verb,
  track,
  trackUe,
  trackDebounced,
} = require('@trello/analytics');
const { Util } = require('app/scripts/lib/util');

const getFilteredActionsCount = function (model) {
  const showDetails = !Auth.isLoggedIn() || Auth.me().getShowDetails();
  const filteredActions = model.actionList.filter(function (action) {
    if (showDetails) {
      return true;
    } else {
      return action.isCommentLike();
    }
  });

  return filteredActions.length;
};

module.exports.getFilteredActionsCount = getFilteredActionsCount;

module.exports.showDetails = function (e) {
  Util.stop(e);
  Auth.me().setShowDetails(true);
  this.getData();
  return this.renderActionList();
};

module.exports.hideDetails = function (e) {
  Util.stop(e);
  Auth.me().setShowDetails(false);
  this.getData();
  return this.renderActionList();
};

module.exports.showAllActions = function (e) {
  this.fShowAllActions = true;
  this.renderShowAllActionsButton();
  return this.getData();
};

module.exports.renderShowAllActionsButton = function () {
  const isMoreToShow =
    getFilteredActionsCount(this.model) >= this.defaultActionLimit;
  const hideButton = this.fShowAllActions || !isMoreToShow;
  this.$('.js-show-all-actions').toggleClass('hide', hideButton);

  return this;
};

module.exports.renderActionList = function () {
  const showDetails = !Auth.isLoggedIn() || Auth.me().getShowDetails();
  this.actionListView.setShowDetails(showDetails);
  this.waitForId(this.model, () => this.actionListView.render());
  this.$('.js-show-details').toggleClass('hide', showDetails);
  this.$('.js-hide-details').toggleClass('hide', !showDetails);
  return this;
};

module.exports.renderSuggestedActions = function () {
  const canJoin = this.model.isValidSuggestion({ type: 'join' });
  const isOnBoardTemplate = this.model.isOnBoardTemplate();
  this.$('.js-suggested-actions').toggleClass(
    'hide',
    !canJoin || isOnBoardTemplate,
  );
  if (canJoin) {
    trackDebounced.hour('Suggestions', 'Card Detail', 'Displayed', 1);
  }
  return this;
};
