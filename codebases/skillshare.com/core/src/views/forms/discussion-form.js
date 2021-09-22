import SSForm from 'core/src/views/forms/ss-form';
import FormHelpers from 'core/src/helpers/form-helpers';
import tinyMCE from 'tinymce/tinymce';
import template from 'text!core/src/templates/forms/discussion-form.mustache';

const DiscussionForm = SSForm.extend({

  className: 'discussion-form-container',

  template: template,

  events: {
    'click .submit-button': 'onSubmitButton',
    'click .form-toggle': 'onFormToggle',
    'click .discussion-type': 'onFormToggle',
    'click .notify-all': 'toggleEmailSubjectField',
  },

  bindings: {
    '.discussion-title': 'title',
    '.discussion-description': 'description',
    '.notify-all': 'notify_all_students',
  },

  placeholderText: {
    'Announcement': 'Share tips and shortcuts or simply start a discussion about this class',
    'Question': 'Ask the teacher or other students a question related to this class',
    'Project': '',
  },

  enabled: false,

  initialize: function(options) {
    _.extend(this, _.pick(options, ['currentUser', 'placeholderText']));
    _.bindAll(this, 'onSubmitSuccess', 'onSubmitFail');
    SSForm.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.$fieldsWrapper = this.$('.fields-wrapper');
    this.$formToggle = this.$('.form-toggle');
    this.$discussionTypes = this.$('.discussion-types');
    this.$notifyAll = this.$('.notify-all');
    this.$emailSubjectContainer = this.$('.email-subject-field');
    this.$emailSubject = this.$('.discussion-title');
    this.$submitButton = this.$('.submit-button');

    this.$submitButton.addClass('disabled');

    // select the discussion textarea. since its within an iframe
    // we must first get the DOM of the iframe and select
    // it from within there
    this.$discussionTextarea = this.$('#discussion-textarea_ifr').contents()
      .find('#tinymce');
    this.stickit();
    FormHelpers.initRichTextareas(this.$el);
    SSForm.prototype.afterRender.apply(this, arguments);
  },

  onFormToggle: function(event) {
    event.preventDefault();
    const discussionType = this.$(event.target).closest('div')
      .attr('ss-data-discussion-type');
      // We don't want to do anything for 'thank the teacher'
    if (discussionType === 'Review') {
      return;
    }

    this.$fieldsWrapper.removeClass('hidden');
    this.$el.addClass('opened');
    this.$discussionTextarea = this.$('#discussion-textarea_ifr').contents()
      .find('#tinymce');

    this.$('textarea#discussion-textarea').on('change', (e) => {
      this.checkIfEmpty(e);
    });

    this.$discussionTextarea.on('keyup', (e) => {
      this.checkIfEmpty(e);
    });

    if (discussionType) {
      this.$(event.target)
        .closest('div')
        .addClass('active')
        .siblings()
        .removeClass('active');

      this.$discussionTypes.addClass('opened');
      this.$discussionTextarea.on('focus', () => {
        this.$('iframe').contents()
          .find('.form-toggle-placeholder')
          .remove();
        this.$discussionTypes.addClass('active');
      });

      this.$discussionTextarea.on('blur', () => {
        this.$discussionTypes.removeClass('active');
      });

      this.setPlaceholder(discussionType);
      this.model.set('type', discussionType);

      if (discussionType === 'Class' || discussionType === 'Project') {
        tinyMCE.activeEditor.buttons['embed-media-button'].onclick(null, discussionType);
      }
    } else {
      this.$formToggle.hide();
      this.$discussionTextarea.focus();
    }
  },

  checkIfEmpty: function(event = null) {
    if (event.target.innerText.trim() === '' && tinyMCE.activeEditor.getContent() === '') {
      this.enabled = false;
      if (!this.$submitButton.hasClass('disabled')) {
        this.$submitButton.addClass('disabled');
      }
    } else {
      this.enabled = true;
      this.$submitButton.removeClass('disabled');
    }
  },

  setPlaceholder: function(discussionType) {
    const placeholderEl = type => `<p class="form-toggle-placeholder">${this.placeholderText[type]}</p>`;

    if (tinyMCE.activeEditor.getContent() === '' || tinyMCE.activeEditor.getContent() === placeholderEl('Announcement') || tinyMCE.activeEditor.getContent() === placeholderEl('Question')){
      tinyMCE.activeEditor.setContent(placeholderEl(discussionType));
    }
  },

  onSubmitButton: function() {
    if (!this.enabled) {
      return;
    }

    SSForm.prototype.onSubmitButton.apply(this, arguments);

    this.model.save()
      .success(this.onSubmitSuccess)
      .fail(this.onSubmitFail);
  },

  onSubmitSuccess: function() {
    this.model.set('canModify', true);
    this.trigger('new:discussion', this.model);
    SSForm.prototype.onSubmitSuccess.apply(this, arguments);
  },

  onSubmitFail: function() {
    SS.events.trigger('alerts:create', {
      title: 'Sorry! There was an error creating your discussion. Please try again.',
      type: 'error',
    });

    SSForm.prototype.onSubmitFail.apply(this, arguments);
  },

  toggleEmailSubjectField: function() {
    const isChecked = this.$notifyAll.prop('checked');

    if (isChecked) {
      this.$emailSubjectContainer.show();
      this.$emailSubject.focus();
    } else {
      this.$emailSubjectContainer.hide();
    }
  },

});

export default DiscussionForm;
