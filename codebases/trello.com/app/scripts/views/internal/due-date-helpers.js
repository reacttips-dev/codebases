/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const moment = require('moment');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');

const firstLessThanOrEqualTo = function (n, dispatch) {
  for (const entry of Array.from(dispatch)) {
    if (_.isArray(entry)) {
      const [cutoff, val] = Array.from(entry);
      if (n <= cutoff) {
        return val;
      }
    } else {
      return entry;
    }
  }
  throw new Error(`no matching dispatch value for ${n}!`);
};

const makeDateDispatch = function ({ complete, incomplete }) {
  let dispatcher = null;
  return function (date, isComplete, now = Date.now()) {
    // Because the dispatch values might be localized, and we can't
    // synchronously evaluate localized keys, we delay this until we
    // actually request something.
    if (isComplete) {
      return complete();
    }
    if (dispatcher == null) {
      dispatcher = incomplete();
    }
    return firstLessThanOrEqualTo(
      moment(new Date(date)).diff(now, 'hours', true),
      dispatcher,
    );
  };
};

module.exports = {
  classForDueDate: makeDateDispatch({
    complete() {
      return 'is-due-complete';
    },
    incomplete() {
      return [
        [-36, 'is-due-past'],
        [0, 'is-due-now'],
        [24, 'is-due-soon'],
        'is-due-future',
      ];
    },
  }),
  titleForDueDate: makeDateDispatch({
    complete() {
      return l('badge.due.complete');
    },
    incomplete() {
      return [
        [-36, l('badge.due.overdue')],
        [0, l('badge.due.recently overdue')],
        [1, l('badge.due.less than an hour')],
        [24, l('badge.due.less than a day')],
        l('badge.due.later'),
      ];
    },
  }),
  relativeInfoForDueDate: makeDateDispatch({
    complete() {
      return l('badge.due.complete short');
    },
    incomplete() {
      return [
        [-36, l('badge.due.overdue short')],
        [0, l('badge.due.overdue short')],
        [24, l('badge.due.due soon short')],
        null,
      ];
    },
  }),
  relativeInforForStartDate: makeDateDispatch({
    incomplete() {
      return [[0, 'badge.start.past'], 'badge.start.future'];
    },
  }),
};
