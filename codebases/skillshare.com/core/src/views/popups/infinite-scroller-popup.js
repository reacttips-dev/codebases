import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import InfiniteScrollerView from 'core/src/views/modules/infinite-scroller';

const InfiniteScrollerPopupView = AbstractPopupView.extend({

  initialize: function(options = {}) {
    AbstractPopupView.prototype.initialize.apply(this, arguments);

    _.extend(this, _.pick(options, ['containerEl', 'collection', 'collectionView']));
    _.bindAll(this, 'onFirstFetch', 'onFetch');
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);

    this.collectionView.infiniteScrollerView = new InfiniteScrollerView({
      container: this.containerEl,
      viewport: this.containerEl,
      scrollEl: this.containerEl,
      collection: this.collection,
    });

    this.collectionView.infiniteScrollerView.once('fetch:deactivate', this.onFirstFetch);
    this.collectionView.infiniteScrollerView.on('fetch:deactivate', this.onFetch);
    this.collectionView.infiniteScrollerView.fetch();
    this.collectionView.render();

    this.showLoader();
  },

  onFirstFetch: function() {
    this.hideLoader();
  },

  onFetch: function() {},

  showLoader: function() {
    this.$el.addClass('loader center-vertically');
    this.$visibleContent = this.$el.children(':visible');
    this.$visibleContent.hide();
    this.$el.append('<div class="icon-loading initial-loader"></div>');
  },

  hideLoader: function() {
    this.$el.removeClass('loader center-vertically');
    this.$('.initial-loader').remove();
    this.$visibleContent.show();
  },
});

export default InfiniteScrollerPopupView;

