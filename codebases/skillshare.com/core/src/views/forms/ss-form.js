import SSView from 'core/src/views/base/ss-view';

const SSForm = SSView.extend({

  enabled: true,

  afterRender: function() {
    this.$actionButtons = this.$('.action-button');
    SSView.prototype.afterRender.apply(this, arguments);
  },

  onSubmitButton: function() {
    if (this.enabled) {
      this.$actionButtons.addClass('disabled');
      this.enabled = false;
    }
  },

  onSubmitSuccess: function() {
    this.enabled = true;
    this.$actionButtons.removeClass('disabled');
  },

  onSubmitFail: function() {
    this.enabled = true;
    this.$actionButtons.removeClass('disabled');
  },

});

export default SSForm;


