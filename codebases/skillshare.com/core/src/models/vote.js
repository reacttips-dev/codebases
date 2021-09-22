

const Vote = Backbone.Model.extend({

  urlRoot: '/votes',

  initialize: function(attributes, options = {}) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    if (this.isNew && !_.isUndefined(options.voteable)) {
      this.set('voteable_id', options.voteable.id);
      this.set('voteable_type', options.voteable.get('type'));
    }
  },

  hasUserVoted: function() {
    return this.get('value') == 1;
  },

});

export default Vote;

