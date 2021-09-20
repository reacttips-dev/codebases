// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');

const { Util } = require('app/scripts/lib/util');
const Confirm = require('app/scripts/views/lib/confirm');

module.exports.openUnsubscribe = function (e) {
  Util.stop(e);

  Confirm.toggle('unwatch', {
    elem: $(e.target).closest('.js-board-header-subscribed')[0],
    model: this.model,
    confirmBtnClass: 'nch-button nch-button--danger',
    fxConfirm: (e) => {
      if (this.model.get('subscribed') === false) {
        return;
      }
      const traceId = Analytics.startTask({
        taskName: 'edit-board/subscribed',
        source: 'boardScreen',
      });

      return this.model.subscribeWithTracing(false, {
        taskName: 'edit-board/subscribed',
        source: 'boardScreen',
        traceId,
        next: (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'unsubscribed',
              actionSubject: 'board',
              source: 'boardScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      });
    },
  });
};
