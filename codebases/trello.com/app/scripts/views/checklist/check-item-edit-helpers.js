const $ = require('jquery');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const EmojiCompleterView = require('app/scripts/views/internal/autocomplete/emoji-completer-view');
const { Dates } = require('app/scripts/lib/dates');
const DragSort = require('app/scripts/views/lib/drag-sort');
const {
  hasSelectionIn,
} = require('app/scripts/lib/util/selection/has-selection-in');
const Layout = require('app/scripts/views/lib/layout');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { asNumber } = require('@trello/i18n/formatters');
const { TrelloStorage } = require('@trello/storage');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'checklist_item',
);
const { l } = require('app/scripts/lib/localize');
const { isSubmitEvent, getKey, Key } = require('@trello/keybindings');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const {
  applyMarkdownShortcuts,
} = require('app/scripts/views/lib/markdown-transform');

const editTemplate = t.renderable(() => {
  t.div('.edit-controls.u-clearfix', () => {
    t.input(
      '.nch-button.nch-button--primary.confirm.mod-submit-edit.js-save-edit',
      {
        type: 'submit',
        value: t.l('save'),
      },
    );
    t.a('.icon-lg.icon-close.dark-hover.cancel.js-cancel-edit', { href: '#' });

    t.div('.edit-controls-spacer');

    t.a('.option.check-item-options-menu.dark-hover.js-assign.hide', {
      href: '#',
    });

    t.a(
      '.option.check-item-options-menu.dark-hover.js-due.checklist-add-controls-due.hide',
      { href: '#' },
    );

    t.a(
      '.option.check-item-options-menu.dark-hover.js-open-emoji-selector',
      { href: '#' },
      () => {
        t.span('.icon-sm.icon-emoji');
      },
    );

    t.a(
      '.option.check-item-options-menu.dark-hover.js-open-mention-selector',
      { href: '#' },
      () => {
        t.span('.icon-sm.icon-mention');
      },
    );

    //#currently the options menu is only used for CheckItems. If another use is added, add check for Checkitem
    t.div('.check-item-new-menu.ignore-editable-view.js-overflow-button-react');
  });
});

const editAssignTemplate = t.renderable((fullName) => {
  t.icon('add-member');
  if (fullName) {
    t.text(fullName);
  } else {
    t.format('assign');
  }
});

const editDueTemplate = t.renderable((dueText) => {
  t.icon('clock');
  if (dueText) {
    t.text(dueText);
  } else {
    t.format('due-date');
  }
});

module.exports._checkItemDraftKey = function () {
  return `draft_${this.model.id}_name`;
};
module.exports._saveCheckItemDraft = function (attr, value) {
  TrelloStorage.set(this._checkItemDraftKey(attr), value);
};
module.exports._recallCheckItemDraft = function () {
  return TrelloStorage.get(this._checkItemDraftKey('name'));
};
module.exports._discardCheckItemDraft = function () {
  TrelloStorage.unset(this._checkItemDraftKey('name'));
};

module.exports.saveCheckItemDrafts = function (invokeSource) {
  if (!this.model.id) {
    return false;
  }

  for (const $el of this.getCheckItemEdits()) {
    const attr = $el.attr('attr');
    const val = $el.find('.js-checkitem-input:first').val();
    if ($.trim(val).length === 0) {
      continue;
    } // Not in edit mode

    if (
      this.model.get('name') !== val &&
      val !== this._recallCheckItemDraft()
    ) {
      if (invokeSource) {
        Analytics.sendTrackEvent({
          action: 'saved',
          actionSubject: 'checkItemDraft',
          source: 'cardDetailScreen',
          attributes: {
            invokeSource: invokeSource,
          },
        });
      }
      this._saveCheckItemDraft(attr, val);
    }
  }
};

module.exports.recallCheckItemDrafts = function () {
  this.getCheckItemEdits().each((i, $el) => {
    if (this.model.id) {
      const draftVal = this._recallCheckItemDraft();
      if (draftVal) {
        const $input = $el.find('.field:first');
        $input.val(draftVal);
        this.defer(() => {
          $el.find('.edits-warning').show();
        });
      }
    }
  });
};

module.exports.getCheckItemEdits = function () {
  const $allEdits = this.$('[attr]');
  // Make sure we don't process other editables that are nested
  // inside this one
  const $noEdits = this.$('.js-no-higher-edits [attr]');

  return $allEdits.not($noEdits).map((index, el) => $(el));
};

module.exports.onCheckItemClick = function (e) {
  const $link = $(e.target).closest('a');
  if ($link.length > 0 && $link.attr('href') !== '#') {
    return;
  }
  if (DragSort.sorting) {
    return;
  }
  const $noEditableView = $(e.target).closest('.ignore-editable-view');
  if ($noEditableView.length > 0) {
    return;
  }

  const $container = $(e.target).closest('.editable');
  if ($container.length === 0) {
    return;
  }

  if ($(e.target).closest('.js-react-root').length) {
    return;
  }

  // If they've selected some text, they're probably trying to copy it
  if (hasSelectionIn($container)) {
    return;
  }

  Util.stop(e);
  PopOver.hide();

  const attr = $container.attr('attr');

  this.editCheckItem(attr);
};

module.exports.checkItemKeydownEvent = function (e) {
  applyMarkdownShortcuts(e, true);

  if ($('.editing').length > 0) {
    if (
      PopOver.view instanceof EmojiCompleterView ||
      PopOver.view instanceof AutoMentionerView
    ) {
      this.checkInsert(e);
    } else if (isSubmitEvent(e)) {
      this.commitCheckItemEdits(e);
    }
  }
};

