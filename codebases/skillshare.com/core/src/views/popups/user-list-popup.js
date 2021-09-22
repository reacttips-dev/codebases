import Mustache from 'mustache';
import InfiniteScrollerPopupView from 'core/src/views/popups/infinite-scroller-popup';
import UsersCollection from 'core/src/collections/users';
import UserListCollectionView from 'core/src/views/collection-views/user-list-collection-view';
import template from 'text!core/src/templates/popups/user-list-popup.mustache';
import emptyMessageTemplate from 'text!core/src/templates/popups/user-list-popup-empty-message.mustache';

const MINIMUM_SEARCH_LENGTH = 3;

const UserListPopupView = InfiniteScrollerPopupView.extend({

  className: 'user-list-popup',

  centerVertically: false,

  template: template,

  containerEl: null,

  collection: null,

  collectionView: null,

  templateData: function() {
    return {
      title: this.title,
      emptyMessage: this.emptyMessage,
    };
  },

  events: function() {
    return _.extend(InfiniteScrollerPopupView.prototype.events.call(this), {
      'keyup .js-follower-following-search': 'onFollowerFollowingSearch',
    });
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['url', 'title', 'emptyMessage', 'updateCount']));

    if (!this.url) {
      throw new Error('A `url` is required for this view.');
    }

    if (!this.title) {
      throw new Error('A `title` is required for this view.');
    }

    if (!this.emptyMessage) {
      throw new Error('An `emptyMessage` is required for this view.');
    }

    if (this.updateCount) {
      this.listenTo(SS.currentUser, 'updateNumFollowing', this.updateUserCount);
    }

    InfiniteScrollerPopupView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.collection = new UsersCollection([], {
      path: this.url,
    });

    this.containerEl = this.$('.infinite-scroller-container');
    this.collectionView = new UserListCollectionView({
      el: this.containerEl,
      collection: this.collection,
      fallbackEl: this.$('.empty-area'),
    });

    InfiniteScrollerPopupView.prototype.afterRender.apply(this, arguments);
  },

  onFollowerFollowingSearch: _.debounce(function(e) {
    // Block arrow keys, shift, and escape
    // https://css-tricks.com/snippets/javascript/javascript-keycodes/
    const invalidKey = (e.which >= 37 && e.which <= 40) || e.which === 16 || e.which === 27;

    if (invalidKey) {
      return;
    }

    const searchTerm = $(e.currentTarget).val()
      .trim();

    if (searchTerm.length >= MINIMUM_SEARCH_LENGTH) {
      this.collection.params = _.extend({}, this.collection.params, {search: searchTerm});
    } else {
      // User has cleared the search
      this.collection.params = {};
    }

    // Reset pagination for every new search, start from the first page
    this.collection.page = 1;
    this.collection.trigger('update:reset-infinite-scroller', this.collection);
    this.collection.fetch({
      success: (collection) => {
        if (!collection.length) {
          // We only want to render the empty state after we've successfully fetched the collection
          this.renderEmptyState(searchTerm);

          if (this.collectionView && this.collectionView.infiniteScrollerView) {
            this.collectionView.infiniteScrollerView.deactivateFetch();
            this.collectionView.infiniteScrollerView.disable();
          }
        }
      },
    });
  }, 500),

  renderEmptyState: function(searchTerm) {
    const html = Mustache.render(emptyMessageTemplate, {searchTerm: searchTerm});

    this.$('.empty-area-container').show();
    this.$('.empty-area').html(html);
  },

  onFirstFetch: function(collection) {
    InfiniteScrollerPopupView.prototype.onFirstFetch.apply(this, arguments);

    // hide the container that isn't in use
    const total = collection.total.toString();
    if (Number(total) === 1) {
      $('.user-list-title').text('1 Friend enrolled');
    }
    const isEmpty = total === '0';
    this.$('empty-area-container').toggle(isEmpty);
    this.containerEl.toggle(!isEmpty);

    this.updateUserCount(total);
  },

  updateUserCount: function(count) {
    this.$('.num-users').text((count === '0') ? '' : count);
  },

});

export default UserListPopupView;

