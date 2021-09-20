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
const $ = require('jquery');
const Backbone = require('@trello/backbone');
const { TrelloStorage } = require('@trello/storage');
const _ = require('underscore');

module.exports = new ((function () {
  const Cls = class {
    static initClass() {
      _.extend(this.prototype, Backbone.Events);
    }

    cancelEdit($el) {
      $el.find('.edit-controls:not(.keep)').remove();
      $el.removeClass('editing is-editing focus');
      return $el.blur();
    }

    cancelEdits(elExclude) {
      $('.edit-controls:not(.keep)').remove();
      $('.is-editing').removeClass('is-editing');
      $('.checklist-new-item').removeClass('focus');
      $('input')
        .not(elExclude || 'none')
        .blur();
      $('textarea')
        .not(elExclude || 'none')
        .blur();

      this.trigger('cancelEdits');

      const editableFields = $('.editable');
      if (editableFields.length > 0) {
        editableFields.each((i) => {
          let unmarkeddown;
          const editableField = $('.editable')[i];
          const isEditing = $(editableField).hasClass('editing');
          const warning = $(editableField).find('.edits-warning:first');
          const current = $(editableField).find('.current:first');
          const field = $(editableField).find('.field:first');
          const draftKey = field.data('draftKey');

          const saveDraft =
            (unmarkeddown = current.data('unmarkeddown')) != null
              ? unmarkeddown !== field.val()
              : field.val() !== current.text();

          if (saveDraft && draftKey != null && isEditing) {
            if (field.hasClass('field-autosave')) {
              return this.autosaveEdits(editableField, field);
              // Dont save the draft unless they made edits that are not empty
            } else if (field.val() !== '') {
              TrelloStorage.set(draftKey, field.val());
              return warning.show();
            }
          }
        });
      }

      return $('.editing').removeClass('editing');
    }

    isEditing() {
      return $('.editing').length + $('.checklist-new-item.focus').length > 0;
    }

    autosaveEdits(editableField, field) {
      if (field.hasClass('card-description')) {
        return this.trigger('autosaveCardDescription', $(editableField));
      } else if (field.hasClass('board-description')) {
        return this.trigger('autosaveBoardDescription', $(editableField));
      } else {
        return this.trigger('autosaveEdits', $(editableField));
      }
    }
  };
  Cls.initClass();
  return Cls;
})())();
