import extractQueryParams from 'core/src/utils/extract-query-params';

const Share = Backbone.Model.extend({
  urlRoot: '/shares/track',

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);

    if (!this.get('type')) {
      throw new Error('Missing `type` attribute');
    }

    if (!this.get('method')) {
      throw new Error('Missing `method` attribute');
    }

    if (!this.get('via')) {
      throw new Error('Missing `via` attribute');
    }
  },

  toJSON: function() {
    Backbone.trigger('shared');

    let response = _.clone(this.attributes);

    if (response.parentClassId) {
      response.object_type = 'ParentClasses';
      response.object_id = response.parentClassId;
    }

    if (response.workshopId) {
      response.object_type = 'Workshop';
      response.object_id = response.workshopId;
    }

    response = _.pick(response, 'method', 'via', 'type', 'object_id', 'object_type', 'num_recipients');

    // Get UTM data from query string
    const queryParams = extractQueryParams();
    response.utm_campaign = queryParams.utm_campaign;
    response.utm_medium = queryParams.utm_medium;
    response.utm_source = queryParams.utm_source;

    return response;
  },

}, {
  METHODS: {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    PINTEREST: 'pinterest',
    MANUAL_EMAIL: 'manual-email',
    GMAIL_CONTACTS: 'gmail-contacts',
  },
  TYPES: {
    LINK: 1,
    REFERRAL_LINK: 2,
  },
});

export default Share;

