import InfiniteScrollerCollection from 'core/src/collections/infinite-scroller';
import User from 'core/src/models/user';

const UsersCollection = InfiniteScrollerCollection.extend({

  model: User,

  page: 0,

  loadMore: true,

  path: null,

  initialize: function(models, options = {}) {
    InfiniteScrollerCollection.prototype.initialize.apply(this, arguments);

    this.path = options.path;
    this.params = options.params || {};
  },

  url: function() {
    let url = this.path;
    const paramString = $.param(this.params);

    if (paramString !== '') {
      url += '?' + paramString;
    }

    return url;
  },

  parse: function(response) {
    InfiniteScrollerCollection.prototype.parse.apply(this, arguments);

    this.total = response.total;

    return response.users;
  },
});

export default UsersCollection;

