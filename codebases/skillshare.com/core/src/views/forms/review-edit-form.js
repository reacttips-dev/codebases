import SSView from 'core/src/views/base/ss-view';
import Review from 'core/src/models/review';
import FormHelpers from 'core/src/helpers/form-helpers';
import template from 'text!core/src/templates/forms/review-edit-form.mustache';

const ReviewEditForm = SSView.extend({

  isFormDisabled: false,

  className: 'review-edit-form',

  template: template,

  templateData: function() {
    return _.extend({}, this.model.attributes, {
      likeStyle: this.model.attributes.recommended ? 'positive' : 'negative',
      dislikeStyle: !this.model.attributes.recommended ? 'negative-admin' : 'negative',
    });
  },

  events: {
    'click .save-button': 'onSave',
    'click .cancel-button': 'onCancel',
    'click .like-button': 'onLike',
    'click .dislike-button': 'onDislike',
  },

  bindings: {
    '.body-content': 'testimonial',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['initialModel']));
    _.bindAll(this, 'onSaveSuccess', 'onSaveFail');

    // Make a copy of this model so that we can use stickit on this.model
    // for form changes but not update initialModel until you've saved.
    // Otherwise, if the user were to hit cancel we would have no way to
    // return this.model to it's original state.
    this.model = new Review(this.initialModel.attributes);
    SSView.prototype.initialize.apply(this, arguments);

    this.model.on('change:recommended', this.render, this);
  },

  afterRender: function() {
    const $textarea = this.$el.find('.body-content');
    const textareaValue = $textarea.val();

    this.$saveButton = this.$el.find('.save-button');

    $textarea.focus().val('')
      .val(textareaValue);
    this.stickit();

    FormHelpers.initInputsAndSelectMenus(this.$el);
    SSView.prototype.afterRender.apply(this, arguments);
  },

  onSave: function() {
    if (this.isFormDisabled) {
      return false;
    }

    this.disableSaveButton();

    this.model.save()
      .success(this.onSaveSuccess)
      .fail(this.onSaveFail);
  },

  onSaveSuccess: function(attributes) {
    this.initialModel.set(attributes);
  },

  onSaveFail: function() {
    SS.events.trigger('alerts:create', {
      title: 'Sorry! There was an error editing your review. Please try again.',
      type: 'error',
    });
    this.enableSaveButton();
  },

  onCancel: function() {
    this.trigger('cancel');
  },

  disableSaveButton: function() {
    this.toggleDisabledClass();
    this.updateIsFormDisabled();
  },

  enableSaveButton: function() {
    this.toggleDisabledClass();
    this.updateIsFormDisabled();
  },

  toggleDisabledClass: function() {
    this.$saveButton.toggleClass('disabled');
  },

  updateIsFormDisabled: function() {
    this.isFormDisabled = this.$saveButton.hasClass('disabled');
  },

  onLike: function() {
    this.model.set({ recommended: 1 });
  },

  onDislike: function() {
    this.model.set({ recommended: 0 });
  },

});

export default ReviewEditForm;

