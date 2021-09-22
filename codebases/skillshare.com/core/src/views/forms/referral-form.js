import Utils from 'core/src/base/utils';

const ReferralFormView = Backbone.View.extend({
  events: {
    'click .invite-via-email': 'emailReferrals',
    'submit': 'pressEnterInEmailForm',
  },

  initialize: function(options) {
    _.bindAll(this, 'onSuccess', 'onError');

    this.trackingParams = !_.isUndefined(options.trackingParams) ? options.trackingParams : {};
    this.$submit = this.$('.invite-via-email');
    this.$input = this.$('.emails');
  },

  pressEnterInEmailForm: function(e) {
    e.preventDefault();
    this.emailReferrals();
  },

  emailReferrals: function() {
    const { $submit, $input } = this;
    if ($submit.hasClass('disabled')) {
      return;
    }

    const form = this.$el;
    const data = form.serializeArray();

    $submit.add($input).addClass('disabled');
    $input.removeClass('error');

    Utils.ajaxRequest(form.attr('action'), {
      type: 'POST',
      data: data,
      dataType: 'json',
      success: this.onSuccess,
      error: this.onError,
    });

    const params = _.extend({}, this.trackingParams, SS.EventTracker.classDetails({type: 'Email'}));
    SS.EventTracker.track('Clicked Share Button', {}, params);

    Backbone.trigger('shared');
  },

  onError: function() {
    const { $input } = this;
    $input.addClass('error');
    $input.add(this.$submit).removeClass('disabled');

    SS.events.trigger('alerts:create', {
      type: 'error',
      title: 'Oops, something went wrong',
    });
  },

  onSuccess: function(data) {
    if (!data.success) {
      return this.onError();
    }

    this.$input.val('').
      add(this.$submit).
      removeClass('disabled');

    SS.events.trigger('alerts:create', {
      type: 'success',
      title: 'Sent!',
    });
  },

});

export default ReferralFormView;
