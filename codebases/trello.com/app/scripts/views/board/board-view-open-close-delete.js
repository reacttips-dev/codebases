// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const ReopenBoardPopoverView = require('app/scripts/views/board/reopen-board-popover-view');
const Confirm = require('app/scripts/views/lib/confirm');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

module.exports.reopen = function (e) {
  Util.stop(e);
  const org = this.model.getOrganization();
  return this.model
    .getNewBillableGuests()
    .then(({ newBillableGuests, availableLicenseCount }) => {
      if (newBillableGuests.length > 0) {
        return PopOver.show({
          elem: this.$('.js-reopen'),
          view: new ReopenBoardPopoverView({
            board: this.model,
            org,
            newBillableGuests,
            availableLicenseCount,
          }),
        });
      } else {
        const traceId = Analytics.startTask({
          taskName: 'edit-board/closed',
          source: 'closedBoardScreen',
        });
        return this.model.reopen(
          { traceId },
          tracingCallback(
            {
              taskName: 'edit-board/closed',
              source: 'closedBoardScreen',
              traceId,
            },
            (err) => {
              if (!err) {
                Analytics.sendTrackEvent({
                  action: 'reopened',
                  actionSubject: 'board',
                  source: 'closedBoardScreen',
                  containers: {
                    board: {
                      id: this.model.id,
                    },
                    organization: {
                      id: this.model.getOrganization()?.id,
                    },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
            },
          ),
        );
      }
    });
};

module.exports._delete = function (e) {
  Util.stop(e);

  return Confirm.toggle('delete board', {
    elem: e.target,
    model: this.model,
    confirmBtnClass: 'nch-button nch-button--danger',
    fxConfirm: (e) => {
      const traceId = Analytics.startTask({
        taskName: 'delete-board',
        source: 'closedBoardScreen',
      });
      return this.model.startDelete(
        traceId,
        tracingCallback(
          {
            taskName: 'delete-board',
            source: 'closedBoardScreen',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendTrackEvent({
                action: 'deleted',
                actionSubject: 'board',
                source: 'closeBoardScreen',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                  organization: {
                    id: this.model.getOrganization()?.id,
                  },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
    },
  });
};
