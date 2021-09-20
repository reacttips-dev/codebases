/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let LabelEditView;
const Confirm = require('app/scripts/views/lib/confirm');
const LabelEditComponent = require('app/scripts/views/label/label-edit-component');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { l } = require('app/scripts/lib/localize');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports = LabelEditView = (function () {
  let DeleteButtonComponent = undefined;
  LabelEditView = class LabelEditView extends View {
    static initClass() {
      DeleteButtonComponent = class DeleteButtonComponent extends View {
        static initClass() {
          this.prototype.tagName = 'input';
          this.prototype.className = 'nch-button nch-button--danger';
          this.prototype.events = {
            click(e) {
              Util.stop(e);
              return this.options.onClick();
            },
          };
        }
        attributes() {
          return {
            type: 'submit',
            value: l('delete'),
          };
        }
      };
      DeleteButtonComponent.initClass();

      this.prototype.viewTitleKey = 'change label';
    }

    initialize() {
      return (this.sendGASEvent = featureFlagClient.get(
        'dataeng.gasv3-event-tracking',
        false,
      ));
    }

    el() {
      return new LabelEditComponent({
        model: this.model.toJSON(),
        submitTextKey: 'save',
        onSubmit: (name, color) => {
          const traceId = Analytics.startTask({
            taskName: 'edit-label',
            source: 'labelEditScreen',
          });

          this.model.update(
            { color, name, traceId },
            tracingCallback(
              {
                taskName: 'edit-label',
                source: 'labelEditScreen',
                traceId,
              },
              (err) => {
                if (!err) {
                  Analytics.sendTrackEvent({
                    action: 'updated',
                    actionSubject: 'label',
                    source: 'labelEditScreen',
                    containers: {
                      board: {
                        id: this.model.getBoard().id,
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
          if (typeof this.options.onSubmit === 'function') {
            this.options.onSubmit();
          }
          return PopOver.popView();
        },
        color: this.model.get('color'),
        accessoryView: new DeleteButtonComponent({
          onClick: this.confirmDeleteLabel.bind(this),
        }),
      }).render().el;
    }

    confirmDeleteLabel() {
      return Confirm.pushView('delete label', {
        model: this.model,
        confirmBtnClass: 'nch-button nch-button--danger',
        popOnClick: true,
        // We want to pop TWICE to get out of the parent popup
        popDepth: 2,
        fxConfirm: (e) => {
          const traceId = Analytics.startTask({
            taskName: 'delete-label',
            source: 'labelEditScreen',
          });

          this.model.destroyWithTracing(
            { traceId },
            tracingCallback({
              taskName: 'delete-label',
              source: 'labelEditScreen',
              traceId,
            }),
          );
          if (typeof this.options.onSubmit === 'function') {
            this.options.onSubmit();
          }

          return Analytics.sendTrackEvent({
            action: 'deleted',
            actionSubject: 'label',
            source: 'labelEditScreen',
            containers: {
              board: {
                id: this.model.getBoard().id,
              },
            },
            attributes: {
              taskId: traceId,
            },
          });
        },
      });
    }
  };
  LabelEditView.initClass();
  return LabelEditView;
})();
