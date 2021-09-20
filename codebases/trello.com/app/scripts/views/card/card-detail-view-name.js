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
const { Analytics } = require('@trello/atlassian-analytics');
const {
  trackSeparator,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const { getKey, Key } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const { Controller } = require('app/scripts/controller');
const { removeAllRanges } = require('app/scripts/lib/util/removeAllRanges');
const { l } = require('app/scripts/lib/localize');

module.exports.saveCardName = function () {
  const $input = this.$('.js-card-detail-title-input:visible');
  let newValue = $input.val();
  const name = this.model.get('name');

  // remove whitespace
  newValue = newValue.replace(/\s+/g, ' ').trim();

  // if it's the same name, don't save
  if (newValue === name) {
    return;
  }

  // if it's too long, don't save
  if (newValue.length > 16384) {
    return;
  }

  // can't be empty.
  if (newValue.trim().length === 0) {
    return;
  }

  const traceId = Analytics.startTask({
    taskName: 'edit-card/name',
    source: 'cardDetailScreen',
  });

  this.model.recordAction({
    type: 'rename',
    name: newValue,
    previousName: name,
  });

  // We should handle the returned `err` someday…
  this.model.update({ name: newValue, traceId: traceId }, (err, card) => {
    if (err) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/name',
        traceId,
        source: 'cardDetailScreen',
        error: err,
      });
    } else {
      Analytics.sendUpdatedCardFieldEvent({
        field: 'name',
        source: 'cardDetailScreen',
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
        taskName: 'edit-card/name',
        traceId,
        source: 'cardDetailScreen',
      });
    }
  });

  trackSeparator(newValue, {
    category: 'card detail',
    method: 'by editing name',
  });
};

module.exports.nameKeyDownEvent = function (e) {
  if (getKey(e) === Key.Enter) {
    Util.stop(e); // prevents new lines
    this.saveNameEditing();
  }

  if (getKey(e) === Key.Escape) {
    Util.stop(e); // don't close the overlay…
    this.cancelNameEditing();
  }
};

module.exports.startNameEditing = function (options) {
  if (options == null) {
    options = {};
  }
  const $input = this.$('.js-card-detail-title-input:visible');

  if (!$input.hasClass('is-editing')) {
    $input.addClass('is-editing');

    if (options.focus) {
      $input.focus().select();
    }
  }
};

module.exports.saveNameEditing = function () {
  const $input = this.$('.js-card-detail-title-input:visible');
  if ($input.hasClass('is-editing')) {
    this.stopNameEditing();
    return this.saveCardName();
  }
};

module.exports.cancelNameEditing = function () {
  this.stopNameEditing();
  return this.renderName();
};

module.exports.stopNameEditing = function () {
  const $input = this.$('.js-card-detail-title-input:visible');
  if ($input.hasClass('is-editing') && $input.val().trim()) {
    $input.removeClass('is-editing');
    // We previously only blurred the $input if it looked like it had focus,
    // but this was problematic.
    //
    // If you switch tabs in Chrome by clicking on another tab and then come
    // back to this window, jquery will fire a `focusout` event, and we'd
    // end up in a state where the input still looked active even though
    // the edit had finished.
    $input.blur();
    removeAllRanges();
  }
};

module.exports.renderName = function () {
  const cardName = this.model.get('name');
  const boardName = this.model.getBoard().get('name');

  // Hidden helper for accessibility and printing.
  this.$('.js-title-helper').text(cardName);

  // Don't try and rerender while we're editing, we'll lose edits. Last
  // writer wins here.
  // We need to trigger a resize because the textarea won't resize for the
  // non-editing viewer.
  const $inputs = this.$('.js-card-detail-title-input');
  $inputs.each((index) => {
    const $input = this.$($inputs[index]);
    if (!$input.hasClass('is-editing')) {
      return $input.val(cardName).trigger('autosize.resize', false);
    }
  });

  // Controller.title needs a *string*, not HTML
  Controller.title(
    l('card detail title', { cardName, boardName }, { raw: true }),
  );
  return this;
};

module.exports.editTitle = function (e) {
  this.startNameEditing({ focus: true });
};
