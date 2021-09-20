/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

const { TrelloStorage } = require('@trello/storage');

const warningTemplate = require('app/scripts/views/templates/board_header_warnings');
const { filterByKeys, sort } = require('app/scripts/lib/limits');
const { Util } = require('app/scripts/lib/util');

module.exports.renderBoardWarnings = function () {
  const $warnings = this.$('.js-board-warnings');

  const perBoardLimits = sort(
    filterByKeys(this.model.get('limits'), [
      'cards.openPerBoard',
      'cards.totalPerBoard',
      'checklists.perBoard',
      'labels.perBoard',
      'lists.openPerBoard',
      'lists.totalPerBoard',
      'attachments.perBoard',
    ]).filter((l) => l.status !== 'ok'),
  );
  const templateMap = {
    'cards.openPerBoard': 'open-cards-per-board-limit',
    'cards.totalPerBoard': 'total-cards-per-board-limit',
    'checklists.perBoard': 'checklists-per-board-limit',
    'labels.perBoard': 'labels-per-board-limit',
    'lists.openPerBoard': 'open-lists-per-board-limit',
    'lists.totalPerBoard': 'total-lists-per-board-limit',
    'attachments.perBoard': 'attachments-per-board-limit',
  };
  const isEditable = this.model.editable();
  const minDismiss = Util.dateBefore({ months: 6 });
  const warnings = perBoardLimits.map(function (limit) {
    const name = limit.key;
    const status = limit.status === 'warn' ? 'warn' : 'disabled';
    const key = `${templateMap[limit.key]}-${status}`;
    const test = () => isEditable;
    return [name, { key, test, minDismiss }];
  });

  const dismissWarningName = (name) => {
    return `BoardWarning-${name}-${this.model.id}`;
  };

  const warning = _.chain(warnings)
    .filter(function (...args) {
      const [name, { test, minDismiss }] = Array.from(args[0]);
      if (test()) {
        const dismissed = TrelloStorage.get(dismissWarningName(name));
        return !dismissed || dismissed < minDismiss;
      }
    })
    .map(function (...args) {
      const [name, { key }] = Array.from(args[0]);
      return { name, key, dismiss: dismissWarningName(name) };
    })
    .first()
    .value();

  _.chain(warnings)
    .filter(function (...args) {
      const [name, { test }] = Array.from(args[0]);
      return !test() && TrelloStorage.get(dismissWarningName(name)) != null;
    })
    .each(function (...args) {
      const [name] = Array.from(args[0]);
      return TrelloStorage.unset(dismissWarningName(name));
    })
    .value();

  if (warning) {
    $warnings.removeClass('hide').html(
      warningTemplate({
        canDismiss: TrelloStorage.isEnabled(),
        warning,
      }),
    );
  } else {
    $warnings.addClass('hide');
  }

  return this;
};
