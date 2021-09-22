import SSView from 'core/src/views/base/ss-view';
import Note from 'core/src/models/note';
import FormHelpers from 'core/src/helpers/form-helpers';
import template from 'text!core/src/templates/forms/note-edit-form.mustache';

const NoteEditForm = SSView.extend({

  isFormEnabled: true,

  className: 'note-edit-form',

  template: template,

  templateData: function() {
    return this.model.attributes;
  },

  events: {
    'click .post-button': 'onPostButton',
    'click .cancel-button': 'onCancelButton',
  },

  bindings: {
    '.note-body': 'body',
    '.note-privacy-status': 'privacy_status',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['initialModel']));
    _.bindAll(this, 'onPostSuccess', 'onPostFail');

    // Make a copy of this model so that we can use stickit on this.model
    // for form changes but not update initialModel until you've saved.
    // Otherwise, if the user were to hit cancel we would have no way to
    // return this.model to it's original state.
    this.model = new Note(this.initialModel.attributes);
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.$textarea = this.$('.note-body');
    this.$postButton = this.$('.post-button');

    const textareaValue = this.$textarea.val();
    this.$textarea.focus().val('')
      .val(textareaValue);
    this.stickit();

    FormHelpers.initInputsAndSelectMenus(this.$el);
    SSView.prototype.afterRender.apply(this, arguments);
  },

  onPostButton: function() {
    if (!this.isFormEnabled) {
      return false;
    }

    this.disablePostButton();

    if (!this.model.isValid()) {
      this.onPostFail();
      return;
    }

    this.model.save()
      .success(this.onPostSuccess)
      .fail(this.onPostFail);
  },

  onPostSuccess: function(attributes) {
    this.initialModel.set(attributes);
  },

  onPostFail: function() {
    SS.events.trigger('alerts:create', {
      title: 'Sorry! There was an error editing your note. Please try again.',
      type: 'error',
    });
    this.enablePostButton();
  },

  onCancelButton: function() {
    this.trigger('cancel');
  },

  disablePostButton: function() {
    this.$postButton.addClass('disabled');
    this.isFormEnabled = false;
  },

});

export default NoteEditForm;

