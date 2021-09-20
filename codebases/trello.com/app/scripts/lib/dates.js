/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Dates;
const $ = require('jquery');
const Backbone = require('@trello/backbone');
const { Time } = require('app/scripts/lib/time');
const _ = require('underscore');
const moment = require('moment');
const { l } = require('app/scripts/lib/localize');

module.exports.Dates = Dates = {
  objToDate(year, month, day) {
    if (_.isObject(year)) {
      ({ year, month, day } = year);
    }

    // in JS Dates, month is 0-indexed; day 1-indexed
    return new Date(year, month - 1, day);
  },

  dateToObj(date) {
    return {
      year: date.getFullYear(),
      // in JS Dates, month is 0-indexed; day 1-indexed
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  },

  getStartOfWeek(day) {
    return moment(day).startOf('week').toDate();
  },

  getEndOfWeek(day) {
    const end = moment(day).endOf('week');
    if (end.get('day') !== 6) {
      // We've hit https://github.com/moment/moment-timezone/issues/260, which
      // is currently unfixed
      end.add(-1, 'days').set('hour', 23);
    }
    return end.toDate();
  },

  getDaysOfWeek(date) {
    const start = moment(date).startOf('week');
    return [0, 1, 2, 3, 4, 5, 6].map((offset) =>
      start.clone().add(offset, 'days').toDate(),
    );
  },

  getMidnightInt(date) {
    return moment(date).startOf('day').valueOf();
  },

  getFirstOfMonth(date) {
    return moment(date).startOf('month').toDate();
  },

  getLastOfMonth(date) {
    return moment(date).endOf('month').toDate();
  },

  isFirstOfMonth(date) {
    return moment(date).isSame(moment(date).startOf('month'), 'day');
  },

  isLastOfMonth(date) {
    return moment(date).isSame(moment(date).endOf('month'), 'day');
  },

  getDateDeltaString(date, now) {
    date = moment(date);
    now = moment(now);

    if (date.isSame(now, 'day')) {
      if (Math.abs(now.diff(date, 'seconds')) < 10) {
        return l('just now');
      } else {
        return date.from(now);
      }
    } else {
      return date.calendar(now);
    }
  },

  // Will display "just now" for any dates in the future.
  getPastDateDeltaString(date, now) {
    if (moment(now).diff(date) < 0) {
      date = now;
    }
    return Dates.getDateDeltaString(date, now);
  },

  getDaysUntil(date) {
    date = moment(Dates.dateToObj(date));
    const now = moment(Dates.dateToObj(new Date()));
    return date.diff(now, 'days');
  },

  getDateWithSpecificTime(time, targetDate) {
    return new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
    );
  },

  update(context) {
    const now = new Date();

    const update = (selector, transform) =>
      $(context)
        .find(selector)
        .each(function (idx, elem) {
          let dateString;
          let date = $.data(elem, 'date') || elem.getAttribute('data-date');
          if (date == null) {
            date = Dates.parse(elem.getAttribute('dt'));
            date = Time.serverToClient(date);
            $.data(elem, 'date', date);
          }

          if (elem.classList.contains('past')) {
            dateString = Dates.getPastDateDeltaString(date, now);
          } else {
            dateString = Dates.getDateDeltaString(date, now);
          }
          return transform(elem, date, dateString);
        });
    update('.js-date-title[dt]', function (elem, date, dateString) {
      elem.setAttribute('title', dateString);
    });

    update('.date[dt], .date[data-date]', function (elem, date, dateString) {
      elem.innerText = dateString;
      if (!elem.hasAttribute('title')) {
        elem.setAttribute('title', moment(date).format('LLL'));
      }
    });
  },

  parse(s) {
    if (s == null) {
      s = '';
    }
    return moment(s).toDate();
  },

  // Return a date like May 11, 2014
  toDateString(date) {
    date = moment(new Date(date));
    const now = moment();

    // The reasoning here being that if it's Jan 11, and you're formatting a
    // date like Dec 21, you're going to assume it means the previous December,
    // not next December. If we do mean the upcoming (in 11 months) December,
    // we'll show the year.
    //
    // It's tricky to see if this logic is correct, but what we want to say is
    // that we want to hide the year when it's a date from this year, unless
    // the month is ambiguous.
    //
    // The month is ambiguous when it's more than nine months away from today --
    // which is to say that there's a month in a different year that's only
    // three months away.

    const isAmbiguousMonth = Math.abs(now.diff(date, 'months')) > 9;
    const hideYear = date.isSame(now, 'year') && !isAmbiguousMonth;

    // LLLL being the special overrided "Dec 21" type string, not what it is
    // by default in moment.js. See entry/set-date-locale.
    return date.format(hideYear ? 'llll' : 'll');
  },

  validDate(d) {
    return _.isDate(d) && !isNaN(d.getTime());
  },
};

_.extend(Dates, Backbone.Events);
