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
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/power_ups_calendar_prefs');

class CalendarSettingsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'calendar settings';

    this.prototype.events = {
      'click .js-calendar-pref-feed:not(.disabled)': 'selectFeedEnabled',
      'click .js-calendar-feed-url:not(:disabled)': 'focusInput',
      'click .js-regen-calendar-url:not(.disabled)': 'generateNewFeedURL',
    };
  }

  initialize() {
    this.generating = false;
    return this.listenTo(this.model, {
      'change:prefs': this.render,
      'change:myPrefs.calendarKey': this.generationComplete,
    });
  }

  generationComplete() {
    this.generating = false;
    return this.render();
  }

  generateNewFeedURL(e) {
    Util.stop(e);
    this.generating = true;
    this.model.generateCalendarKey();
    return this.render();
  }

  render() {
    const { prefs } = this.model.toJSON({ prefs: true });
    const key = this.model.getPref('calendarKey');
    const feedURL =
      `https://${location.host}/calendar/` +
      `${Auth.me().id}/${this.model.id}/${key}.ics`;

    if (!key) {
      this.generating = true;
      this.model.generateCalendarKey();
    }

    this.$el.html(
      template({
        isEnabled: prefs.calendarFeedEnabled,
        isGenerated: key != null && !this.generating,
        url: feedURL,
        canChange: this.model.editable(),
      }),
    );

    return this;
  }

  focusInput(e) {
    return this.$('.js-calendar-feed-url').focus().select();
  }

  selectFeedEnabled(e) {
    Util.stop(e);
    const $target = $(e.target).closest('a');
    const setting = $target.attr('name') === 'enabled';
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/calendar',
      source: 'calendarSettingsInlineDialog',
    });
    const previous = this.model.getPref('calendarFeedEnabled');

    return this.model.setPrefWithTracing('calendarFeedEnabled', setting, {
      taskName: 'edit-plugin/calendar',
      source: 'calendarSettingsInlineDialog',
      traceId,
      next: (err) => {
        if (!err) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'calendarFeedEnabledPref',
            source: 'calendarSettingsInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model?.getOrganization()?.id,
              },
            },
            attributes: {
              taskId: traceId,
              change: previous !== setting,
              previous,
            },
          });
        }
      },
    });
  }
}

CalendarSettingsView.initClass();
module.exports = CalendarSettingsView;
