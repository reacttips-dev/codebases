/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Label } = require('app/scripts/models/label');
const LabelEditComponent = require('app/scripts/views/label/label-edit-component');
const LabelLimitsErrorView = require('app/scripts/views/label/label-limits-error-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { Analytics } = require('@trello/atlassian-analytics');

class LabelCreateView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'create label';
  }

  el() {
    if (this.options.board.isOverLimit('labels', 'perBoard')) {
      return new LabelLimitsErrorView().render().el;
    }
    let { color } = this.options;
    let { name } = this.options;
    if (Array.from(Label.colors).includes(name)) {
      color = name;
      name = '';
    }
    return new LabelEditComponent({
      model: { name },
      submitTextKey: 'create',
      color,
      onSubmit: (name, color) => {
        if (this.options.board.isOverLimit('labels', 'perBoard')) {
          PopOver.pushView(new LabelLimitsErrorView());
          return;
        }
        if (typeof this.options.onSubmit === 'function') {
          const traceId = Analytics.startTask({
            taskName: 'create-label',
            source: 'labelCreateScreen',
          });

          const onAbort = (err) => {
            Analytics.taskAborted({
              taskName: 'create-label',
              source: 'labelCreateScreen',
              traceId,
              error: err,
            });
          };

          const onFail = (err) => {
            throw Analytics.taskFailed({
              taskName: 'create-label',
              source: 'labelCreateScreen',
              traceId,
              error: err,
            });
          };

          const onSuccess = () => {
            Analytics.sendTrackEvent({
              action: 'created',
              actionSubject: 'label',
              source: 'labelCreateScreen',
              containers: {
                board: {
                  id: this.options.board.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });

            Analytics.taskSucceeded({
              taskName: 'create-label',
              source: 'labelCreateScreen',
              traceId,
            });
          };

          this.options.onSubmit(
            name,
            color,
            traceId,
            onFail,
            onAbort,
            onSuccess,
          );
        }
        return PopOver.popView();
      },
    }).render().el;
  }
}

LabelCreateView.initClass();
module.exports = LabelCreateView;
