/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const { Board } = require('app/scripts/models/board');
const { Card } = require('app/scripts/models/card');
const DragSort = require('app/scripts/views/lib/drag-sort');
const editControlsTemplate = require('app/scripts/views/templates/edit_controls');
const EmojiCompleterView = require('app/scripts/views/internal/autocomplete/emoji-completer-view');
const {
  hasSelectionIn,
} = require('app/scripts/lib/util/selection/has-selection-in');
const { getKey, isForceSubmitEvent, Key } = require('@trello/keybindings');
const Layout = require('app/scripts/views/lib/layout');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const { asNumber } = require('@trello/i18n/formatters');

class EditableView extends View {
  static initClass() {
    this.prototype.allowNewlines = true;
  }

  initialize() {
    super.initialize(...arguments);

    // Initial work on this used effing f(@, 'saveDrafts', 'unload') as the callback for
    // unload, but this led to browsers showing a dialog for "you have unsaved
    // edit, are you sure you want to navigate away?" Having an anonymous callback
    // fixed the issue, so be careful changing this
    // This is most likely because that dialog will appear if the return value
    // is not null or undefined
    return $(window).on(`beforeunload.EditableView-${this.model.cid}`, () => {
      this.saveDrafts();
    });
  }

  remove() {
    // Save drafts seems to be called on reload of page but not when pressing the
    // back button on the page. So call it again here in case it hasn't
    this.saveDrafts();
    $(window).off(`.EditableView-${this.model.cid}`);
    return super.remove(...arguments);
  }

  _draftKey(attr) {
    return `draft_${this.model.id}_${attr}`;
  }
  _saveDraft(attr, value) {
    return TrelloStorage.set(this._draftKey(attr), value);
  }
  _recallDraft(attr) {
    return TrelloStorage.get(this._draftKey(attr));
  }
  _discardDraft(attr) {
    return TrelloStorage.unset(this._draftKey(attr));
  }

