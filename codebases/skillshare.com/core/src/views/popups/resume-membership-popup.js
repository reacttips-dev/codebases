import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import extractQueryParams from 'core/src/utils/extract-query-params';
import Utils from 'core/src/base/utils';
import template from 'text!core/src/templates/popups/resume-membership-popup.mustache';

const ResumeMembershipPopupView = AbstractPopupView.extend({

  className: 'resume-membership-popup',

  template: template,

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click #resume-membership-id': 'clickAndDisable',
    });
  },

  resumeUrl: SS.serverBootstrap.pageData.resumeUrl,

  initialize: function(options = {}) {
    this.options = options;

    AbstractPopupView.prototype.initialize.apply(this, arguments);
  },

  clickAndDisable: function (e) {
    e.preventDefault();
    $(e.target).addClass('disabled');

    const content = $(e.target).closest('.content');
    content.addClass('loading-overlay');

    const endpoint = this.resumeUrl.split('?')[0];
    const queryParams = extractQueryParams(this.resumeUrl);


    Utils.ajaxRequest(endpoint, {
      type: 'POST',
      data: queryParams,
      success: function(response) {
        window.location.href = response.data.redirect;
      },
      error: function(err) {
        window.location.href = err.responseJSON.data.redirect;
      },
      done: function() {
        content.removeClass('loading-overlay');
      },
    });

  },
});

export default ResumeMembershipPopupView;

