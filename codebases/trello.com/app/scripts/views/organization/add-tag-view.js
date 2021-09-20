let AddTagView;
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const SetTagView = require('./set-tag-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { ApiError } = require('app/scripts/network/api-error');
const { showFlag } = require('@trello/nachos/experimental-flags');
const { l } = require('app/scripts/lib/localize');

module.exports = AddTagView = (function () {
  AddTagView = class AddTagView extends SetTagView {
    static initClass() {
      this.prototype.viewTitleKey = 'add tag';
    }
    onSubmit(name) {
      if (name) {
        const source = getScreenFromUrl();
        const traceId = Analytics.startTask({
          taskName: 'create-tag',
          source,
        });
        this.model.tagList.createWithTracing(
          { name },
          {
            wait: true,
            traceId,
            success: () => {
              const org = this.model;

              Analytics.sendTrackEvent({
                action: 'created',
                actionSubject: 'collection',
                source,
                attributes: {
                  taskId: traceId,
                  isBCFeature: true,
                  requiredBC: true,
                },
                containers: {
                  organization: { id: org.id },
                },
              });

              Analytics.taskSucceeded({
                taskName: 'create-tag',
                traceId,
                source,
              });
            },
            error: (_model, err) => {
              if (err instanceof ApiError.Conflict) {
                // They tried to re-use a name, let them know it's not valid
                showFlag({
                  id: 'edit-tag',
                  appearance: 'error',
                  title: l(
                    'alerts.there is already a collection with that name',
                  ),
                  msTimeout: 5000,
                });

                return Analytics.taskAborted({
                  taskName: 'create-tag',
                  traceId,
                  source,
                });
              } else {
                throw Analytics.taskFailed({
                  taskName: 'create-tag',
                  traceId,
                  source,
                  error: err,
                });
              }
            },
          },
        );

        PopOver.popView();
      }
    }
  };
  AddTagView.initClass();
  return AddTagView;
})();
