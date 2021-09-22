const InfiniteScrollerView = Backbone.View.extend({

  defaults: {
    scrollEl: undefined, // The element that is scrollable. Default is set in initialize.
    viewport: undefined, // The area that sets where the next fetch must be triggered (essentially
    // the "bottom" of the page). Default is set in initialize.
    paginationEl: undefined, // Pagination element that is to be removed when infinite scroll is loaded.
    // Default is set in initialize.
    container: undefined, // The element where the fetched response gets appended
    loader: true, // Whether or not to display a loader at the bottom of the infinite scroll
    success: undefined, // Callback that is called on successful fetch
    buffer: 0, // The amount of space given to trigger a fetch before
    // the user hits the bottom of the page
    fetchOptions: {}, // Additional options to be passed to the fetch
    loadManually: false, // Load results manually instead of via infinite scroll
  },

  initialize: function(options = {}) {
    this.defaults.scrollEl = $(window);
    this.defaults.viewport = $('#page-wrapper');
    this.defaults.paginationEl = $('.pagination');

    this.options = _.extend({}, this.defaults, options);
    this.loaderEl = undefined;
    this.fetching = false;
    this.bound = false; // Ensures we don't bind the scroll event multiple times

    _.bindAll(this, 'onScroll', 'onCollectionUpdate', 'onCollectionError');
    this.onScroll = _.throttle(this.onScroll, 250, this);

    if (!this.options.loadManually) {
      if (this.collection.loadMore) {
        this.enable();
      }
    }

    this.listenTo(this.collection, 'update', this.onCollectionUpdate);
    this.listenTo(this.collection, 'update:error', this.onCollectionError);
    this.listenTo(this.collection, 'update:reset-infinite-scroller', this.onCollectionResetInfiniteScroller);

    // JS has loaded so remove the pagination links and let infinite scroll takeover
    // except if we specifically want pagination to stay there
    if (this.options.paginationEl && this.options.paginationEl.length > 0 && !this.options.paginationEl.data('permanent')) {
      this.options.paginationEl.remove();
    }
  },

  onCollectionResetInfiniteScroller: function() {
    this.deactivateFetch();
    this.disable();
    this.enable();
    this.activateFetch();
  },

  // Update infinite scroller options and viewport height
  update: function(options = {}) {
    if (this.collection.loadMore) {
      this.options = _.extend({}, this.options, options);
      this.disable();
      this.enable();
    } else {
      this.disable();
    }
  },

  onScroll: function() {
    if (!this.options.loadManually) {
      if (SS?.serverBootstrap?.pageData?.pageName === 'browse') {
        return;
      }

      const scrollTop = this.options.scrollEl.scrollTop() + this.options.scrollEl.outerHeight();
      const viewportHeight = this.options.viewport.prop('scrollHeight') - this.options.buffer;
      // The user has scrolled below the viewport
      if (scrollTop >= viewportHeight) {
        this.fetch('scroll');
      }
    }
  },

  addLoader: function() {
    if (this.options.loader && !this.loaderEl) {
      const parentEl = this.options.container.parent();
      if (parentEl.length > 0) {
        this.loaderEl = $('<div class="infinite-scroll icon-loading"></div>');
        parentEl.append(this.loaderEl);
      }
    }
  },

  removeLoader: function() {
    if (this.loaderEl) {
      this.loaderEl.remove();
      delete this.loaderEl;
    }
  },

  enable: function() {
    if (!this.bound) {
      this.options.scrollEl.scroll(this.onScroll);
      this.bound = true;
    }
    this.addLoader();
  },

  disable: function() {
    if (this.bound) {
      this.options.scrollEl.unbind('scroll', this.onScroll);
      this.bound = false;
    }
    this.removeLoader();
    this.trigger('infinitescrollerview:loaded');
  },

  activateFetch: function() {
    this.fetching = true;
    if (this.options.loader && this.loaderEl) {
      this.loaderEl.css('visibility', 'visible');
    }
    this.trigger('fetch:activate', this.collection);
  },

  deactivateFetch: function() {
    this.fetching = false;
    if (this.options.loader && this.loaderEl) {
      this.loaderEl.css('visibility', 'hidden');
    }
    this.trigger('fetch:deactivate', this.collection);
  },

  onCollectionUpdate: function(response) {
    // If there are no more in this collection, disable the view
    if (!this.collection.loadMore) {
      this.disable();
    }

    // Append the collection items to the container
    if (response.content) {this.options.container.append(response.content);}

    // Trigger success callback
    if (_.isFunction(this.options.success)) {
      this.options.success(this.collection);
    }

    // Fetch complete
    this.deactivateFetch();
  },

  onCollectionError: function() {
    this.disable();
    this.deactivateFetch();
  },

  fetch: function(action) {
    // Check to see if a fetch is currently in progress
    if (this.fetching) {
      return;
    }

    if (SS?.serverBootstrap?.pageData?.pageName === 'browse' && action === 'scroll') {
      SS.EventTracker.track('Performed-Browse-ScrollMore', {}, {
        page: this.collection.page + 1,
      });
    }

    // if fetch is triggered, this is a normal user, so fade out the pagination links
    if (this.options.paginationEl && this.options.paginationEl.length > 0) {
      this.options.paginationEl.fadeOut();
    }

    if (this.collection && _.isFunction(this.collection.fetchMore)) {
      this.activateFetch();
      this.activeFetch = this.collection.fetchMore(this.options.fetchOptions);
      // onCollectionUpdate called after fetch
    }
  },

  abort: function() {
    if (this.activeFetch && this.activeFetch.readyState < 4) {
      this.collection.page -= 1;
      this.activeFetch.abort();
      delete this.activeFetch;
    }
  },

});

export default InfiniteScrollerView;

