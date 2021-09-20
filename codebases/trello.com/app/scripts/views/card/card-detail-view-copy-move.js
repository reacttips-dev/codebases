// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { PopOver } = require('app/scripts/views/lib/pop-over');
const CardMoveView = require('app/scripts/views/card/card-move-view');
const { Util } = require('app/scripts/lib/util');
const { Auth } = require('app/scripts/db/auth');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');

// TODO: Remove feature flag after successful deploy according to https://trello.com/c/VGE8H3ka/392-remove-feature-flag-for-copy-cards-date-tbd
const CardCopyViewDeprecated = require('app/scripts/views/card/card-copy-view-deprecated');
const CardCopyViewUpdated = require('app/scripts/views/card/card-copy-view');
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports.openMoveMenu = function (elem) {
  PopOver.toggle({
    elem,
    view: CardMoveView,
    options: { model: this.model, modelCache: this.modelCache },
  });
};

module.exports.openMoveFromHeader = function (e) {
  Util.stop(e);
  this.openMoveMenu(this.$('.js-open-move-from-header'), 20);
  Analytics.sendClickedLinkEvent({
    linkName: 'listNameLink',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
};

module.exports.openMoveFromBadge = function (e) {
  Util.stop(e);
  this.openMoveMenu(this.$('.js-card-detail-list-badge-button'));
  Analytics.sendUIEvent({
    action: 'clicked',
    actionSubject: 'badge',
    actionSubjectId: 'cardListBadge',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
};

module.exports.moveCard = function (e) {
  Util.stop(e);
  this.openMoveMenu(this.$('.js-move-card'), 35);
  Analytics.sendClickedButtonEvent({
    buttonName: 'moveButton',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
};

module.exports.copyCard = function (e) {
  Util.stop(e);

  // TODO: Remove feature flag after successful deploy according to https://trello.com/c/VGE8H3ka/392-remove-feature-flag-for-copy-cards-date-tbd
  const isUpdatedCopyViewEnabled = featureFlagClient.get(
    'enterprise.allow-enterprise-users-to-copy-enterprise-cards',
    false,
  );
  const CardCopyView = isUpdatedCopyViewEnabled
    ? CardCopyViewUpdated
    : CardCopyViewDeprecated;

  PopOver.toggle({
    elem: this.$('.js-copy-card'),
    view: CardCopyView,
    options: { model: this.model, modelCache: this.modelCache },
  });
};

module.exports.renderCopyCard = function () {
  const hasBoards = _.any(
    Auth.me().boardList.models,
    (board) => !board.get('closed'),
  );
  return this.$('.js-copy-card').toggleClass('hide', !hasBoards);
};