module.exports.checkItemEditControlKeydown = function (e) {
  if (getKey(e) === Key.Escape) {
    Util.stop(e);

    if (PopOver.isVisible) {
      PopOver.hide();
    } else {
      this.clearEdits(e);
    }
  }
};

module.exports.clearEdits = function (e) {
  Util.stop(e);
  const $editable = $(e.target).closest('.editable[attr]');

  this._discardCheckItemDraft('name');

  $editable.find('.js-checkitem-input').val('');
  $editable.find('.edits-warning').hide();
  $editable.find('.edits-error').hide();
  $editable.removeClass('editing');
  Layout.cancelEdits();
  return false;
};

module.exports.renderEditItemButtons = function () {
  const $editControls = this.$('.edit-controls');
  if ($editControls.length) {
    const idMember = this.model.get('idMember');
    const due = this.model.get('due');

    const member = idMember && this.modelCache.get('Member', idMember);
    const fullName = member ? member.get('fullName') : undefined;
    $editControls.find('.js-assign').html(editAssignTemplate(fullName));

    const dueText = due && Dates.toDateString(due);
    $editControls.find('.js-due').html(editDueTemplate(dueText));
  }

  return this;
};

module.exports.commitCheckItemEdits = function (e) {
  PopOver.hide();

  if (e) {
    Util.stop(e);
  }

  const cardId = this.model.getCard().id;
  const boardId = this.model.getBoard().id;

  if (this.$('.js-checkitem-input').val().length === 0) {
    const destroyTraceId = Analytics.startTask({
      taskName: 'delete-checkItem',
      source: 'cardDetailScreen',
    });

    this.model.destroyWithTracing(
      { traceId: destroyTraceId },
      tracingCallback(
        {
          taskName: 'delete-checkItem',
          source: 'cardDetailScreen',
          traceId: destroyTraceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'deleted',
              actionSubject: 'checkItem',
              source: 'cardDetailScreen',
              attributes: {
                taskId: destroyTraceId,
              },
              containers: {
                card: { id: cardId },
                board: { id: boardId },
              },
            });
          }
        },
      ),
    );
  }

  const $editable = $(e.target).closest('.editable.editing[attr]');
  $editable.find('.edits-error').hide();

  if (!this.validateCheckItemInput()) {
    return;
  }

  const { model } = this;

  // Remove buttons
  $editable.remove('input[type=submit]');

  // Remove buttons and commit all other edits
  $editable
    .removeClass('editing')
    .each((index, el) => {
      const $el = $(el);
      const attr = $el.attr('attr');
      let newValue = $el.find('.js-checkitem-input').val();

      if (!this.allowNewlines) {
        newValue = newValue.replace(/[\r\n]+/g, ' ');
      }

      // if the newValue is all whitespace, replace it with the empty string
      if ($.trim(newValue).length === 0) {
        newValue = '';
      }

      if (model.get('name') === newValue) {
        this._discardCheckItemDraft('name');
      } else {
        const traceId = Analytics.startTask({
          taskName: 'edit-checkItem/name',
          source: 'cardDetailScreen',
        });

        model.update(
          { name: newValue, traceId },
          tracingCallback(
            {
              taskName: 'edit-checkItem/name',
              source: 'cardDetailScreen',
              traceId,
            },
            (err) => {
              if (err) {
                $editable.find('.edits-error').text(err.message).show();
                this._saveCheckItemDraft(attr, newValue);
              } else {
                this._discardCheckItemDraft(attr);
                Analytics.sendTrackEvent({
                  action: 'updated',
                  actionSubject: 'checkItem',
                  actionSubjectId: 'name',
                  source: 'cardDetailScreen',
                  attributes: {
                    taskId: traceId,
                  },
                  containers: {
                    card: { id: cardId },
                    board: { id: boardId },
                  },
                });
              }
            },
          ),
        );
      }
    })
    .find('.js-checkitem-input')
    .val('');

  $editable.find('.edits-warning').hide();

  return true;
};

module.exports.validateCheckItemInput = function () {
  const checkItemInputValue = this.$('.js-checkitem-input').val();

  if (/^\s*$/.test(checkItemInputValue)) {
    return false;
  }

  const fieldLength = checkItemInputValue.length;
  if (fieldLength > 16384) {
    this.$('.editing')
      .find('.edits-error')
      .text(l('text too long', { over: asNumber(fieldLength - 16384) }))
      .show();
    return false;
  }

  return true;
};

module.exports.editCheckItem = function (sAttr) {
  let parts;
  if (sAttr.indexOf('.') > -1) {
    parts = sAttr.split('.');
    sAttr = parts[1];
  }

  const allEditableWithAttr = this.$(`[attr=${sAttr}]`);
  const noEdits = this.$(`.js-no-higher-edits [attr=${sAttr}]`);
  const container = allEditableWithAttr.not(noEdits);
  if (container.length === 0) {
    return;
  }

  Layout.cancelEdits();
  const edit = container.find('.edit:first');
  if (edit.length === 0) {
    return;
  }

  const input = container.find('.js-checkitem-input:first');

  const board = this.model.getBoard();
  const showButtons = Boolean(
    board
      ? board.hasAdvancedChecklists() || board.upsellAdvancedChecklists()
      : undefined,
  );

  edit.append(editTemplate());

  const editableViewButton = this.el.querySelector('.js-overflow-button-react');

  this.renderOverflowButton(editableViewButton, { editableView: true });

  this.$('.js-assign,.js-due').toggleClass('hide', !showButtons);
  this.renderEditItemButtons();

  container.addClass('editing');

  if (input.val() === '') {
    input.val(Util.traverse(this.model.attributes, parts || sAttr));
  }

  this.waitForId(this.model, () => {
    input.data('draftKey', this._checkItemDraftKey());
  });

  input.focus().select();
  input.autosize({ append: false });
};
