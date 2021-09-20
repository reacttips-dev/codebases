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
const { importWithRetry } = require('@trello/use-lazy-component');

let PluginPopOverDateTimeView;
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const moment = require('moment');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const template = require('app/scripts/views/templates/plugin_date_picker');

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

module.exports = PluginPopOverDateTimeView = (function () {
  PluginPopOverDateTimeView = class PluginPopOverDateTimeView extends (
    PluginView
  ) {
    static initClass() {
      this.prototype.keepInDOM = true;

      this.prototype.vigor = this.VIGOR.NONE;
    }
    initialize({ title, content }) {
      this.title = title;
      this.content = content;
      this.retain(this.content);
      this.dateOnly = this.content.type === 'date';
      return this.loadPikadayLibrary();
    }

    loadPikadayLibrary() {
      return (
        this.pikadayLoadPromise ??
        (this.pikadayLoadPromise = importWithRetry(() =>
          import(/* webpackChunkName: "pikaday" */ 'pikaday'),
        )
          .then((m) => m.default)
          .then((library) => {
            return (this.Pikaday = library);
          }))
      );
    }

    getViewTitle() {
      return this.title;
    }

    events() {
      return {
        'click a[href]'(e) {
          return PopOver.hide();
        },
        'input .js-dpicker-time-input': 'validateTimeInput',
        'change .js-dpicker-time-input': 'normalizeTimeInput',
        'click input.nch-button.nch-button--primary'(e) {
          return this.pickDate(e);
        },
        submit(e) {
          e.preventDefault();
          return this.pickDate(e);
        },
      };
    }

    getSelectedDateMoment() {
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

    pickDate(e) {
      const dateMoment = this.getSelectedDateMoment();
      if (_.isFunction(this.content.callback)) {
        return this.content
          .callback({
            el: e.currentTarget,
            options: {
              date: dateMoment?.toISOString(),
            },
          })
          .catch((err) =>
            typeof console !== 'undefined' && console !== null
              ? console.warn(
                  `Error running Power-Up date picker callback function: ${err.message}`,
                )
              : undefined,
          );
      } else {
        return PopOver.popView();
      }
    }
    renderOnce() {
      const tomorrowAtNoon = moment()
        .startOf('day')
        .add(1, 'days')
        .hour(12)
        .toDate();
      let date = tomorrowAtNoon;
      if (
        _.isString(this.content.date) &&
        moment(this.content.date).isValid()
      ) {
        date = moment(this.content.date).toDate();
      }

      const minDate =
        _.isString(this.content.minDate) &&
        moment(this.content.minDate).isValid()
          ? moment(this.content.minDate).toDate()
          : undefined;
      const maxDate =
        _.isString(this.content.maxDate) &&
        moment(this.content.maxDate).isValid()
          ? moment(this.content.maxDate).toDate()
          : undefined;
      let yearRange = 10; // default behavior of Pikaday
      if (minDate || maxDate) {
        yearRange = [
          minDate ? minDate.getFullYear() : new Date().getFullYear() - 10,
          maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10,
        ];
      }

      this.$el.html(template({ dateOnly: this.dateOnly }));

      this.loadPikadayLibrary().then(() => {
        this.picker = new this.Pikaday({
          field: _.first(this.$('.js-dpicker-date-input')),
          container: _.first(this.$('.js-dpicker-cal')),
          bound: false,
          format: 'l',
          firstDay: moment.localeData().firstDayOfWeek(),
          i18n: getPikadayStrings(),
          keyboardInput: false,
          minDate,
          maxDate,
          yearRange,
        });

        this.picker.setDate(date);

        if (!this.dateOnly) {
          return this.$timeInput().val(moment(date).format(timeFormat));
        }
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
      if (this.dateOnly) {
        return moment().hours(0).minutes(0);
      } else if (this.isTimeInputValid()) {
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
  };
  PluginPopOverDateTimeView.initClass();
  return PluginPopOverDateTimeView;
})();
