import PopoverView from 'core/src/views/modules/popover';
import template from 'text!core/src/templates/popovers/confirmation-popover.mustache';

const ConfirmationPopoverView = PopoverView.extend({

  className: 'popover confirmation-popover',

  addShadow: true,

  placement: 'top',

  template: template,

  templateData: function() {
    return _.pick(this.options, ['message', 'confirmButtonText']);
  },

  onPopoverCreated: function() {
    PopoverView.prototype.onPopoverCreated.apply(this, arguments);
    const _this = this;
    this.visibleEl.find('.confirmation-button').on('click', function() {
      _this.onConfirm();
    });
    this.visibleEl.find('.cancel-button').on('click', function() {
      _this.onCancel();
    });
  },

  onConfirm: function() {
    this.trigger('confirm');
    this.close();
  },

  onCancel: function() {
    this.trigger('cancel');
    this.close();
  },

});

export default ConfirmationPopoverView;

