import PopoverView from 'core/src/views/modules/popover';
import UserModel from 'core/src/models/user';
import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import ProjectsCollection from 'core/src/collections/projects';
import ProjectsCollectionView from 'core/src/views/collection-views/projects-collection-view';
import ParentClassesCollection from 'core/src/collections/basic-parent-classes';
import ParentClassesCollectionView from 'core/src/views/collection-views/parent-classes-collection-view';
import ParentClassGridItemView from 'core/src/views/item-views/parent-class-grid-item-view';
import EmailSharePopupView from 'core/src/views/popups/email-share-popup';
import FollowUserButton from 'core/src/views/modules/buttons/follow-user-button';
import HomeSectionTemplate from 'text!core/src/templates/class-details/shared/_home-section.mustache';
import UserProjectTemplate from 'text!core/src/templates/class-details/shared/_user-project.mustache';
import TagsSectionTemplate from 'text!core/src/templates/class-details/shared/_tags-section.mustache';
import LevelSectionTemplate from 'text!core/src/templates/class-details/shared/_level-section.mustache';
import AboutThisClassTemplate from 'text!core/src/templates/class-details/shared/_about-this-class.mustache';
import TopProjectsTemplate from 'text!core/src/templates/class-details/shared/_top-projects.mustache';
import ClassStatsTemplate from 'text!core/src/templates/partials/_class-stats.mustache';
import StatsColumnTemplate from 'text!core/src/templates/class-details/shared/_stats-column.mustache';
import ReferralPromoTemplate from 'text!core/src/templates/shared/_referral-promo.mustache';
import SmallListViewGridItem from 'text!core/src/templates/shared/_small-list-view-grid-item.mustache';
import LargeListViewGridTemplate from 'text!core/src/templates/shared/_large-list-view-grid.mustache';
import LargeListViewGridItemTemplate from 'text!core/src/templates/shared/_large-list-view-grid-item.mustache';
import ClassPreviewTemplate from 'text!core/src/templates/partials/_class-preview.mustache';
import ClassPreviewVideoTemplate from 'text!core/src/templates/partials/_class-preview-video.mustache';
import UserInformationSmallTemplate from 'text!core/src/templates/partials/_user-information-small.mustache';
import UserInformationLargeTemplate from 'text!core/src/templates/partials/_user-information-large.mustache';
import UserSnippetTemplate from 'text!core/src/templates/partials/_user-snippet.mustache';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import AbuseFlagModel from 'core/src/models/abuse-flag';
import ParentClassModel from 'core/src/models/parent-class';
import AbuseFlagPopup from 'core/src/views/popups/abuse-flag-popup';

