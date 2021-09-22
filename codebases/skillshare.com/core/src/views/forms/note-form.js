import SSView from 'core/src/views/base/ss-view';
import FormHelpers from 'core/src/helpers/form-helpers';
import TimestampHelper from 'core/src/helpers/timestamp-helper';
import template from 'text!core/src/templates/forms/note-form.mustache';

const NoteForm = SSView.extend({

  isTextareaEnabled: false,

  isFormEnabled: false,

  className: 'note-form',

  template: template,

  templateData: function() {
    return _.extend({
      hasVideoTime: this.hasVideoTime(),
    }, this.model.attributes, this.extraTemplateData);
  },

  events: {
    'click .post-button': 'onPostButton',
  },

  bindings: {
    '.note-body': 'body',
    '.note-privacy-status': 'privacy_status',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['player', 'extraTemplateData', 'via']));
    _.bindAll(this, 'onPostSuccess', 'onPostFail', 'onVideoPlay');

    if (!this.player) {
      throw new Error('A Brightcove Video Player is required for this view');
    }

    this.listenTo(this.model, 'change:body', this.onBodyChange);
    this.listenTo(this.model, 'change:video_time', this.onVideoTimeChange);
    this.listenTo(this.model, 'change:privacy_status', this.onPrivacyStatusChange);

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.$postAtTime = this.$('.post-at-time');
    this.$postAt = this.$('.post-at');
    this.$postButton = this.$('.post-button');
    this.$textarea = this.$('.note-body');
    this.$noteSubmission = this.$('.note-submission');

    this.stickit();

    FormHelpers.initInputsAndSelectMenus(this.$el);

    SSView.prototype.afterRender.apply(this, arguments);

    // this is just to enable the text form
    this.onVideoPlay();
  },

  // When the user types into the textarea...
  onBodyChange: function(model, body) {
    // User emptied the textarea - reset the note time and disable the Post button
    if (!body) {
      this.model.unset('video_time');
      return;
    }

    // User is typing in beyond the first character - don't change anything
    if (this.hasVideoTime()) {
      return;
    }

    // User entered in the first character - set the video_time based on the current time of the player
    // and enable the Post button
    this.model.set('video_time', Math.floor(this.player.getCurrentTime()));
  },

  // When we've updated the video time based on when the user started typing
  onVideoTimeChange: function(model, videoTime) {
    if (!this.hasVideoTime()) {
      this.$postAt.hide();
      this.disablePostButton();
      return;
    }

    this.$postAtTime.html(TimestampHelper.getTimeFromSeconds((videoTime)));
    this.$postAt.show();
    this.enablePostButton();
  },

  onPrivacyStatusChange: function(model, privacyStatus) {
    this.trigger('change:privacy_status', privacyStatus);
  },

  onPostButton: function() {
    if (!this.isFormEnabled) {
      return;
    }

    this.disablePostButton();

    if (!this.model.isValid()) {
      this.onPostFail();
      return;
    }

    this.model.set('via', this.via);
    this.model.save()
      .success(this.onPostSuccess)
      .fail(this.onPostFail);
  },

  onPostSuccess: function() {
    this.trigger('created:note', this.model);
    this.enablePostButton();
  },

  onPostFail: function() {
    SS.events.trigger('alerts:create', {
      title: 'Sorry! There was an error creating your note. Please try again.',
      type: 'error',
    });
    this.enablePostButton();
  },

  enablePostButton: function() {
    this.$postButton.removeClass('disabled');
    this.isFormEnabled = true;
  },

  disablePostButton: function() {
    this.$postButton.addClass('disabled');
    this.isFormEnabled = false;
  },

  enableTextarea: function() {
    this.$textarea
      .removeAttr('disabled')
      .removeClass('disabled');

    this.isTextareaEnabled = true;
  },

  onVideoPlay: function() {
    if (this.isTextareaEnabled) {
      return;
    }

    this.enableTextarea();
    this.show();
  },

  // can't just use this.model.get('video_time') in conditionals since 0 is falsey in js
  hasVideoTime: function() {
    return (typeof this.model.get('video_time')) === 'number';
  },

  show: function() {
    this.$el.show();
  },

});

export default NoteForm;
