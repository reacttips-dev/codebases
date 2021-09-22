import BaseShareView from 'core/src/views/modules/base-share';
import extractQueryParams from 'core/src/utils/extract-query-params';

const ClassShareView = BaseShareView.extend({

  onboarding: false,

  className: 'base-share class-share',

  templateData: function() {
    const queryParams = extractQueryParams();
    return _.extend({
      viewTitle: this.viewTitle,
      viewDescription: this.viewDescription,
      via: this.via,
      utm_campaign: queryParams.utm_campaign,
      utm_source: queryParams.utm_source,
      utm_medium: queryParams.utm_medium,
      showCompact: this.showCompact,
    }, this.model.attributes);
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['onboarding', 'roster', 'viewTitle', 'viewDescription', 'showCompact']));

    this.via = this.onboarding ? 'class-onboarding-share' : 'class-details-share-popup';
    this.viewTitle = this.viewTitle || 'Share This Class';
    this.viewDescription = this.viewDescription || 'Know someone who might love this class?<br/>Let them know about it!';

    BaseShareView.prototype.initialize.apply(this, arguments);
  },
});

export default ClassShareView;

