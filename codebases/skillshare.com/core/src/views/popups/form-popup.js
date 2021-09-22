import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import FormHelpers from 'core/src/helpers/form-helpers';

const FormPopupView = AbstractPopupView.extend({

  centerVertically: false,
  className: 'form-popup-view',
  preventClose: true,

  templateData: function() {
    return this.options;
  },

  templateFunc: function() {},

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .submit-btn': 'submit',
      'click #notify_all_students': 'toggleEmailSubjectField',
    });
  },

  initialize: function(options) {
    _.bindAll(this, 'onSuccess', 'onFormRendered');
    this.postUrl = options.postUrl || null;
    AbstractPopupView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);
    $(FormHelpers).off('form:render')
      .on('form:render', this.onFormRendered);
    FormHelpers.renderForm(this.$('form'));
    this.model = new Backbone.Model();
    this.model.url = this.$('form').attr('action') || this.postUrl;
    this.model.sync = function(method, model, options) {
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', $.cookie('YII_CSRF_TOKEN'));
      };
      return Backbone.sync.apply(this, arguments);
    };
    this.$notifyAll = this.$('#notify_all_students');
    this.$emailSubjectField = this.$('.email-subject-field');
  },

  onFormRendered: function() {
    this.centerPopup();
  },

  submit: function(e) {
    e.preventDefault();
    const el = $(e.currentTarget);
    if (!el.hasClass('disabled')) {
      // Remove any previous form errors
      FormHelpers.clearFormErrors(this.$('form'));
      // Clean form (we don't want placeholder copy to be interpretted as input)
      FormHelpers.clean(this.$('form'));
      // Save with json
      const data = FormHelpers.formDataToJSON(this.$('form'));
      this.model.save(data, { success: this.onSuccess });
      // Disable button
      el.addClass('disabled').attr('disabled', 'disabled');
    }
  },

  onSuccess: function(model, response) {
    if (response.success && response.redirectUrl) {
      // Success
      window.location = response.redirectUrl;
    } else {
      // Fail
      const _this = this;
      if (response.formErrors !== undefined) {
        _.each(response.formErrors, function(el, index) {
          const msg = el[0];
          const newEl = _this.$('#' + index);
          FormHelpers.showFieldMessage(newEl, msg, {});
        });
      }

      // handle errors keyed on the attribute names
      if (response.errors !== undefined) {
        _.each(response.errors, function(key, value) {
          const msg = key[0];
          const el = _this.$('[name=' + value + ']');
          FormHelpers.showFieldMessage(el, msg, {});
        });
      }

      // Restore placeholders
      FormHelpers.restorePlaceholders(this.$('form'));

      // Restore button
      this.$('.submit-btn').removeClass('disabled')
        .removeAttr('disabled');
    }
  },

  toggleEmailSubjectField: function() {
    const isChecked = this.$notifyAll.prop('checked');
    this.$emailSubjectField.toggle(isChecked);
  },

});

export default FormPopupView;

