import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import template from 'text!core/src/templates/popups/abuse-flag-popup.mustache';

const AbuseFlagPopup = AbstractPopupView.extend({

  className: 'abuse-flag-popup',

  template: template,

  templateData: function() {
    return this.model.attributes;
  },

  bindings: {
    '.abuse-flag-info': 'body',
  },

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .infraction-type': 'onInfractionTypeClick',
      'click .submit-report-button': 'onSubmit',
    });
  },

  initialize: function() {
    AbstractPopupView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onInfractionTypeClick', 'onSubmit');
    this.listenTo(this.model, 'change:abuseflag', this.onAbuseFlagChange);
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);

    this.$selectAbuseType = this.$('.btn-select-abuse-type');
    this.$submitButton = this.$('.submit-abuse-flag-button');
    this.$errorMessage = this.$('.error-message');
    this.$textRequiredError = this.$('.text-required-error');

    this.$textRequiredError.hide();
    this.$errorMessage.hide();
    this.stickit();
  },

  onInfractionTypeClick() {
    const abuseFlagInfractionType = parseInt(this.$('input[name=infraction]:checked').val(), 10);
    this.model.set('abuse_flag_infraction_type_id', abuseFlagInfractionType);
  },

  onSubmit: function(event) {
    event.preventDefault();

    let bodyText = null;
    const abuseFlagInfractionType = this.model.get('abuse_flag_infraction_type_id');

    if (_.isUndefined(abuseFlagInfractionType)) {
      this.$errorMessage.show();
      return;
    }

    if ($('.abuse-flag-info').val().length) {
      bodyText = this.$('.abuse-flag-info').val();
    }

    // Require a comment when a user selects 'Other' in the AbuseFlagPopup
    if (!bodyText && abuseFlagInfractionType === 7) {
      this.$textRequiredError.show();
      return;
    }

    //Set the entity_type_id equal to 'ParentClasses' in the DB
    this.model.save({
      body: bodyText,
      entity_type_id: 1,
    });

    this.afterSubmit();
  },

  afterSubmit: function() {
    SS.events.trigger('alerts:create', {
      title: 'Your report has been submitted and will be reviewed by Skillshare staff',
      type: 'success',
    });

    this.trigger('report:create');

    this.closePopup();
  },

});

export default AbuseFlagPopup;