const HomeSectionView = ClassSectionView.extend({

  template: HomeSectionTemplate,

  PLAYLIST_SEL: '.js-video-playlist-module',
  LESSONS_TAB: '.js-video-playlist-module-lessons-tab',
  PLAYER_CONTAINER: '.js-video-and-playlist-container',
  TOP_PLAYER_CONTAINER: '.js-cd-video-player-container',

  MIN_WIDTH_NEEDED: 940,

  playlist: null,
  saveButton: null,

  templatePartials: {
    'class-details/shared/_user-project': UserProjectTemplate,
    'shared/_referral-promo': ReferralPromoTemplate,
    'shared/_small-list-view-grid-item': SmallListViewGridItem,
    'shared/_large-list-view-grid': LargeListViewGridTemplate,
    'shared/_large-list-view-grid-item': LargeListViewGridItemTemplate,
    'class-details/shared/_stats-column': StatsColumnTemplate,
    'partials/_class-preview': ClassPreviewTemplate,
    'partials/_class-preview-video': ClassPreviewVideoTemplate,
    'partials/_user-information-small': UserInformationSmallTemplate,
    'partials/_user-information-large': UserInformationLargeTemplate,
    'class-details/shared/_tags-section': TagsSectionTemplate,
    'class-details/shared/_level-section': LevelSectionTemplate,
    'class-details/shared/_about-this-class': AboutThisClassTemplate,
    'class-details/shared/_top-projects': TopProjectsTemplate,
    'partials/_class-stats': ClassStatsTemplate,
    'partials/_user-snippet': UserSnippetTemplate,
  },

  templateData: function() {
    return this.model.attributes;
  },

  events: {
    'click .view-reviews': 'onClickViewReviews',
    'click .email.share-button': 'onClickEmailShare',
    'click .js-abuse-flag-href': 'onAbuseFlagClick',
  },

  initialize: function() {
    this.levelSelectors = ['none', 'beginner', 'intermediate', 'advanced', 'all', 'beg-int', 'int-adv'];
    this.initReviewsTooltipPopover();
    this.parentClass = new ParentClassModel(SS.serverBootstrap.classData);
    this.initLoggedOutAccordion();
    ClassSectionView.prototype.initialize.apply(this, arguments);
  },

  initProjectsCollection: function() {
    const projectsData = this.model.get('topProjects');

    this.projectsCollection = new ProjectsCollection(projectsData);

    // We know we don't want any more
    this.projectsCollection.loadMore = false;
    this.projectsCollection.page = 0;
  },

  initProjectsCollectionView: function() {
    if (_.isEmpty(this.model.attributes)) {
      return;
    };
    const $projectsList = this.$('.projects-list');
    this.projectsCollectionView = new ProjectsCollectionView({
      collection: this.projectsCollection,
      data: this.model.attributes,
      prependTemplate: null,
      el: $projectsList,
    });
    this.projectsCollectionView.collection.each(this._bubbleChanges, this);
  },

  initReviewsTooltipPopover: function() {
    const $reviewsStatsSectionAnchor = this.$('.reviews-stats-column');
    this.reviewsStatsSectionPopover = new PopoverView({
      autoPosition: false,
      showOnHover: true,
      anchor: $reviewsStatsSectionAnchor,
      el: $reviewsStatsSectionAnchor.find('.popover'),
    });
  },

  afterRender: function() {
    // initialize follow user button
    const teacherInfo = this.model.get('teacherInfo');
    new FollowUserButton({
      container: this.$('.follow-button-wrapper'),
      classes: 'follow-button-link-style',
      modelData: {
        user: new UserModel({ uid: teacherInfo.teacherUid }),
        followingId: teacherInfo.user_is_following ? teacherInfo.teacherUid : false,
      },
    });
    this.initProjectsCollection();
    this.initProjectsCollectionView();

    if (this.model.get('relatedClasses') && this.model.get('relatedClasses').list.length) {
      this.initRelatedClasses();
    }

    this.setClassLevel();

    ClassSectionView.prototype.afterRender.apply(this, arguments);
  },

  initRelatedClasses: function() {
    this.relatedClasses = new ParentClassesCollection(this.model.get('relatedClasses').list);

    this.relatedClassesCollectionView = new ParentClassesCollectionView({
      collection: this.relatedClasses,
      el: this.$('.class-list-view'),
      itemView: ParentClassGridItemView,
    });
  },

  afterPreRender: function() {
    this.afterRender();
  },

  getLevelingRating: function(rating) {
    if(Number.isInteger(rating) && (rating >= 0 && rating < (this.levelSelectors.length))) {
      return rating;
    }
    return 0;
  },

  setClassLevel: function() {
    const level = this.getLevelingRating(this.model.attributes.displayLevelingRating);
    this.$('.level li').removeClass('active');
    this.$(`.level li[data-value='${level}']`).addClass('active');
    this.$('.level-indicator').addClass(this.levelSelectors[level]);
  },

  onClickViewReviews: function(event) {
    event.preventDefault();
  },

  onClickEmailShare: function() {
    if (!SS.currentUser.isGuest()) {
      new EmailSharePopupView({
        model: new Backbone.Model(SS.serverBootstrap.classData.parentClass),
      });
    }
  },

  onAbuseFlagClick: function(ev) {
    if (!SS.serverBootstrap.userData.isMember) {
      new TwoPanelSignupView({
        'state': 'signup',
      });
    } else {
      ev.preventDefault();
      this.userAbuseFlag = new AbuseFlagModel({
        parentClassSku: this.parentClass.get('sku'),
        uid: SS.serverBootstrap.userData.id,
      });
      new AbuseFlagPopup({
        model: this.userAbuseFlag,
      });
    }
  },

  initLoggedOutAccordion: function() {
    $('.js-accordion').click((e) => {
      $(e.target).removeClass('accordion-collapsed');
      $(e.target).removeClass('js-accordion');
    });
  }
});

export default HomeSectionView;
