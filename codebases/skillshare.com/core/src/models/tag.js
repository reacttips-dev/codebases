import Utils from 'core/src/base/utils';

const Tag = Backbone.Model.extend({

  url: function() {
    if (this.get('following')) {
      return '/tags/' + this.get('id') + '/follow';
    } else {
      return '/tags/' + this.get('id') + '/unfollow';
    }
  },

  constructor: function(options) {
    this.options = _.extend({}, options);
    this.parentClass = this.options.collection && this.options.collection.parentClass;
    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  sync: function() {
    // Override Sync to use POST
    Utils.ajaxRequest(this.url(), _.extend({}, this.attributes, {
      type: 'POST',
    }));
  },

  toggleFollow: function() {
    this.set({ following: !this.get('following') });
    this.sync();
  },
});

export default Tag;

