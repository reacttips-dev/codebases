/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
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

const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/date_editor');
const moment = require('moment');
const { l } = require('app/scripts/lib/localize');

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

class DateEditorView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'edit date';
    this.prototype.tagName = 'form';
    this.prototype.className = 'dpicker-widget u-clearfix';

    this.prototype.events = {
      'click .js-remove-date': 'removeDueDate',
      'input .js-dpicker-time-input': 'validateTimeInput',
      'change .js-dpicker-time-input': 'normalizeTimeInput',
      submit(e) {
        e.preventDefault();
        return this.submitDueDate();
      },
    };

    this.prototype.vigor = this.VIGOR.NONE;
  }

  viewTitleArguments() {
    return { fieldName: this.options.customField.get('name') };
  }

  initialize() {
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

  submitDueDate() {
    const dueDateMoment = this.getSelectedDueDateMoment();
    if (dueDateMoment != null) {
      return this.setDueDate(dueDateMoment.toDate());
    } else {
      return this.removeDueDate();
    }
  }

  setDueDate(date) {
    DateEditorView.lastDueDate = date;

    this.options.trackSetDateEvent();

    if (this.options.customFieldItem != null) {
      this.options.customFieldItem.setValue({ date: date.toISOString() });
    } else {
      this.model.customFieldItemList.create({
        idCustomField: this.options.customField.id,
        idModel: this.model.id,
        modelType: 'card',
        value: {
          date: date.toISOString(),
        },
      });
    }
    return PopOver.hide();
  }

  removeDueDate() {
    if (this.options.customFieldItem) {
      this.options.trackSetDateEvent();

      this.options.customFieldItem.clearValue();
    }
    return PopOver.hide();
  }
  renderOnce() {
    let left;
    const customFieldItem =
      this.options.customFieldItem != null
        ? this.options.customFieldItem.toJSON()
        : undefined;
    const tomorrowAtNoon = moment()
      .startOf('day')
      .add(1, 'days')
      .hour(12)
      .toDate();
    const dueDate =
      (left =
        __guard__(
          customFieldItem != null ? customFieldItem.value : undefined,
          (x) => x.date,
        ) != null
          ? __guard__(
              customFieldItem != null ? customFieldItem.value : undefined,
              (x) => x.date,
            )
          : DateEditorView.lastDueDate) != null
        ? left
        : tomorrowAtNoon;

    this.$el.html(template({ canRemove: customFieldItem != null }));

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

      return this.$timeInput().val(moment(dueDate).format(timeFormat));
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
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
DateEditorView.initClass();
module.exports = DateEditorView;
