import SSView from 'core/src/views/base/ss-view';
import WishlistButtonView from 'core/src/views/modules/buttons/wishlist-button';
import UserListPopupView from 'core/src/views/popups/user-list-popup';
import Watchlist from 'core/src/models/watchlist';
import parentClassTemplate from 'text!core/src/templates/shared/_large-list-view-grid-item.mustache';
import classPreviewTemplate from 'text!core/src/templates/partials/_class-preview.mustache';
import classPreviewVideoTemplate from 'text!core/src/templates/partials/_class-preview-video.mustache';
import classPreviewWishlistTemplate from 'text!core/src/templates/partials/_class-preview-wishlist.mustache';
import teacherInformationTemplate from 'text!core/src/templates/partials/_teacher-information-small.mustache';
import teacherInformationMinimalTemplate from 'text!core/src/templates/partials/_teacher-information-small-minimal.mustache';
import classStatsTemplate from 'text!core/src/templates/partials/_class-stats.mustache';
import reviewStatTemplate from 'text!core/src/templates/partials/_review-stat.mustache';
import wishlistButtonIconTemplate from 'text!core/src/templates/modules/buttons/wishlist-button-icon.mustache';
import classCardContent from 'text!core/src/templates/partials/_class-card-content.mustache';
import classCardContentMinimal from 'text!core/src/templates/partials/_class-card-content-minimal.mustache';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import Common from 'core/src/common';
import RedisPublisher from 'core/src/utils/redis-publisher';

const ParentClassGridItemView = SSView.extend({

  setElementToTemplate: true,

  template: function(){
    if (this.model && this.model.collection && this.model.collection.useCssGrid) {
      return classCardContent;
    }
    return parentClassTemplate;
  },

  templatePartials: {
    'partials/_class-preview': classPreviewTemplate,
    'partials/_class-preview-video': classPreviewVideoTemplate,
    'partials/_class-preview-wishlist': classPreviewWishlistTemplate,
    'partials/_teacher-information-small': teacherInformationTemplate,
    'partials/_teacher-information-small-minimal': teacherInformationMinimalTemplate,
    'partials/_review-stat': reviewStatTemplate,
    'partials/_class-stats': classStatsTemplate,
    'partials/_class-card-content': classCardContent,
    'partials/_class-card-content-minimal': classCardContentMinimal,
  },

  templateData: function() {
    return _.extend({}, this.model.attributes, {
      clientRendered: true,
      showClassReviewCount: SS.serverBootstrap.showClassReviewCount,
    });
  },

  events: {
    'click .js-class-preview': 'onClick',
    'click .num-following-enrolled': 'followingEnrolledPopup',
  },

  afterRender: function() {
    this.setup();
    ComponentInitializers.initPopovers(this);
    Common.initNewTooltips();
    SSView.prototype.afterRender.apply(this, arguments);
  },

  setup: function() {
    const buttonOptions = {
      container: this.$('.wishlist-button-container'),
      isLabelButton: true,
      labels: [],
      styles: 'sk-icon',
      modelData: {
        parent_class_id: this.model.get('id'),
        parent_sku: this.model.get('sku'),
        wishlistId: this.model.get('wishlistId'),
        trackingParams: this._wishlistTrackingParams(),
        pupilRequestId: this.model.get('pupilRequestId'),
      },
      template: wishlistButtonIconTemplate,
      activeClass: 'ss-icon-nsk-bookmark-saved',
      inactiveClass: 'ss-icon-nsk-bookmark-save-default',
    };

    // Save Button
    this.wishlistButton = new WishlistButtonView(buttonOptions);

    SS.events.on('wishlistAdded', this.wishlistChanged.bind(this));
    SS.events.on('wishlistRemoved', this.wishlistChanged.bind(this));

    this.wishlistButton.on('createListPopover', this.lockOptionsVisible.bind(this));
    this.wishlistButton.on('destroyListPopover', this.unlockOptionsVisible.bind(this));
  },

  onClick: function(event) {
    // pass target so listener can see if the save button was clicked
    this.options.collectionView.trigger('class:click', this.model, event.target);
  },

  followingEnrolledPopup: function() {
    const url = '/home/' + this.model.get('sku') + '/followingEnrolled';
    const title = 'Friends enrolled';
    const emptyMessage = 'None of your friends are enrolled in this class.';
    new UserListPopupView({
      url: url,
      title: title,
      emptyMessage: emptyMessage,
    });
  },

  lockOptionsVisible: function() {
    this.$('.js-preview-options').css('visibility', 'visible');
  },

  unlockOptionsVisible: function() {
    this.$('.js-preview-options').css('visibility', '');
  },

  wishlistChanged: function(watchlist) {
    const sku = parseInt(watchlist.get('parent_sku'), 10);
    if (this.model && sku === this.model.get('sku')) {
      if (watchlist.has('id')) {
        if (this._wishlistTrackingParams() && this._wishlistTrackingParams().via.includes(`${Watchlist.VIA_LOGGED_IN_HOME}-row`)) {
          RedisPublisher.publishParentClass(this.model.get('sku'), RedisPublisher.EVENT_SAVE, this.model.get('pupilRequestId'));
        }
        this.model.set('wishlistId', watchlist.get('id'));
      } else {
        this.model.unset('wishlistId');
      }
      this.wishlistButton.model = watchlist;
      this.wishlistButton.update();
      this.wishlistButton.onStateChange(watchlist);
    }
  },

  _wishlistTrackingParams: function() {
    if (this.options.collectionView) {
      return this.options.collectionView.options.wishlistTrackingParams;
    }

    return {};
  },

});

export default ParentClassGridItemView;
