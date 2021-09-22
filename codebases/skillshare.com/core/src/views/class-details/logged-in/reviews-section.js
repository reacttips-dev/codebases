import PopoverView from 'core/src/views/modules/popover';
import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import ParentClassModel from 'core/src/models/parent-class';
import ClassReviewModel from 'core/src/models/review';
import TabsCollection from 'core/src/collections/tabs';
import ReviewsCollection from 'core/src/collections/reviews';
import ReviewsArchiveCollection from 'core/src/collections/reviews-archive';
import TabsCollectionView from 'core/src/views/collection-views/tabs-collection-view';
import ReviewsCollectionView from 'core/src/views/collection-views/reviews-collection-view.js';
import ReviewsArchiveCollectionView from 'core/src/views/collection-views/reviews-archive-collection-view.js';
import LeaveAReviewPopup from 'core/src/views/popups/leave-a-review-popup';
import extractQueryParams from 'core/src/utils/extract-query-params';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import ReviewsSectionTemplate from 'text!core/src/templates/class-details/shared/_reviews-section.mustache';

const ReviewsSectionView = ClassSectionView.extend({

  COLLECTION_TYPE_NEW: 1,
  COLLECTION_TYPE_ARCHIVE: 2,

  template: ReviewsSectionTemplate,

  events: {
    'click .sort-order a': 'onChangeSortMethod',
    'click .load-more': 'onLoadMore',
    'click .enabled-expectation': 'onExpectationSort',
    'click .leave-a-review-popup-btn': 'onLeaveAReviewClick',
  },

  setReviewsData: function() {
    this.setLevel();
    this.setPercentages();
    this.initReviewsTooltipPopover();
    this.initReviewsCollection();
    this.setTagCounts();

    this.parentClass = new ParentClassModel(SS.serverBootstrap.classData);

    this.bindEvents();

    this.autoDisplayForm(this.model.get('autoDisplayReviewForm'));
    this.maybeBringArchivesIntoView();
  },

  afterPreRender: function() {
    this.afterRender();
  },

  afterRender: function() {
    this.leaveAReviewButton = this.$('.leave-a-review-popup-btn');
    this.tagData = [];
    this.levels = ['none', 'beginner', 'intermediate', 'advanced', 'all', 'beg-int', 'int-adv'];
    this.aggregateReviewsData = this.model.get('aggregateReviewsData');
    this.setReviewsData();

    ClassSectionView.prototype.afterRender.apply(this, arguments);
  },

  autoDisplayForm: function(shouldAutoDisplay) {
    if (shouldAutoDisplay) {
      this.$('.js-primary-reviews-btn').trigger('click');
      this.model.set('autoDisplayReviewForm', false);
    }
  },

  bindEvents: function() {
    _.bindAll(this, 'onLeaveAReviewBtnClick');
    this.$('.leave-a-review-popup-btn').on('click', this.onLeaveAReviewBtnClick);
  },

  setTagCounts: function() {
    for(const i in this.aggregateReviewsData.tagCounts){
      this.tagData.push({
        count: this.aggregateReviewsData.tagCounts[i].value,
        name: this.aggregateReviewsData.tagCounts[i].name,
      });
    }
  },

  initReviewsCollection: function() {
    this.reviewsCollection = new ReviewsCollection(this.model.get('reviews'));
    this.reviewsCollectionView = new ReviewsCollectionView({
      collection: this.reviewsCollection,
      el: this.$('.new-reviews'),
    });

    if (this.model.get('reviewsEmpty')) {
      this.$('.empty-reviews').addClass('show');
    }

    this.archiveReviewsCollection = new ReviewsArchiveCollection(this.model.get('archiveReviews'));

    // Set load more URL on both
    const { loadMoreUrl } = this.model.attributes;

    this.reviewsCollection.url = loadMoreUrl;
    this.archiveReviewsCollection.url = loadMoreUrl;

    this.reviewsArchiveCollectionView = new ReviewsArchiveCollectionView({
      collection: this.archiveReviewsCollection,
      el: this.$('.archive-reviews'),
    });

    this.listenTo(this.reviewsCollection, 'update', this.updateLoadMoreReviews);
    this.listenTo(this.archiveReviewsCollection, 'update', this.updateLoadMoreArchiveReviews);

    if (this.model.get('aggregateReviewsData')) {
      this.setupTabs();
      this.updateMetricsSection();
    }
  },

  updateLoadMoreReviews: function() {
    if (this.reviewsCollection.loadMoreReviews === false) {
      this.$('.new-reviews-load-more').hide();
      this.maybeBringArchivesIntoView(false);
    }
  },

  maybeBringArchivesIntoView: function(hasMoreNewReviews = this.model.get('loadMoreReviews')) {
    const hasOldReviews = this.model.get('numArchiveReviews');
    if(!hasMoreNewReviews && hasOldReviews) {
      this.bringArchivesIntoView();
    }
  },

  bringArchivesIntoView: function() {
    this.$('.js-archive-container').removeClass('hide');
    const data = {
      collectionType: this.COLLECTION_TYPE_ARCHIVE,
    };
    this.getMoreReviews(this.archiveReviewsCollection, data);
  },

  updateLoadMoreArchiveReviews: function() {
    if (this.archiveReviewsCollection.loadMoreArchiveReviews === false) {
      this.$('.archive-load-more').hide();
    }
  },

  initReviewsTooltipPopover: function() {
    const $reviewsTooltipAnchor = this.$('.reviews-tooltip-icon');
    this.reviewsTooltipPopover = new PopoverView({
      autoPosition: false,
      showOnHover: true,
      arrowPlacement: 'top',
      anchor: $reviewsTooltipAnchor,
      el: $reviewsTooltipAnchor.find('.popover'),
    });

    const $mostLikedAnchor = this.$('.most-liked-icon');
    this.likedTooltipPopover = new PopoverView({
      autoPosition: true,
      showOnHover: true,
      placement: 'top',
      arrowPlacement: 'bottom',
      anchor: $mostLikedAnchor,
      el: $mostLikedAnchor.find('.popover'),
    });

    const $expectationsAnchor = this.$('.expectations-icon');
    this.likedTooltipPopover = new PopoverView({
      autoPosition: true,
      showOnHover: true,
      placement: 'top',
      arrowPlacement: 'bottom',
      anchor: $expectationsAnchor,
      el: $expectationsAnchor.find('.popover'),
    });
  },

  setupTabs: function() {
    const sortTabsData = this.model.get('reviewsSortOrder') || { tabs: [] };
    this.sortTabs = new TabsCollection(sortTabsData.tabs);

    const $sortTabs = this.$('.sort-order');
    new TabsCollectionView({
      collection: this.sortTabs,
      el: $sortTabs,
    });
  },

  getLevelingRating: function(rating) {
    if (rating >= 0 && rating < this.levels.length) {
      return rating;
    }

    return 0;
  },

  setLevel: function() {
    this.$('.tile.level .active').removeClass('active');
    const level = this.getLevelingRating(this.aggregateReviewsData.levelingRating);
    this.$('.tile.level, .tile.level .level-indicator').addClass(this.levels[level]);
    this.$(`em.${this.levels[level]}`).addClass('active');

    const numReviews = this.model.get('numNewReviews');
    const levelSetByTeacher = this.aggregateReviewsData.teacherSetLevel;
    const reviewPlural = (numReviews === 1) ? 'review' : 'reviews';

    const levelCopy = {
      teacher: '(Based on the teacher\'s recommendation)',
      generated: `(Based on ${numReviews} ${reviewPlural})`,
      empty: '(Be the first to suggest a level for this class)',
    };
    const notesElement = this.$('.tile.level .notes');

    if (level === 0) {
      notesElement.text(levelCopy.empty);
    } else if (levelSetByTeacher === true) {
      notesElement.text(levelCopy.teacher);
    } else {
      notesElement.text(levelCopy.generated);
    }
  },

  displayTags: function() {
    if (this.tagData.length > 0){
      for (const i in this.tagData) {
        const tag = this.tagData[i];
        const tagElement = this.$(`.tile.likes li[data-value='${i}']`);
        tagElement.children('.ss-icon-heart').text(tag.count);
        tagElement.children('.tagName').text(tag.name);
      }
      this.$('.tile.likes').removeClass('empty');
      this.$('.tile.likes .icon-circle').addClass('mute-popover');
    }
  },

  setPercentages: function() {
    const tile = this.$('.tile.expectations');
    if (Object.keys(this.aggregateReviewsData.overallRatingPercentages).length > 0) {
      for(const i in this.aggregateReviewsData.overallRatingPercentages) {
        const ratingData = this.aggregateReviewsData.overallRatingPercentages[i];
        const targetElement = this.$(`.tile.expectations li[data-value='${i}']`);
        targetElement.children('.graph-item')
          .children('span')
          .css('width', `${ratingData.avg}%`);
        targetElement.children('.percentage').text(`${ratingData.avg}%`);
        targetElement.addClass('enabled-expectation');
      }
      tile.removeClass('empty');
      this.$('.tile.expectations .icon-circle').addClass('mute-popover');
      if (tile.data('sorted')) {
        this.$(`.tile.expectations li[data-value='${tile.data('sorted')}']`).addClass('active');
      }
    }
  },

  updateMetricsSection: function() {
    this.aggregateReviewsData = this.model.get('aggregateReviewsData');

    this.tagData = [];
    for(const i in this.aggregateReviewsData.tagCounts){
      this.tagData.push({
        count: this.aggregateReviewsData.tagCounts[i].value,
        name: this.aggregateReviewsData.tagCounts[i].name,
      });
    }

    this.setLevel();
    this.displayTags();
    this.setPercentages();
    this.initReviewsTooltipPopover();

    this.canReview();
  },

  canReview: function() {
    if (!this.model.get('canReview')) {
      this.$('.leave-a-review-popup-btn').addClass('disabled');
      const $leaveReviewTooltipAnchor = this.$('.leave-a-review-popup-btn');
      this.leaveReviewTooltipPopover = new PopoverView({
        autoPosition: true,
        showOnHover: true,
        placement: 'top',
        arrowPlacement: 'bottom',
        anchor: $leaveReviewTooltipAnchor,
        el: $leaveReviewTooltipAnchor.find('.popover'),
      });
    }
  },

  onChangeSortMethod: function(e) {
    e.preventDefault();
    const anchor = e.target;
    // update the url in the window
    const href = anchor.href.replace(window.location.protocol + '//' + window.location.hostname, '');
    Backbone.history.navigate(href);
    const sortMethod = extractQueryParams(href).reviewsSort;
    if (this.model.get('currentSort') !== sortMethod) {
      this.$('#reviews-section').addClass('loading-overlay');

      this.model.fetch({
        data: {reviewsSort: sortMethod},
        success: () => {
          this.initReviewsCollection();
          this.$el.removeClass('loading-overlay');
        },
      });
    }
  },

  onLoadMore: function(e) {
    e.preventDefault();
    // Determine the collection to which we'll be appending
    const elementData = $(e.currentTarget).data('value');
    const loadMoreCollection = (elementData === this.COLLECTION_TYPE_NEW) ? this.reviewsCollection : this.archiveReviewsCollection;
    const { length } = loadMoreCollection;
    const data = {};

    // Expectations sort only works on the New Reviews section, not archive
    if (this.model.get('expectationsSort') && elementData === this.COLLECTION_TYPE_NEW) {
      data.expectationsSort = this.model.get('expectationsSort');
    }
    data.offset = length;
    data.collectionType = elementData;
    this.getMoreReviews(loadMoreCollection, data);
  },

  getMoreReviews: function(collection, data, success) {
    collection.fetch({
      update: true,
      remove: false,
      loadMore: true,
      data,
      success,
    });
  },

  onExpectationSort: function(e) {
    e.preventDefault();
    // Determine the collection to which we'll be appending
    const expectationSortElement = $(e.currentTarget);
    const expectationSortValue = expectationSortElement.data('value');

    if (this.model.get('expectationsSort') !== expectationSortValue) {
      this.$('#reviews-section').addClass('loading-overlay');

      this.model.fetch({
        data: {expectationsSort: expectationSortValue},
        success: () => {
          this.initReviewsCollection();
          this.$el.removeClass('loading-overlay');
          this.$('.tile.expectations').addClass('sorted')
            .attr('data-sorted', expectationSortValue);
        },
      });
    }
  },

  onReviewBtnHover: function(e) {
    if (!$(e.currentTarget).hasClass('disabled')) {
      this.leaveReviewTooltipPopover.destroy();
    }
  },

  getReviewModel: function() {
    if (this.model.get('currentUserHasReviewed')) {
      return new ClassReviewModel(this.model.get('currentUserReviewData'));
    }
    return new ClassReviewModel({
      parentClassSku: this.parentClass.get('sku'),
    });
  },

  openLeaveAReviewPopup: function() {
    const { pageData } = SS.serverBootstrap;
    // User review model
    if (!this.userReview) {
      this.userReview = this.getReviewModel();
    }

    let aboutData = SS.serverBootstrap.pageData.aboutData.description;
    if (typeof aboutData === 'string') {
      aboutData = aboutData.replace(/<img .*?>/g, '');
    }

    const leaveAReviewPopup = new LeaveAReviewPopup({
      model: this.userReview,
      aboutData,
      pageData,
    });

    // Add listener to trigger rerender on review submit
    this.listenTo(leaveAReviewPopup, 'review:create', this.ajaxUpdateOnReviewCollection);

    return leaveAReviewPopup;
  },

  // Update collection and reinitiliaze Reviews Collections
  ajaxUpdateOnReviewCollection: function() {
    this.initReviewsCollection();
  },

  onLeaveAReviewBtnClick: function(ev) {
    ev.preventDefault();
    if (!$(ev.currentTarget).hasClass('disabled')) {
      const leaveAReviewPopup = this.openLeaveAReviewPopup();
      this.listenTo(leaveAReviewPopup, 'review:create', () => {
        this.model.set('reviewBtnCopy', 'Edit Review');
      });
      const isNewReview = this.userReview.isNew();
      // Only track if it's a review that hasn't been left yet
      if (isNewReview) {
        const mixPanelSrc = $(ev.target).data('mixpanelSrc');
        this.reviewButtonTracking(leaveAReviewPopup, mixPanelSrc);
      }
    }
    this.triggerMemberPopups(ev);
  },

  reviewButtonTracking: function(leaveAReviewPopup, mixPanelSrc) {
    const params = SS.EventTracker.classDetails({origin: mixPanelSrc});

    SS.EventTracker.track('Start Review', {}, params);

    this.listenTo(leaveAReviewPopup, 'review:create', function() {
      SS.EventTracker.track('Submit Review', {}, params);
    });
  },

  triggerMemberPopups: function(event) {
    if (!SS.serverBootstrap.userData.isMember) {
      new TwoPanelSignupView({
        'state': 'signup',
      });
    } else if (!SS.serverBootstrap.userData.isPremiumMember && SS.serverBootstrap.parentClassData.is_premium) {
      SS.events.trigger('premiumpopup:open', {
        event,
      });
    }
  },
});

export default ReviewsSectionView;
