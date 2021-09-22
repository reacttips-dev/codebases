import BaseSharePopupView from 'core/src/views/popups/base-share-popup';
import extractQueryParams from 'core/src/utils/extract-query-params';
import template from 'text!core/src/templates/popups/email-share-popup.mustache';

const EmailSharePopupView = BaseSharePopupView.extend({

  via: 'email-share-popup',

  className: 'base-share-popup email-share-popup',

  template: template,

  templateData: function() {
    const queryParams = extractQueryParams();
    return _.extend({
      via: this.via,
      popupTitle: this.popupTitle,
      showCompact: true,
      utm_campaign: queryParams.utm_campaign,
      utm_source: queryParams.utm_source,
      utm_medium: queryParams.utm_medium,
    }, this.model.attributes);
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['via', 'popupTitle']));
    BaseSharePopupView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    BaseSharePopupView.prototype.afterRender.apply(this, arguments);
  },

});

export default EmailSharePopupView;

