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
const $ = require('jquery');
const Confirm = require('app/scripts/views/lib/confirm');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

class CustomBackgroundOptionsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'background options';

    this.prototype.events = {
      'click .js-delete-background': 'deleteBackground',
      'click .js-select-option': 'selectOption',
    };
  }

  initialize() {
    return this.listenTo(this.model, 'change', this.render);
  }

  render() {
    const data = this.model.toJSON();

    data.tile = this.model.get('tile');
    const brightness = this.model.get('brightness');
    data.brightnessLight = brightness === 'light';
    data.brightnessDark = brightness === 'dark';

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_background_options'),
        data,
      ),
    );

    return this;
  }

  selectOption(e) {
    const $option = $(e.target).closest('.js-select-option');

    const traceId = Analytics.startTask({
      taskName: 'edit-member/customBoardBackgrounds',
      source: 'boardMenuDrawerBackgroundScreen',
    });

    const data = { traceId };
    if ($option.attr('data-board-brightness') != null) {
      data.brightness = $option.attr('data-board-brightness');
    } else if ($option.attr('data-background-display-type') != null) {
      const selection = $option.attr('data-background-display-type');
      data.tile = selection === 'tile';
    }

    this.model.update(
      data,
      tracingCallback(
        {
          taskName: 'edit-member/customBoardBackgrounds',
          source: 'boardMenuDrawerBackgroundScreen',
          traceId,
        },
        (_err, response) => {
          if (response) {
            Analytics.sendTrackEvent({
              action: 'changed',
              actionSubject: 'background',
              source: 'boardMenuDrawerBackgroundScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
              },
              attributes: {
                taskId: traceId,
                brightness: data.brightness,
                tile: data.tile,
              },
            });
          }
        },
      ),
    );
  }

  deleteBackground(e) {
    Util.stop(e);
    return Confirm.pushView('delete background', {
      elem: $(e.target).closest('.js-delete-background'),
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: (e) => {
        const traceId = Analytics.startTask({
          taskName: 'delete-attachment/boardBackground',
          source: 'boardMenuDrawerBackgroundScreen',
        });
        this.model.destroyWithTracing(
          {
            traceId,
          },
          tracingCallback(
            {
              taskName: 'delete-attachment/boardBackground',
              source: 'boardMenuDrawerBackgroundScreen',
              traceId,
            },
            (_err, response) => {
              if (response) {
                Analytics.sendTrackEvent({
                  action: 'deleted',
                  actionSubject: 'background',
                  source: 'boardMenuDrawerBackgroundScreen',
                  containers: {
                    board: {
                      id: this.model.id,
                    },
                  },
                  attributes: {
                    backgroundType: 'custom',
                    taskId: traceId,
                  },
                });
              }
            },
          ),
        );
        this.remove();
      },
    });
  }
}

CustomBackgroundOptionsView.initClass();
module.exports = CustomBackgroundOptionsView;
