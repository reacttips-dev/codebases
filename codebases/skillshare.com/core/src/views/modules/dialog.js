import SSView from 'core/src/views/base/ss-view';
import DialogManager from 'core/src/utils/dialog-manager';
import UserDialogViewModel from 'core/src/models/user-dialog-view';

const DialogView = SSView.extend({

  placement: 'top', // where the dialog appears relative to the anchor, top or right

  placementPadding: 10, // extra spacing added between the dialog and the anchor when positioning

  anchor: null, // the element that this dialog anchors to

  template: null, // the contents inside of the dialog

  dialogId: null, // the unique ID for this dialog

  openOnRender: true,

  events: {
    'click .close-button': 'onClose',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['anchor', 'placement', 'dialogId', 'openOnRender']));

    if (!this.anchor) {
      throw new Error('An anchor is required to create a Dialog');
    }

    if (this.anchor.length === 0) {
      throw new Error('The anchor element was not found.');
    }

    if (!this.anchor.is(':visible')) {
      throw new Error('The anchor element is not visible');
    }

    if (!this.dialogId) {
      throw new Error('A dialogId is required to create a Dialog');
    }

    if (!this.template) {
      throw new Error('A template is required to create a Dialog');
    }

    this.$el.addClass('dialog ' + this.placement);

    this.on('dialog:close', this.onClose);

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);

    this.$el.appendTo('body');

    this.position();

    this.positionArrow();

    if (this.openOnRender) {
      this.open();
    }
  },

  position: function() {
    const offset = this.anchor.offset();

    const elementHeight = this.$el.outerHeight();
    const elementWidth = this.$el.outerWidth();
    const anchorHeight = this.anchor.outerHeight();
    const anchorWidth = this.anchor.outerWidth();

    let topPosition = 0;
    let leftPosition = 0;

    switch (this.placement) {
      case 'top':
        topPosition = offset.top - elementHeight - this.placementPadding;
        leftPosition = offset.left + ((anchorWidth / 2) - (elementWidth / 2));
        break;
      case 'bottom':
        topPosition = offset.top + anchorHeight + this.placementPadding;
        leftPosition = offset.left + ((anchorWidth / 2) - (elementWidth / 2));
        break;
      case 'right':
        topPosition = offset.top - ((elementHeight / 2) - (anchorHeight / 2));
        leftPosition = offset.left + anchorWidth + this.placementPadding;
        break;
      case 'left':
        topPosition = offset.top - ((elementHeight / 2) - (anchorHeight / 2));
        leftPosition = offset.left - elementWidth - this.placementPadding;
        break;
      default:
        break;
    }

    this.$el.css({
      top: topPosition,
      left: leftPosition,
    });
  },

  positionArrow: function() {
    if (!this.arrowPlacement) {
      return;
    }

    if (this.arrowPlacement === 'left') {
      const leftPosition = parseInt(this.$el.css('left'), 10) + 118;
      this.$el.css('left', leftPosition + 'px');
    }
  },

  open: function(reposition) {
    if (reposition) {
      this.position();
      this.positionArrow();
    }

    this.$el.show();
    this.trigger('dialog:open');
  },

  close: function() {
    DialogManager.removeCurrentDialogView();
  },

  onClose: function() {
    // Record that the current user saw this dialog
    const userDialogViewModel = new UserDialogViewModel({
      dialog_id: this.dialogId,
      user_uid: SS.currentUser.id,
    });
    userDialogViewModel.save();

    DialogManager.addViewedDialogId(this.dialogId);

    this.close();

    this.trigger('dialog:closed');
  },
});

export default DialogView;