  saveDrafts() {
    if (this.model.id == null) {
      return false;
    }
    return (() => {
      const result = [];
      for (const $el of Array.from(this.getEdits())) {
        const attr = $el.attr('attr');
        const val = $el.find('.field:first').val();
        if ($.trim(val).length === 0) {
          continue;
        } // Not in edit mode
        if (this.model.get(attr) !== val && val !== this._recallDraft(attr)) {
          result.push(this._saveDraft(attr, val));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  editField(e) {
    const $link = $(e.target).closest('a');
    if ($link.length > 0 && $link.attr('href') !== '#') {
      return;
    }
    if (DragSort.sorting) {
      return;
    }

    const $container = $(e.target).closest('.editable');
    if ($container.length === 0) {
      return;
    }

    // If they've selected some text, they're probably trying to copy it
    if (hasSelectionIn($container)) {
      return;
    }

    if ($(e.target).closest('.js-react-root').length) {
      return;
    }

    Util.stop(e);
    PopOver.hide();

    const attr = $container.attr('attr');

    return this.edit(attr);
  }

  edit(sAttr, focus) {
    let parts;
    if (focus == null) {
      focus = true;
    }
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

    const input = container.find('.field:first');

    edit.append(editControlsTemplate());

    container.addClass('editing');

    if (input.val() === '') {
      input.val(
        Util.traverse(this.model.attributes, parts != null ? parts : sAttr),
      );
    }

    this.waitForId(this.model, () => {
      return input.data('draftKey', this._draftKey(sAttr));
    });

    if (focus) {
      input.focus().select();
    }
    input.autosize({ append: false });
  }

  getEdits() {
    const $allEdits = this.$('[attr]');
    // Make sure we don't process other editables that are nested
    // inside this one
    const $noEdits = this.$('.js-no-higher-edits [attr]');

    return $allEdits.not($noEdits).map((index, el) => $(el));
  }

  recallDrafts() {
    return this.getEdits().each((i, $el) => {
      const attr = $el.attr('attr');
      if (this.model.id != null) {
        const draftVal = this._recallDraft(attr);
        if (draftVal != null) {
          const $input = $el.find('.field:first');
          $input.val(draftVal);
          return this.defer(() => {
            return $el.find('.edits-warning').show();
          });
        }
      }
    });
  }

  stopEditing(e) {
    Util.stop(e);
    Layout.cancelEdits();
    return false;
  }

  clearEdits(e) {
    Util.stop(e);
    const $editable = $(e.target).closest('.editable[attr]');
    const attr = $editable.attr('attr');
    if (attr != null) {
      this._discardDraft(attr);
    }
    $editable.find('.field').val('');
    $editable.find('.edits-warning').hide();
    $editable.find('.edits-error').hide();
    $editable.removeClass('editing');
    Layout.cancelEdits();
    return false;
  }

  validate() {
    let field;
    for (field of Array.from(this.$('.editing.non-empty .field'))) {
      if (/^\s*$/.test($(field).val())) {
        return false;
      }
    }

    for (field of Array.from(this.$('.editing .field'))) {
      let left;
      const fieldLength = ((left = $(field).val()) != null ? left : '').length;
      if (fieldLength > 16384) {
        $('.editing')
          .find('.edits-error')
          .text(l('text too long', { over: asNumber(fieldLength - 16384) }))
          .show();
        return false;
      }
    }

    return true;
  }

  keydownEvent(e) {
    const key = getKey(e);

    if (Layout.isEditing()) {
      if (
        PopOver.view instanceof EmojiCompleterView ||
        PopOver.view instanceof AutoMentionerView
      ) {
        if (typeof this.checkInsert === 'function') {
          this.checkInsert(e);
        }
      } else if (
        isForceSubmitEvent(e) ||
        (key === Key.Enter &&
          (!$(e.target).is('textarea') ||
            $(e.currentTarget).hasClass('single-line')) &&
          !e.shiftKey)
      ) {
        Util.stop(e);
        this.commitEdits(e);
      } else if (key === Key.Enter && !this.allowNewlines) {
        Util.stop(e);
      }
    }
  }

  commitEdits(e, $customEditable = null) {
    if (e) {
      Util.stop(e);
    }

    const $editable =
      $customEditable || $(e.target).closest('.editable.editing[attr]');
    $editable.find('.edits-error').hide();

    if (!this.validate()) {
      return;
    }

    const view = this;
    const { model } = this;

    // Remove buttons
    $editable.remove('input[type=submit]');

    // Remove buttons and commit all other edits
    $editable
      .removeClass('editing')
      .each(function () {
        const attr = $(this).attr('attr');
        let newValue = $(this).find('.field').val();

        if (!view.allowNewlines) {
          newValue = newValue.replace(/[\r\n]+/g, ' ');
        }

        // if the newValue is all whitespace, replace it with the empty string
        if ($.trim(newValue).length === 0) {
          newValue = '';
        }

        if (model.get(attr) === newValue) {
          return view._discardDraft(attr);
        } else {
          let tracingAttributes = {};
          if (model instanceof Card) {
            tracingAttributes = {
              taskName: 'edit-card/desc',
              source: 'cardDetailScreen',
            };
          }
          if (model instanceof Board) {
            tracingAttributes = {
              taskName: 'edit-board/desc',
              source: 'boardMenuDrawerAboutScreen',
            };
          }
          const traceId = Analytics.startTask(tracingAttributes);

          const delta = { traceId };
          delta[attr] = newValue;

          return model.update(delta, function (err, response) {
            if (err != null) {
              $editable.find('.edits-error').text(err.message).show();
              view._saveDraft(attr, newValue);
              Analytics.taskFailed({
                ...tracingAttributes,
                traceId,
                error: err,
              });
            } else {
              view._discardDraft(attr);
              if (model instanceof Card) {
                Analytics.sendUpdatedCardFieldEvent({
                  field: 'description',
                  source: 'cardDetailScreen',
                  containers: {
                    card: { id: response.id },
                    board: { id: response.idBoard },
                    list: { id: response.idList },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
              if (model instanceof Board) {
                Analytics.sendUpdatedBoardFieldEvent({
                  field: 'description',
                  source: 'boardMenuDrawerAboutScreen',
                  containers: {
                    board: { id: response.id },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }

              Analytics.taskSucceeded({
                ...tracingAttributes,
                traceId,
              });
            }
          });
        }
      })
      .find('.field')
      .val('');

    $editable.find('.edits-warning').hide();

    return true;
  }

  clickSetting(e) {
    const $target = $(e.target);
    if (
      $target.hasClass('disabled') ||
      $target.closest('.js-disabled').length
    ) {
      return;
    }

    // If this is an actual link, let it through
    const href = $target.attr('href');
    if (href && href !== '#') {
      return;
    }

    const prefName = $target.closest('.pref').attr('name');
    if (!prefName) {
      return;
    }
    let setting = $target.attr('value');

    setting = (() => {
      switch (setting) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return setting;
      }
    })();

    this.model.setPref(prefName, setting);
    this.model.save();

    Util.stop(e);
  }

  delegateEvents(events) {
    const editableEvents = {
      'click .current': 'editField',
      'click .js-cancel-edit': 'clearEdits',
      'click .js-discard-edits': 'clearEdits',
      'click .js-view-edits': 'editField',
      'click .js-save-edit': 'commitEdits',
      'keydown .field': 'keydownEvent',
      'click input': Util.stopPropagation,
      'click textarea': Util.stopPropagation,
    };

    if (this.model.setPref != null) {
      editableEvents['click a'] = 'clickSetting';
    }

    return super.delegateEvents(
      _.extend(editableEvents, events || this.events),
    );
  }
}

EditableView.initClass();
module.exports = EditableView;
