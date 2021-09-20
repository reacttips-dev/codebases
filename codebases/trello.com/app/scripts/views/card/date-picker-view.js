/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { importWithRetry } = require('@trello/use-lazy-component');

const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const Alerts = require('app/scripts/views/lib/alerts');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/date_picker');
const { track, trackUe } = require('@trello/analytics');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const moment = require('moment');
const { TrelloStorage } = require('@trello/storage');
const { l } = require('app/scripts/lib/localize');
const { dontUpsell } = require('@trello/browser');

const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const CALENDAR_POWER_UP_ID = LegacyPowerUps.calendar;

const getPikadayStrings = () => ({
  previousMonth: l('prev month button text'),
  nextMonth: l('next month button text'),
  months: moment.months(),
  weekdays: moment.weekdays(),
  weekdaysShort: moment.weekdaysMin(),
});
const timeFormat = 'LT';
const parseFormat = [timeFormat, 'h:mm A'];
const isTimeStringValid = (string) => moment(string, parseFormat).isValid();

// values are in minutes for custom due date reminders
const customReminderSettings = () => [
  { name: 'no', text: l('due-date-custom-reminder.none'), value: -1 }, // no reminder
  {
    name: 'at time of due date',
    text: l('due-date-custom-reminder.at-time-of-due-date'),
    value: 0,
  }, // 0 minutes
  {
    name: '5 minutes before',
    text: l('due-date-custom-reminder.5-minutes-before'),
    value: 5,
  }, // 5 minutes
  {
    name: '10 minutes before',
    text: l('due-date-custom-reminder.10-minutes-before'),
    value: 10,
  }, // 10 minutes
  {
    name: '15 minutes before',
    text: l('due-date-custom-reminder.15-minutes-before'),
    value: 15,
  }, // 15 minutes
  {
    name: '1 hour before',
    text: l('due-date-custom-reminder.1-hour-before'),
    value: 60,
  }, // 1 hour
  {
    name: '2 hours before',
    text: l('due-date-custom-reminder.2-hours-before'),
    value: 2 * 60,
  }, // 2 hours
  {
    name: '1 day before',
    text: l('due-date-custom-reminder.1-day-before'),
    default: true,
    value: 24 * 60,
  }, // 1 day
  {
    name: '2 days before',
    text: l('due-date-custom-reminder.2-days-before'),
    value: 2 * 24 * 60,
  }, // 2 days
];

