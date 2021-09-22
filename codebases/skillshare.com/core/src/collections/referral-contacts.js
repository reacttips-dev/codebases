import Contact from 'core/src/models/contact';

const ReferralContactsCollection = Backbone.Collection.extend({
  initialize: function(models, options) {
    _.extend(this, _.pick(options, ['referralData']));
  },
  model: Contact,
});

export default ReferralContactsCollection;

