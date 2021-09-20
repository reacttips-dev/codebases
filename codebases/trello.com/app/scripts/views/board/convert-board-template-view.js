// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');

const TEMPLATES_ALERT_TIMEOUT = 1000;

class ConvertToTemplateView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'make template';

    this.prototype.events = { 'submit form': 'convertToTemplate' };
  }

  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_convert_template'),
      ),
    );

    return this;
  }

  convertToTemplate(e) {
    Util.stop(e);
    this.$('.js-convert').prop('disabled');

    Alerts.show('converting', 'info', 'templates', TEMPLATES_ALERT_TIMEOUT);

    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/isTemplate',
      source: 'boardMenuDrawerMoreScreen',
    });
    this.model
      .setPrefWithTracing('isTemplate', true, {
        taskName: 'edit-board/prefs/isTemplate',
        source: 'boardMenuDrawerMoreScreen',
        traceId,
        next: (_err, board) => {
          if (board) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'prefs/isTemplate',
              source: 'boardMenuDrawerMoreScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model?.getOrganization()?.id,
                },
              },
            });
          }
        },
      })
      .save();
  }
}

ConvertToTemplateView.initClass();
module.exports = ConvertToTemplateView;