const defaultReminder = () =>
  customReminderSettings().find((reminder) => reminder.default).value;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class DatePickerView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change due date';
    this.prototype.tagName = 'form';
    this.prototype.className = 'dpicker-widget u-clearfix';

    this.prototype.events = {
      'click .js-remove-date': 'removeDueDate',
      'input .js-dpicker-time-input': 'validateTimeInput',
      'change .js-dpicker-time-input': 'normalizeTimeInput',
      'click a[href="/business-class"]'() {
        return track(
          'Card Detail',
          'Click Business Class Link',
          'Date Picker PopOver',
        );
      },
      submit: 'onSaveClickHandler',
      'click .js-enable-calendar-powerup'(e) {
        e.preventDefault();
        return this.enableCalendarPowerUp();
      },
    };

    this.prototype.vigor = this.VIGOR.NONE;
  }

  constructor(options) {
    super(options);
    this.setDueDate = this.setDueDate.bind(this);
    this.onSaveClickHandler = this.onSaveClickHandler.bind(this);
  }

  initialize() {
    this.listenTo(
      this.model.getBoard(),
      'change:powerUps',
      this.renderCalendarPowerUp,
    );
    this.trackViewed();
    return this.loadPikadayLibrary();
  }

  loadPikadayLibrary() {
    return this.pikadayLoadPromise != null
      ? this.pikadayLoadPromise
      : (this.pikadayLoadPromise = importWithRetry(() =>
          import(/* webpackChunkName: "pikaday" */ 'pikaday'),
        )
          .then((m) => m.default)
          .then((library) => {
            return (this.Pikaday = library);
          }));
  }

  getSelectedDueDateMoment() {
    const date = this.picker.getMoment();
    if (!date.isValid()) {
      return null;
    }

    // Pikaday requires a single date format, and will parse it strictly (which
    // is good). However, this means an entry like '2/14/15' will parse as
    // '02/14/0015', which isn't great.
    if (date.year() < 1000) {
      date.add(2000, 'years');
    }

    const time = this.selectedTimeMoment();
    return date.hour(time.hour()).minute(time.minute());
  }

  submitDueDate(dueDateMoment, reminder) {
    if (dueDateMoment != null) {
      return this.setDueDate(dueDateMoment.toDate(), reminder);
    } else {
      return this.removeDueDate();
    }
  }

  setDueDate(date, reminder) {
    this.trackSetDueDate(date, reminder);

    DatePickerView.lastDueDate = date;
    TrelloStorage.set(`lastDueDateReminder_${Auth.myId()}`, reminder);

    const previousDueDate = {
      due: __guard__(this.model.getDueDate(), (x) => x.getTime()) || null,
      dueReminder: this.model.get('dueReminder') || -1,
    };

    const newDueDate = { due: date.getTime(), dueReminder: reminder };

    const areDueDatesEqual =
      previousDueDate?.due === newDueDate.due &&
      previousDueDate?.dueReminder === newDueDate.dueReminder;

    if (!areDueDatesEqual) {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/due',
        source: 'datePickerInlineDialog',
      });

      const delta = {
        ...newDueDate,
        traceId,
      };

      this.model.setDueDate(delta, (err, card) => {
        if (err) {
          throw Analytics.taskFailed({
            taskName: 'edit-card/due',
            traceId,
            source: 'datePickerInlineDialog',
            error: err,
          });
        } else {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'due',
            source: 'datePickerInlineDialog',
            containers: {
              card: { id: card.id },
              board: { id: card.idBoard },
              list: { id: card.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });

          Analytics.taskSucceeded({
            taskName: 'edit-card/due',
            traceId,
            source: 'datePickerInlineDialog',
          });
        }
      });
    }

    PopOver.hide();
  }

  removeDueDate() {
    this.trackRemoveDueDate();

    if (this.model.get('due')) {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/due',
        source: 'datePickerInlineDialog',
      });
      this.model.setDueDate(
        { due: null, dueReminder: -1, traceId },
        (err, card) => {
          if (err) {
            throw Analytics.taskFailed({
              taskName: 'edit-card/due',
              traceId,
              source: 'datePickerInlineDialog',
              error: err,
            });
          } else {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'due',
              source: 'datePickerInlineDialog',
              containers: {
                card: { id: card.id },
                board: { id: card.idBoard },
                list: { id: card.idList },
              },
              attributes: {
                taskId: traceId,
              },
            });

            Analytics.taskSucceeded({
              taskName: 'edit-card/due',
              traceId,
              source: 'datePickerInlineDialog',
            });
          }
        },
      );
    }
    return PopOver.hide();
  }

  trackSetDueDate(date, reminder) {
    if (reminder == null) {
      reminder = defaultReminder();
    }
    const category = this.options.trackingCategory;
    const context = this.trackingContext();

    let prepObject = 'on card';
    const reminderName = customReminderSettings().find(
      (opt) => opt.value === reminder,
    ).name;
    prepObject = `with ${reminderName} custom notification`;

    const indObj =
      this.model.getDueDate() == null
        ? 'that did not have a due date'
        : __guard__(this.model.getDueDate(), (x) => x.getTime()) ===
          date.getTime()
        ? 'that had the same due date'
        : 'that had a different due date';

    trackUe(
      category,
      'saves',
      'due date',
      prepObject,
      indObj,
      'by clicking save button in the due date popover',
      context,
    );

    const board = this.model.getBoard();
    return Analytics.sendTrackEvent({
      action: 'set',
      actionSubject: 'dueDate',
      containers: {
        card: {
          id: this.model.id,
        },
        board: {
          id: board.id,
        },
        organization: {
          id: board.get('idOrganization'),
        },
      },
      source: 'datePickerInlineDialog',
      attributes: {
        trackingCategory: this.options.trackingCategory,
      },
    });
  }

  trackRemoveDueDate() {
    const category = this.options.trackingCategory;
    const context = this.trackingContext();

    trackUe(
      category,
      'removes',
      'due date',
      'from card',
      '',
      'by clicking remove button in the due date popover',
      context,
    );

    const board = this.model.getBoard();
    return Analytics.sendTrackEvent({
      action: 'removed',
      actionSubject: 'dueDate',
      containers: {
        card: {
          id: this.model.id,
        },
        board: {
          id: board.id,
        },
        organization: {
          id: board.get('idOrganization'),
        },
      },
      source: 'datePickerInlineDialog',
      attributes: {
        trackingCategory: this.options.trackingCategory,
      },
    });
  }

  trackViewed() {
    const board = this.model.getBoard();
    return Analytics.sendScreenEvent({
      name: 'datePickerInlineDialog',
      containers: {
        card: {
          id: this.model.id,
        },
        board: {
          id: board.id,
        },
        organization: {
          id: board.get('idOrganization'),
        },
      },
      attributes: {
        trackingCategory: this.options.trackingCategory,
      },
    });
  }

  trackingContext() {
    return {
      cardId: this.model.id,
      boardId: __guard__(this.model.getBoard(), (x) => x.id),
      teamId: __guard__(
        __guard__(this.model.getBoard(), (x2) => x2.getOrganization()),
        (x1) => x1.id,
      ),
    };
  }

  renderCalendarPowerUp() {
    const $show = this.$('.js-cal-enabled').addClass('hide');
    const $cal = this.$('.js-enable-cal').addClass('hide');

    const board = this.model.getBoard();
    const calendarEnabled = board.isPowerUpEnabled('calendar');
    const showCalendar = board.owned() && !calendarEnabled;

    if (calendarEnabled) {
      $show.removeClass('hide');
    } else if (showCalendar) {
      $cal.removeClass('hide');
    }
  }

  getSelectReminderSetting() {
    const dueReminder = this.model.get('dueReminder');
    const reminderSetting =
      dueReminder != null
        ? dueReminder
        : TrelloStorage.get(`lastDueDateReminder_${Auth.myId()}`);

    if (reminderSetting != null) {
      return reminderSetting;
    } else {
      return defaultReminder();
    }
  }
  renderOnce() {
    let left, left1;
    const board = this.model.getBoard();

    const defaultDueDate = moment().add(1, 'days').toDate();
    const dueDate =
      (left =
        (left1 = this.model.getDueDate()) != null
          ? left1
          : DatePickerView.lastDueDate) != null
        ? left
        : defaultDueDate;

    this.$el.html(
      template({
        canChangePowerUps: board.owned(),
        canEnableAdditionalPowerUps: board.canEnableAdditionalPowerUps(),
        upsellEnabled: !dontUpsell(),
        customReminderSettings: customReminderSettings(),
        selectedReminderSetting: this.getSelectReminderSetting(),
      }),
    );

    this.loadPikadayLibrary().then(() => {
      this.picker = new this.Pikaday({
        field: this.$('.js-dpicker-date-input')[0],
        container: this.$('.js-dpicker-cal')[0],
        bound: false,
        format: 'l',
        firstDay: moment.localeData().firstDayOfWeek(),
        i18n: getPikadayStrings(),
        keyboardInput: false,
      });

      this.picker.setDate(dueDate);

      this.$timeInput().val(moment(dueDate).format(timeFormat));

      return this.renderCalendarPowerUp();
    });

    return this;
  }

  validateTimeInput() {
    return this.$timeInput().toggleClass(
      'input-error',
      !this.isTimeInputValid(),
    );
  }

  normalizeTimeInput() {
    this.$timeInput().val(this.selectedTimeMoment().format(timeFormat));
    return this.validateTimeInput();
  }

  selectedTimeMoment() {
    if (this.isTimeInputValid()) {
      return moment(this.$timeInput().val(), parseFormat);
    } else {
      return moment().hours(12).minutes(0);
    }
  }

  $timeInput() {
    return this.$('.js-dpicker-time-input');
  }

  isTimeInputValid() {
    return isTimeStringValid(this.$timeInput().val());
  }

  enableCalendarPowerUp() {
    const powerUpAttributes = {
      pluginId: CALENDAR_POWER_UP_ID,
      pluginName: 'calendar',
      installSource: 'datePickerInlineDialog',
    };
    const traceId = Analytics.startTask({
      taskName: 'enable-plugin',
      source: 'datePickerInlineDialog',
    });
    this.model.getBoard().enablePluginWithTracing(CALENDAR_POWER_UP_ID, {
      traceId,
      taskName: 'enable-plugin',
      attributes: powerUpAttributes,
      source: 'datePickerInlineDialog',
      next: (err) => {
        if (err) {
          const errorMessage = err.serverMessage;
          Analytics.taskAborted({
            traceId,
            taskName: 'enable-plugin',
            source: 'datePickerInlineDialog',
            error: new Error(errorMessage),
          });

          const disableTraceId = Analytics.startTask({
            taskName: 'disable-plugin',
            source: 'datePickerInlineDialog',
            attributes: powerUpAttributes,
          });
          this.model.getBoard().disablePluginWithTracing(CALENDAR_POWER_UP_ID, {
            traceId: disableTraceId,
            taskName: 'disable-plugin',
            source: 'datePickerInlineDialog',
            attributes: powerUpAttributes,
            next: (err) => {
              if (!err) {
                sendPluginTrackEvent({
                  idPlugin: CALENDAR_POWER_UP_ID,
                  idBoard: this.model.getBoard()?.id,
                  event: {
                    action: 'disabled',
                    actionSubject: 'powerUp',
                    source: 'datePickerInlineDialog',
                  },
                  attributes: {
                    taskId: disableTraceId,
                  },
                });
              }
            },
          });

          if (errorMessage === 'PLUGIN_NOT_ALLOWED') {
            Alerts.show('plugin not allowed', 'error', 'addpluginerror', 4000);
          } else {
            Alerts.show(
              'could not add plugin',
              'error',
              'addpluginerror',
              2000,
            );
          }
        } else {
          sendPluginTrackEvent({
            idPlugin: CALENDAR_POWER_UP_ID,
            idBoard: this.model.getBoard()?.id,
            event: {
              action: 'added',
              actionSubject: 'powerUp',
              source: 'datePickerInlineDialog',
            },
            attributes: {
              taskId: traceId,
            },
          });
          track('Card Detail', 'Enable Calendar via Due Date Menu');
          trackUe(
            'card detail',
            'enables',
            'Power-Up',
            '',
            '',
            'due date',
            CALENDAR_POWER_UP_ID,
          );
        }
      },
    });
  }

  onSaveClickHandler(e) {
    e.preventDefault();
    const dueDateMoment = this.getSelectedDueDateMoment();
    const reminderVal = parseInt(this.$('.js-custom-reminder').val(), 10);
    const reminderInt = isNaN(reminderVal) ? defaultReminder() : reminderVal;
    return this.submitDueDate(dueDateMoment, reminderInt);
  }
}

DatePickerView.initClass();
module.exports = DatePickerView;
