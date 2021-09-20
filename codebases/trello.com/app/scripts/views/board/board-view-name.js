// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { getKey, Key } = require('@trello/keybindings');

const { Util } = require('app/scripts/lib/util');
const { Controller } = require('app/scripts/controller');
const { removeAllRanges } = require('app/scripts/lib/util/removeAllRanges');

module.exports.saveBoardName = function (e) {
  const boardInput = this.$('.js-board-name-input');
  const val = boardInput && boardInput.val().trim();
  if (val === '') {
    boardInput.focus().select();
    return;
  }

  const traceId = Analytics.startTask({
    taskName: 'edit-board/name',
    source: 'boardScreen',
  });

  this.model.update(
    {
      traceId,
      name: val,
    },
    tracingCallback(
      {
        taskName: 'edit-board/name',
        traceId,
        source: 'boardScreen',
      },
      (_err, board) => {
        if (board) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'name',
            source: 'boardScreen',
            containers: {
              board: {
                id: this.model.id,
              },
            },
            attributes: {
              taskId: traceId,
            },
          });
        }
      },
    ),
  );
};

module.exports.keyDownEvent = function (e) {
  if (getKey(e) === Key.Enter) {
    Util.stop(e); // prevents new lines.
    this.stopRenaming();
    return;
  }

  if (getKey(e) === Key.Escape) {
    this.stopRenaming();
    return;
  }
};

module.exports.onInputChanged = function (e) {
  const input = this.$el.find('.js-board-name-input')[0];

  // First, we set the input width to 0, then we can measure how wide it needs to be for the content.
  input.style.width = '0';
  let inputWidthForNewValue = input.offsetWidth;

  // An element's scrollLeft represents the amount the element has been scrolled.
  // Setting an element's scrollLeft actually scrolls the element rather than setting the value,
  // and it can only scroll as far as the content goes— so here we're scrolling all the way to
  // the end of the content by using an absurd number.
  input.scrollLeft = 1e10;
  // With the width set to zero and the input scrolled to the end of the content, the element's
  // scrollLeft value is the width of the content! Now we add that to the offset.
  inputWidthForNewValue += input.scrollLeft;

  // Here we make sure the input doesn't fall off the side of the page. The "-24" is for paddding.
  const boardHeader = this.$el.find('.js-board-header')[0];
  const maxWidth = boardHeader.offsetWidth - 24;
  const inputWidth =
    inputWidthForNewValue < maxWidth ? inputWidthForNewValue : maxWidth;

  // Now we have an input that's only as wide as the content needs, without running off the page.
  input.style.width = inputWidth + 'px';
};

module.exports.startRenaming = function (e) {
  Util.stop(e);

  if (this.isEditingName) {
    return;
  }

  const renameButton = this.$el.find('.js-rename-board')[0];
  if (!renameButton) {
    return;
  }

  const inputWidth = renameButton.offsetWidth;

  _.defer(() => {
    this.$('.js-rename-board').addClass('is-editing');
    return this.$('.js-board-name-input')
      .val(this.model.get('name'))
      .css('width', inputWidth)
      .focus()
      .select();
  });

  this.isEditingName = true;
  Analytics.sendUIEvent({
    action: 'clicked',
    actionSubject: 'input',
    actionSubjectId: 'boardNameInput',
    source: 'boardScreen',
    containers: {
      board: {
        id: this.model.id,
      },
    },
  });
};

module.exports.stopRenaming = function (e) {
  if (!this.isEditingName) {
    return;
  }

  const $input = this.$('.js-rename-board').removeClass('is-editing');
  if ($input.is(':focus')) {
    $input.blur();
  }
  removeAllRanges();

  this.isEditingName = false;
  this.saveBoardName();
};

module.exports.updateControllerTitle = function () {
  return Controller.title(this.model.get('name'));
};
