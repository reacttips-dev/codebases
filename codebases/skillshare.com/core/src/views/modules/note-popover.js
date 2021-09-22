import PopoverView from 'core/src/views/modules/popover';
import NotesLikesMixin from 'core/src/views/mixins/notes-likes-mixin';
import NoteEditForm from 'core/src/views/forms/note-edit-form';
import ActionPopupView from 'core/src/views/popups/action-popup';
import StringHelpers from 'core/src/helpers/string-helpers';
import template from 'text!core/src/templates/popovers/note-popover.mustache';
import 'jquery-truncate';

const MAX_BODY_LENGTH = 170;

const NotePopoverView = PopoverView.extend({

  className: 'popover note-popover',

  showOnHover: true,

  addShadow: true,

  placement: 'top',

  inEditMode: false,

  template: template,

  templateData: function() {
    return _.extend({}, this.model.attributes, {
      formattedBody: this.getFormattedBody(),
      truncated: this.isTruncated(),
      isGuest: SS.currentUser.isGuest(),
    });
  },

  isTruncated: function() {
    return this.model.get('body').length > MAX_BODY_LENGTH;
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.update);
    this.listenTo(this.model.collection, 'closeAll', this.forceClose);
    _.extend(this, NotesLikesMixin);
    PopoverView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    const _this = this;
    this.$noteStatLikes = this.$('.note-stat-likes');
    // from the NotesLikesMixin
    this.initializeLikeButton();

    this.listenTo(this.likeButtonView, 'save', function(userVote) {
      _this.model.set('userVote', _.pick(userVote.changed, ['id', 'value']));
    });
  },

  getFormattedBody: function() {
    // 1. Truncate the body
    // also enforce string type on the model when saving
    let truncatedBody = String(this.model.get('body'));
    if (truncatedBody.length > MAX_BODY_LENGTH) {
      truncatedBody = $.truncate(truncatedBody, { length: MAX_BODY_LENGTH, ellipsis: '...' });
    }
    // 2. Convert all newlines to <br /> tags
    return StringHelpers.addHTMLLineBreaks(truncatedBody);
  },

  onPopoverCreated: function() {
    PopoverView.prototype.onPopoverCreated.apply(this, arguments);
    const _this = this;
    this.visibleEl.find('.more-link').on('click', function() {
      _this.onMoreLink();
    });
    this.visibleEl.find('.make-private').on('click', function() {
      _this.onMakePrivate();
    });
    this.visibleEl.find('.delete-button').on('click', function() {
      _this.onDelete();
    });
    this.visibleEl.find('.edit-button').on('click', function() {
      _this.openEditMode();
    });

    this.visibleEl.find('.note-like').on('click', function(event) {
      _this.likeButtonView.onClick(event);
    });
    const likeText = this.showLike() ? 'Like' : 'Unlike';
    this.visibleEl.find('.note-like').html(likeText);
  },

  onMoreLink: function() {
    this.trigger('click:more', this.model);
    this.close();
  },

  onEnterPopover: function() {
    this.trigger('enter:popover');
    PopoverView.prototype.onEnterPopover.apply(this, arguments);
  },

  onLeavePopover: function() {
    if (this.inEditMode) {
      return;
    }

    this.trigger('leave:popover');
    PopoverView.prototype.onLeavePopover.apply(this, arguments);
  },

  forceClose: function() {
    this.inEditMode = false;
    this.close();
  },

  close: function() {
    if (this.inEditMode) {
      return;
    }

    PopoverView.prototype.close.apply(this, arguments);
  },

  onMakePrivate: function() {
    const confirmationPopup = new ActionPopupView({
      content: 'Are you sure you want to make this note private?',
      submitBtnVal: 'Yes, Make Private',
    });
    confirmationPopup.openPopup();
    this.listenTo(confirmationPopup, 'onConfirmationDidConfirmEvent', this.makePrivate);
  },

  openEditMode: function() {
    this.inEditMode = true;
    this.visibleEl.find('.note-static').hide();
    this.noteEditForm = new NoteEditForm({
      initialModel: this.model,
      container: this.visibleEl.find('.note-edit-form-wrapper'),
    });
    this.listenTo(this.noteEditForm, 'afterRender', this.reposition);
    this.listenTo(this.noteEditForm, 'cancel', this.update);
    this.trigger('change:inEditMode', this.inEditMode);
  },

  update: function() {
    this.render();
    this.updateVisiblePopover();
    this.reposition();
    this.inEditMode = false;
    this.trigger('change:inEditMode', this.inEditMode);
  },

  onDelete: function() {
    const confirmationPopup = new ActionPopupView({
      content: 'Are you sure you want to delete this note?',
      submitBtnVal: 'Yes, Delete Note',
    });
    confirmationPopup.openPopup();
    this.listenTo(confirmationPopup, 'onConfirmationDidConfirmEvent', this.destroy);
  },

  destroy: function() {
    this.model.destroy();
  },

  makePrivate: function() {
    const _this = this;
    this.model.save({ privacy_status: 0 }, {
      success: function(model) {
        model.collection.remove(model);
        _this.close();
      },
    });
  },

  showLike: function() {
    return this.model && (!this.model.get('userVote') || (this.model.get('userVote').value === 0));
  },

});

export default NotePopoverView;
