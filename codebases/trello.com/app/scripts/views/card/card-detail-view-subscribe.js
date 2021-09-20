// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const cardDetailToggleButtonTemplate = require('app/scripts/views/templates/card_detail_toggle_button');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.renderSubscribe = function () {
  const $subscribeSidebar = this.$('.js-subscribe-sidebar-button');
  const subscribed =
    this.model.get('subscribed') ||
    __guard__(this.model.get('badges'), (x) => x.subscribed);
  const title = subscribed ? 'unwatch-the-card' : 'watch-the-card';

  $subscribeSidebar.next('.toggle-button').remove();
  $subscribeSidebar.after(
    cardDetailToggleButtonTemplate({
      isOn: subscribed,
      text: 'watch',
      title: title,
      icon: 'subscribe',
      selectorOn: 'js-unsubscribe',
      selectorOff: 'js-subscribe',
    }),
  );

  this.$('.js-subscribed-indicator-header').toggleClass('hide', !subscribed);

  return this;
};

module.exports.subscribeToCard = function (e) {
  const traceId = Analytics.startTask({
    taskName: 'edit-card/subscribed',
    source: 'cardDetailScreen',
  });
  this.model.subscribeWithTracing(
    true,
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/subscribed',
        source: 'cardDetailScreen',
        traceId,
      },
      (_err, response) => {
        if (response) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'subscribed',
            source: 'cardDetailScreen',
            containers: {
              card: { id: response.id },
              board: { id: response.idBoard },
              list: { id: response.idList },
            },
            attributes: {
              taskId: traceId,
              value: true,
            },
          });
        }
      },
    ),
  );
  this.renderCommentSubmitAbility();
  return false;
};

module.exports.unsubscribeFromCard = function (e) {
  const traceId = Analytics.startTask({
    taskName: 'edit-card/subscribed',
    source: 'cardDetailScreen',
  });
  this.model.subscribeWithTracing(
    false,
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/subscribed',
        source: 'cardDetailScreen',
        traceId,
      },
      (_err, response) => {
        if (response) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'subscribed',
            source: 'cardDetailScreen',
            containers: {
              card: { id: response.id },
              board: { id: response.idBoard },
              list: { id: response.idList },
            },
            attributes: {
              taskId: traceId,
              value: false,
            },
          });
        }
      },
    ),
  );
  this.renderCommentSubmitAbility();
  return false;
};
