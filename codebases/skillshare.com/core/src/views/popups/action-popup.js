import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import template from 'text!core/src/templates/popups/action-popup.html';

const ActionPopupView = AbstractPopupView.extend({

  preventCloseOnSubmit: false,
  templateFunc: _.template(template),

  templateData: function() {
    return this.options;
  },

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .btn-action-cancel': 'onClickCancel',
      'click .btn-action-submit': 'onClickSubmit',
    });
  },

  initialize: function(options = {}) {

    this.options = _.extend({
      title: 'Are you sure?',
      submitBtnVal: 'Submit',
      cancelBtnVal: 'Cancel',
      includeActions: true,
      padding: true,
      width: 400,
    }, options);

    AbstractPopupView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    AbstractPopupView.prototype.render.apply(this, arguments);
    this.$el.addClass('action-popup-view');
    if (this.options.padding === false) {
      this.$('.popup-content').addClass('no-padding');
    }
    this.$el.width(this.options.width);
  },

  onClickCancel: function() {
    this.preventClose = false;
    this.trigger('onPopupDidCancelEvent');
  },

  onClickSubmit: function() {
    this.trigger('onPopupDidSubmitEvent');
    this.trigger('onConfirmationDidConfirmEvent');
    if (this.preventCloseOnSubmit === false) {
      this.closePopup();
    }
  },

  disableBtnWithLabel: function(lbl) {
    const btn = this.$('.btn-action-submit');
    btn.addClass('disabled').attr('disabled', 'disabled');
    if (lbl) {
      btn.val(lbl);
    }
  },
});

export default ActionPopupView;

