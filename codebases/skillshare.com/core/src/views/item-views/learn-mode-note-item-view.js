import SSView from 'core/src/views/base/ss-view';
import NotesLikesMixin from 'core/src/views/mixins/notes-likes-mixin';
import NoteEditForm from 'core/src/views/forms/note-edit-form';
import ConfirmationPopoverView from 'core/src/views/modules/confirmation-popover';
import StringHelpers from 'core/src/helpers/string-helpers';
import TimestampHelper from 'core/src/helpers/timestamp-helper';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import template from 'text!core/src/templates/class-details/shared/_learn-mode-note-item-view.mustache';

const DISPLAY_HIGHLIGHT_TIME = 2000;
const SCROLL_TIME = 400;

const LearnModeNoteItemView = SSView.extend({

  className: 'learn-mode-note',

  template: template,

  templateData: function() {
    return _.extend({}, this.model.attributes, {
      formattedBody: StringHelpers.addHTMLLineBreaks(String(this.model.get('body'))),
      formattedVideoTime: TimestampHelper.getTimeFromSeconds(this.model.get('video_time')),
      isGuest: SS.currentUser.isGuest(),
    });
  },

  events: {
    'click .video-time': 'onVideoTime',
    'click .make-private': 'onMakePrivate',
    'click .edit-button': 'onEdit',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['collectionView']));

    this.listenTo(this.model, 'highlight', this.scrollTo);
    this.listenTo(this.model, 'change', this.render);

    _.extend(this, NotesLikesMixin);

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    const _this = this;
    ComponentInitializers.initUserPopovers(this);

    const confirmationPopover = new ConfirmationPopoverView({
      message: 'Delete this note?',
      confirmButtonText: 'Delete',
      anchor: this.$('.delete-button'),
    });
    this.listenTo(confirmationPopover, 'confirm', this.destroy);

    // from the NotesLikesMixin
    this.initializeLikeButton();

    this.listenTo(this.likeButtonView, 'save', function(userVote) {
      _this.model.set('userVote', _.pick(userVote.changed, ['id', 'value']));
    });

    SSView.prototype.afterRender.apply(this, arguments);
  },

  onVideoTime: function() {
    this.collectionView.trigger('click:videoTime', this.model);
  },

  onEdit: function() {
    this.$('.note-static').hide();
    this.noteEditForm = new NoteEditForm({
      initialModel: this.model,
      container: this.$('.note-edit-form-wrapper'),
    });
    this.listenTo(this.noteEditForm, 'cancel', this.render);
  },

  destroy: function() {
    this.model.destroy();
  },

  scrollTo: function() {
    const _this = this;

    this.$el.addClass('highlight');
    _.delay(function() {
      _this.$el.removeClass('highlight');
    }, DISPLAY_HIGHLIGHT_TIME);

    const position = this.$el.position().top;
    $('html body').animate({ scrollTop: position }, SCROLL_TIME);
  },

  onMakePrivate: function() {
    this.model.save({ privacy_status: 0 }).success(this.onMakePrivateSuccess);
  },

  onMakePrivateSuccess: function(model) {
    model.collection.remove(model);
  },

});

export default LearnModeNoteItemView;

