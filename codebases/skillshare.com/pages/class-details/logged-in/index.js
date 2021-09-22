import SSView from 'core/src/views/base/ss-view';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import {MUTED_COOKIE_NAME} from 'core/src/views/modules/video/volume';
import URLHelpers from 'core/src/helpers/url-helpers';
import PremiumUpgradePopupHelper from 'core/src/helpers/premium-upgrade-popup';
import ClassesDetailsRouter from 'core/src/routers/class-details';
import ClassModel from 'core/src/models/class';
import ClassSectionModel from 'core/src/models/class-section';
import RosterModel from 'core/src/models/roster';
import UserModel from 'core/src/models/user';
import VideoSessionModel from 'core/src/models/video-session';
import AbuseFlagModel from 'core/src/models/abuse-flag';
import ProjectsSectionModel from 'core/src/models/class-details/shared/projects-section';
import DiscussionsSectionModel from 'core/src/models/class-details/shared/discussions-section';
import TranscriptsSectionModel from 'core/src/models/class-details/shared/transcripts-section';
import TabsCollection from 'core/src/collections/tabs';
import TabsCollectionView from 'core/src/views/collection-views/tabs-collection-view';
import VideoUnitsCollection from 'core/src/collections/video-units';
import VideoSessionsCollection from 'core/src/collections/video-sessions';
import VideoPlayerView from 'core/src/views/class-details/logged-in/video-player';
import HomeSectionView from 'core/src/views/class-details/logged-in/home-section';
import LessonsSectionView from 'core/src/views/class-details/logged-in/lessons-section';
import ReviewsSectionView from 'core/src/views/class-details/logged-in/reviews-section';
import ProjectsSectionView from 'core/src/views/class-details/logged-in/projects-section';
import TranscriptsSectionView from 'core/src/views/class-details/logged-in/transcripts-section';
import DiscussionsSectionView from 'core/src/views/class-details/logged-in/discussions-section';
import DiscussionViewSectionView from 'core/src/views/class-details/logged-in/discussion-view-section';
import HeaderView from 'core/src/views/modules/header';
import ShareLinksView from 'core/src/views/modules/share-links';
import WelcomeBannerView from 'core/src/views/modules/welcome-banner';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import ActionPopupView from 'core/src/views/popups/action-popup';
import ClassSharePopoverView from 'core/src/views/popovers/class-share-popover';
import AddToCalendarPopoverView from 'core/src/views/popovers/add-to-calendar-popover';
import PopoverView from 'core/src/views/modules/popover';
import SocialShareButtonsView from 'core/src/views/modules/social-share-buttons';
import AbuseFlagPopup from 'core/src/views/popups/abuse-flag-popup';
import AdminMenuView from 'core/src/views/modules/admin-menu/admin-menu-classes';
import TeacherMenuView from 'core/src/views/modules/teacher-menu/teacher-menu-classes';
import FollowUserButton from 'core/src/views/modules/buttons/follow-user-button';
import WishlistButton from 'core/src/views/modules/buttons/wishlist-button';
import ClassDetailsFollowDialogView from 'core/src/views/modules/dialogs/class-details-follow-dialog';
import unenrollConfirmPopupTemplate from 'text!core/src/templates/popups/unenroll-confirm.mustache';
import wishlistButtonIconTemplate from 'text!core/src/templates/modules/buttons/wishlist-button-icon.mustache';
import LearnModeView from 'core/src/views/modules/learn-mode';
import Utils from 'core/src/base/utils';
import DialogManager from 'core/src/utils/dialog-manager';
import Mustache from 'mustache';
import SubtitlesState from 'core/src/models/video/subtitles-state';
import FreeAccessLinkConfirmationPopup from '../../../core/src/views/popups/free-access-link-confirmation-popup';
import AuthHelper from '../../../core/src/helpers/auth-helper';
import 'jquery-cookie';



const ROSTER_STATUS_COMPLETED = 2;

const ClassesController = SSView.extend({

  el: 'body',

  TABLET_BREAK_POINT: 1000,
  MOBILE_DOWNLOAD_BANNER_SELECTOR: '.js-mobile-download-banner',
  FOLLOW_BUTTON_WRAPPER_SELECTOR: '.js-follow-button-wrapper-cd',
  HOME_SECTION_CONTAINER_SELECTOR: '.js-home-section-container',

  currentSection: null,
  currentSectionModel: null,
  updatePreRenderedData: false,
  regions: {
    nav: '#nav-region',
    video: '#video-region',
    content: '#content-region',
  },

  classHeader: {
    wrapper: {
      $el: null,
      $placeholder: null,
    },
    content: {
      $el: null,
      $children: null,
    },
    outerHeight: 0,
  },

  navigationHeader: {
    wrapper: {
      $el: null,
      $placeholder: null,
    },
    outerHeight: 0,
  },

  mainRegion: {
    $el: null,
    minHeight: 0,
  },

  siteFooter: {
    $el: null,
    outerHeight: 0,
  },

  fixedHeaders: {
    shown: false,
    scrollTop: 0,
  },

  window: {
    $el: null,
  },

  learnModeOn: false,

  lessonId: undefined,

  premiumPopup: PremiumUpgradePopupHelper,

  // Marks whether initial page load has completed
  isFirstSectionLoaded: false,

  hasPushStateSupport: true,

  userReview: null,

  // Collection of sessions that have been played at least once
  playedSessions: null,

  // Whether or not to trigger the reviews form automatically on Review Tab load
  autoDisplayReviewForm: false,

  /**
   * Lifecycle Methods
   */

  events: {
    'click .class-teacher .user-information': 'onClickTeacherInfo',
    'click .class-teacher-info .view-teacher-info': 'onClickTeacherInfo',
    'click .section-navigation': '_route',
    'click .js-close-recommend': 'onRecommendCloseClick',
    'click .js-recommend-class-box .btn-option-yes': 'onRecommendSureClick',
    'click .js-recommend-class-box .btn-option-no': 'onRecommendCloseClick',
    'click .join-module a': 'initializePremiumPopupOnClick',
    'click a.locked-enroll-button': 'initializePremiumPopupOnClick',
    'click .unenroll': 'onUnenroll',
    'click .mark-as-complete': 'onMarkAsComplete',
    'click .class-user-menu .action-item': 'onUserMenuItemClick',
    'click .share-menu-popover .share-item': 'onShareMenuItemClick',
    'click .mobile-download-banner .js-open-in-app-link': 'onClickOpenInApp',
    'click .mobile-download-banner .js-install-the-app-link': 'onClickInstallTheApp',
    'click .mobile-download-banner .js-mobile-download-banner-close': 'onCloseMobileDownloadBanner',
  },

  initialize: function () {
    const {pageData} = SS.serverBootstrap;

    // bind listenTo handlers to `this`
    _.bindAll(this, 'routeToMode', 'toggleRouteToMode', 'triggerShowSharePopover');

    // We need to select both html and body for scrollTop rather than using this.$el because
    // Firefox places the overflow at the html level rather than body like in Chrome/Safari
    this.documentEl = $('html, body');

    // Used to determine if the current view was prerendered
    // by the server.
    this.preRendered = Utils.getPathname(this.hasPushStateSupport);

    this.legacyRendered = pageData.legacyRendered;

    this.baseRendered = $.Deferred();

    this.hasPushStateSupport = Utils.hasPushStateSupport();

    // We need something that responds to `navigate()`.
    this.router = new ClassesDetailsRouter({
      classes: this,
    });

    // Store our views. This is a hash that has view name as
    // the key pointing to the view.
    this._views = {};

    // Class model
    this.classModel = new ClassModel(SS.serverBootstrap.classData);

    // User roster model
    if (pageData.currentUserRoster) {
      this.rosterModel = new RosterModel(pageData.currentUserRoster);
    }

    // define review button vars
    this.abuseFlagButton = this.$('.abuse-flag-popup-btn');

    const shareModel = new Backbone.Model(_.extend(
      SS.serverBootstrap.pageData.videoPlayerData.shareLinks,
      SS.serverBootstrap.classData.parentClass
    ));
    new SocialShareButtonsView({
      el: this.$('.social-share-buttons-wrapper'),
      model: shareModel,
      hideShortUrl: true,
    });

    // Parent class model
    this.parentClassModel = new Backbone.Model(this.classModel.get('parentClass'));

    AuthHelper.initializeGoogleOneTouch();

    // Units collection
    const units = new VideoUnitsCollection(pageData.unitsData.units, {parse: true});
    // Share Popover
    if (this._shouldCreateSharePopover()) {
      this.sharePopover = new ClassSharePopoverView({
        autoPosition: false,
        anchor: this.$('.share-twitter'),
        el: this.$('.class-share-popover'),
        model: this.parentClassModel,
        roster: this.rosterModel,
        userIsAffiliateReferrer: pageData.userIsAffiliateReferrer,
        showCompact: true,
        showOnHover: true,
        HOVER_OPEN_DELAY: 0,
        HOVER_CLOSE_DELAY: 10,
      });

      this.sharePopover = new ClassSharePopoverView({
        autoPosition: false,
        anchor: this.$('.share-facebook'),
        el: this.$('.class-share-popover'),
        model: this.parentClassModel,
        roster: this.rosterModel,
        userIsAffiliateReferrer: pageData.userIsAffiliateReferrer,
        showCompact: true,
        showOnHover: true,
        HOVER_OPEN_DELAY: 0,
        HOVER_CLOSE_DELAY: 10,
      });

      this.sharePopover = new ClassSharePopoverView({
        autoPosition: false,
        anchor: this.$('.share-popup-btn'),
        el: this.$('.class-share-popover'),
        model: this.parentClassModel,
        roster: this.rosterModel,
        userIsAffiliateReferrer: pageData.userIsAffiliateReferrer,
        showEmail: true,
        showOnHover: false,
      });

      Backbone.on('showSharePopover', this.triggerShowSharePopover);
    }

    this.playedSessions = new VideoSessionsCollection();

    if (!pageData.videoPlayerData.displayEmptyState && pageData.syllabusData.isSyllabusUnlocked) {
      // Video Player
      // TODO: rename this, it's really like a video theater now
      this.videoPlayer = new VideoPlayerView({
        el: this.$('.video-player'),
      });

      this.listenTo(this.videoPlayer, 'scrollToHeaders', this.scrollToFixedHeaders);
      this.listenTo(this.videoPlayer, 'enable:learnMode', this.routeToMode('learnMode'));
      this.listenTo(this.videoPlayer, 'toggle:learnMode', this.toggleRouteToMode('learnMode'));
      this.listenTo(this.videoPlayer, 'change:session', this.onSessionChange);
      this.listenTo(this.videoPlayer, 'click:more', this.onNoteMoreClick);
      this.listenTo(this.videoPlayer, 'remove:note', this.removeVideoPlayerNote);
      this.listenTo(this.videoPlayer, 'change:note', this.changeVideoPlayerNote);
      this.listenTo(this.videoPlayer, 'newClasses:video:player:play', this.onVideoPlayerPlay);
    }


    this.initializeUserHasSharedClass();

    /* Begin: New Layout 2015-05-10_-_class-details-navigation */

    // Header
    new HeaderView({
      el: this.$('.class-details-page-header'),
    });

    // Share Menu Popover
    const $shareMenuButton = this.$('.share-menu-button');
    this.shareMenu = new PopoverView({
      autoPosition: false,
      anchor: $shareMenuButton,
      el: $shareMenuButton.find('.popover'),
      showOnHover: true,
    });

    const shareLinksModel = new Backbone.Model(_.extend(
      {
        units: units,
        parentClass: this.parentClassModel,
      },
      pageData.videoPlayerData.shareLinks
    ));
    new ShareLinksView({
      el: $shareMenuButton.find('.share-links'),
      model: shareLinksModel,
      session: units.getSessionAtIndex(0),
    });

    /* End: New Layout 2015-05-10_-_class-details-navigation */

    // Follow Teacher Button
    this.teacherUid = pageData.headerData.teacher.uid;

    this.followButton = new FollowUserButton({
      container: this.$('.follow-button-wrapper-class-details'),
      classes: 'follow-button-link-style',
      modelData: {
        user: new UserModel({uid: this.teacherUid}),
        followingId: pageData.headerData.isFollowingTeacher ? this.teacherUid : false,
        trackingParams: {via: 'class-details-header'},
      },
    });

    // Save for Later Button
    new WishlistButton({
      container: this.$('.btn-save-container'),
      template: wishlistButtonIconTemplate,
      activeClass: 'saved',
      inactiveClass: 'save',
      modelData: {
        parent_class_id: SS.serverBootstrap.classData.parentClass.id,
        parent_sku: SS.serverBootstrap.classData.parentClass.sku,
        wishlistId: SS.serverBootstrap.pageData.headerData.isSaved ? SS.serverBootstrap.pageData.headerData.wishlistId : false,
        trackingParams: {via: 'class-details-header'},
      },
      isLabelButton: true,
      styles: 'button alt-charcoal-ghost',
    });

    // Add to Calendar popover
    const a2cPopoverContainer = document.createElement('div');
    a2cPopoverContainer.className = 'popover shadow top add-to-calendar-popover-container js-popover-container';
    this.addToCalendaroPopover = new AddToCalendarPopoverView({
      autoPosition: true,
      anchor: this.$('.add-to-calendar-popup-btn'),
      placement: 'top',
      arrowPlacement: 'bottom',
      el: a2cPopoverContainer,
      title: pageData.headerData.title,
      duration: pageData.videoPlayerData.totalSessionsDuration,
      baseUrl: pageData.videoPlayerData.baseUrl,
      description: pageData.sectionData.description || pageData.headerData.title,
      icons: {
        google: this.getCDNPath('/assets/images/add-to-calendar/google-cal.svg'),
        outlook: this.getCDNPath('/assets/images/add-to-calendar/outlook.svg'),
        apple: this.getCDNPath('/assets/images/add-to-calendar/apple.svg'),
        yahoo: this.getCDNPath('/assets/images/add-to-calendar/yahoo-icon.svg'),
      },
    });

    // Class User Menu
    this.userMenu = new PopoverView({
      anchor: this.$('.btn-class-user-menu'),
      el: this.$('.class-user-menu'),
      showOnHover: true,
      HOVER_OPEN_DELAY: 100,
      autoPosition: false,
    });

    // Admin panel
    if (SS.currentUser.get('isAdmin') === 1) {
      new AdminMenuView({
        classData: SS.serverBootstrap.classData,
      });
    } else if (SS.serverBootstrap.pageData.userClassRelationshipData.isTeacher) {
      new TeacherMenuView();
    }

    const premiumUpgradePopupView = this.initializePremiumPopupOnRender();

    // Make sure that any popups on page load are closed before the video is autoplayed
    // We may need an actual system for this in the future
    if (premiumUpgradePopupView) {
      this.listenTo(premiumUpgradePopupView, 'onPopupDidCloseEvent', this.triggerVideoPlayerAutoPlay);
    } else {
      this.triggerVideoPlayerAutoPlay();
    }

    if (SS.serverBootstrap.showDiscussionsBanner) {
      new WelcomeBannerView({
        el: this.$('.welcome-banner'),
        dialogId: DialogManager.CLASS_DETAILS_DISCUSSIONS_WELCOME_BANNER_DIALOG_ID,
      });
    }

    if (URLHelpers.getParam('unenrolled') === '1') {
      this.onUnenrollSuccess();
    }

    this.setupNavCollection();

    // grab a reference to the drawer content for enabling learn mode or transcript mode
    this.$videoDrawerContainer = this.$('.video-drawer-container');

    // User and Info Popovers
    ComponentInitializers.initPopovers(this);

    SSView.prototype.initialize.call(this, arguments);

    if (!Backbone.History.started) {
      if (!this.hasPushStateSupport) {
        document.location.hash = document.location.pathname.substr(1);
      }

      Backbone.history.start({
        pushState: this.hasPushStateSupport,
      });
    }
  },

  afterRender: function () {
    this.setupNav();

    this.calculateHeaderRelatedAttributes();
    this.setMainRegionMinHeight();

    window.removeEventListener('scroll', SS.classDetailsHeaderFunction);

    this.window.$el.on('scroll', () => {
      this.toggleFixedHeaders();
    });

    this.fixedHeaders.shown = this.classHeader.wrapper.$el.hasClass('fixed-header');

    this.baseRendered.resolve();

    SSView.prototype.afterRender.apply(this, arguments);

    if (SS.serverBootstrap.signupPopupOpen) {
      this.signupPopup = new TwoPanelSignupView({
        'state': 'signup',
        'redirectTo': SS.serverBootstrap.signupPopupRedirectTo,
        'showCouponCopy': false,
        'showEmailSignUp': true,
        disableMobileRedirect: true,
      });
    }

    if(SS.serverBootstrap.freeAccessLinkConfirmation) {
      new FreeAccessLinkConfirmationPopup();
      SS.serverBootstrap.freeAccessLinkConfirmation = false;
    }

  },

  getCDNPath: function (path) {
    const {cdnHost} = SS.serverBootstrap.staticAssetData;
    return cdnHost ? '//' + cdnHost + path : path;
  },

  /**
   * Header Methods
   */

  calculateHeaderRelatedAttributes: function () {
    // Cache the header wrapper elements + their placeholders
    this.classHeader.wrapper.$el = this.$('.class-details-header-wrapper');
    this.classHeader.wrapper.$placeholder = this.$('.class-details-header-wrapper-placeholder');

    this.navigationHeader.wrapper.$el = this.$('.underline-tabs-wrapper');
    this.navigationHeader.wrapper.$placeholder = this.$('.underline-tabs-wrapper-placeholder');

    // Cache the class header content element (for slide down animation)
    this.classHeader.content.$el = this.$('.class-details-header');

    // Cache the class header content element's children (for fade in animation)
    this.classHeader.content.$children = this.classHeader.content.$el.children();

    // Determine the outer height of the headers using their wrapper elements
    this.classHeader.outerHeight = this.classHeader.wrapper.$el.outerHeight(true);
    this.navigationHeader.outerHeight = this.navigationHeader.wrapper.$el.outerHeight(true);

    // Give the class header wrapper element a fixed height
    this.classHeader.wrapper.$el.css('height', this.classHeader.outerHeight);

    // Give the wrapper placeholder elements a fixed height for when they're shown
    this.classHeader.wrapper.$placeholder.css('height', this.classHeader.outerHeight);
    this.navigationHeader.wrapper.$placeholder.css('height', this.navigationHeader.outerHeight);

    // Cache the window and main region element selectors
    this.mainRegion.$el = this.$('#main-region');
    this.window.$el = $(window);

    // Cache the site footer element and determine it's outer height
    this.siteFooter.$el = this.$('.site-footer');
    this.siteFooter.outerHeight = this.siteFooter.$el.outerHeight(true);

    // Determine the minimum height of the main region
    // (to be subtracted from the window's outer height)
    if (this.window.$el.width() > this.TABLET_BREAK_POINT) {
      this.mainRegion.minHeight = this.classHeader.outerHeight + this.siteFooter.outerHeight;
    }

    // Determine the point where we'd like to set the body's scrollTop
    // to in order to scroll to the fixed headers
    if (typeof this.mainRegion.$el.offset() !== 'undefined') {
      this.fixedHeaders.scrollTop = this.mainRegion.$el.offset().top - this.classHeader.outerHeight;
    }
  },

  showFixedHeaders: function () {
    // Hide the class header content element and it's child elements
    this.classHeader.content.$children.css('opacity', 0);
    this.classHeader.content.$el.css('marginTop', '-' + this.classHeader.outerHeight + 'px');

    this.classHeader.wrapper.$el.addClass('fixed-header');
    this.classHeader.wrapper.$placeholder.removeClass('hidden');

    // Animate the class header content element and it's child elements
    this.classHeader.content.$children.fadeTo(200, 1);
    this.classHeader.content.$el.animate({marginTop: 0}, 150);

    this.navigationHeader.wrapper.$el.addClass('fixed-header');
    this.navigationHeader.wrapper.$el.css('top', this.classHeader.outerHeight);

    this.navigationHeader.wrapper.$placeholder.removeClass('hidden');

    this.fixedHeaders.shown = true;
  },

  hideFixedHeaders: function () {
    // Show the class header content element and it's child elements
    this.classHeader.content.$children.css('opacity', 1);
    this.classHeader.content.$el.css('marginTop', 0);

    this.classHeader.wrapper.$el.removeClass('fixed-header');
    this.classHeader.wrapper.$placeholder.addClass('hidden');

    this.navigationHeader.wrapper.$el.removeClass('fixed-header');
    this.navigationHeader.wrapper.$el.css('top', 0);

    this.navigationHeader.wrapper.$placeholder.addClass('hidden');

    this.fixedHeaders.shown = false;
  },

  scrollToFixedHeaders: function () {
    this.documentEl.scrollTop(this.fixedHeaders.scrollTop);
  },

  scrollToTop: function () {
    this.documentEl.scrollTop(0);
  },

  toggleFixedHeaders: function () {
    // Subtracting 1px to handle rounding error in Firefox
    const shouldShowFixHeaders = (
      this.mainRegion.$el.offset().top - this.window.$el.scrollTop() - 1
    ) <= this.classHeader.outerHeight;

    if (shouldShowFixHeaders) {
      if (this.fixedHeaders.shown === false) {
        this.showFixedHeaders();
      }
    } else {
      this.hideFixedHeaders();
    }
  },

  /**
   * Event Handlers
   */

  onVideoPlayerPlay: function () {
    this.playedSessions.add(this.videoPlayer.session);

    const isOnSecondSession = this.playedSessions.length === 2;
    const isNotTeacher = !SS.serverBootstrap.pageData.isTeacher;
    const isNotFollowingTeacher = !SS.serverBootstrap.pageData.headerData.isFollowingTeacher;
    const shouldShowDialog = isOnSecondSession && isNotTeacher && isNotFollowingTeacher;

    if (shouldShowDialog) {
      this.showFollowDialog();
    }
  },

  removeVideoPlayerNote: function (note) {
    this.videoPlayer.session.notes.remove(note);
  },

  changeVideoPlayerNote: function (note) {
    const videoPlayerNote = this.videoPlayer.session.notes.get(note);

    if (!videoPlayerNote) {
      return;
    }

    videoPlayerNote.set(note.attributes);
  },

  onVideoPlayerNoteRemove: function (note) {
    if (!this.videoDrawerView) {
      return;
    }

    this.videoDrawerView.notes.remove(note);
  },

  onVideoPlayerNoteChange: function (note) {
    if (!this.videoDrawerView) {
      return;
    }

    const learnModeNote = this.videoDrawerView.notes.get(note);

    if (!learnModeNote) {
      return;
    }

    learnModeNote.set(note.attributes);
  },

  onNoteMoreClick: function (note) {
    if (this.learnModeOn) {
      this.videoDrawerView.highlightNote(note);
      return;
    }

    this.displayNote = note;
    this.routeToMode('learnMode')('note-more');
  },

  listenToVideoPlayerNoteEvents: function () {
    this.listenTo(this.videoPlayer.session.notes, 'remove', this.onVideoPlayerNoteRemove);
    this.listenTo(this.videoPlayer.session.notes, 'change', this.onVideoPlayerNoteChange);
  },

  onRecommendNoClick: function (ev) {
    ev.preventDefault();
  },

  onAbuseFlagClick: function (ev) {
    if (!SS.serverBootstrap.userData.isMember) {
      new TwoPanelSignupView({
        'state': 'signup',
      });
    } else {
      ev.preventDefault();
      this.userAbuseFlag = new AbuseFlagModel({
        parentClassSku: this.classModel.get('parentClass').sku,
        uid: SS.serverBootstrap.userData.id,
      });

      new AbuseFlagPopup({
        model: this.userAbuseFlag,
      });
    }
  },

  closeRecommendBanner: function () {
    this.$('.js-recommend-class-box').slideUp('slow', () => this.calculateHeaderRelatedAttributes());
    // stop review box from reappearing on this browser session
    $.cookie('show_recommend_box', false);
  },

  onRecommendCloseClick: function (e) {
    e.preventDefault();
    this.closeRecommendBanner();
  },

  onRecommendSureClick: function (e) {
    e.preventDefault();
    this.closeRecommendBanner();
    this.autoDisplayReviewForm = true;
    $('.underline-tabs .tab a.reviews').trigger('click');
  },

  onClickTeacherInfo: function (event) {
    event.preventDefault();

    // Close the user popover when showing user profile popup
    this.$('*[data-ss-username]').trigger('mouseleave', [true]);

    new AbstractPopupView({
      className: 'user-profile-popup-view',
      basicPopup: true,
      centerVertically: false,
      endpoint: '/users/renderProfilePopup',
      endpointData: {
        'userId': this.teacherUid,
        'classSku': this.classModel.get('sku'),
      },
    });
  },

  onUserMenuItemClick: function () {
    this.userMenu.close();
  },

  onShareMenuItemClick: function () {
    this.shareMenu.close();
  },

  onMarkAsComplete: function () {
    const _this = this;
    const onSuccess = function () {
      SS.events.trigger('alerts:create', {
        title: 'Class marked as complete.',
        action: '/lists/continue-watching',
        actionString: 'View Completed Classes',
        type: 'success',
      });
      _this.$('.mark-as-complete').parent()
        .remove();
    };

    this.rosterModel
      .set('status', ROSTER_STATUS_COMPLETED)
      .save()
      .success(onSuccess)
      .error(this.onError);
  },

  onUnenroll: function () {
    const popup = new ActionPopupView({
      content: Mustache.render(unenrollConfirmPopupTemplate),
      submitBtnVal: 'Unenroll',
    });
    popup.openPopup();
    popup.on('onConfirmationDidConfirmEvent', this.performUnenroll, this);
  },

  performUnenroll: function () {

    this.rosterModel.destroy({
      success: this.onRosterDestroySuccess,
      error: this.onRosterDestroyError,
    });
  },

  onUnenrollSuccess: function () {
    SS.events.trigger('alerts:create', {
      title: 'Unenrolled from class.',
      type: 'success',
    });
  },

  onRosterDestroySuccess: function () {
    window.location = SS.serverBootstrap.pageData.headerData.unenrolledUrl;
  },

  onRosterDestroyError: function () {
    SS.events.trigger('alerts:create', {
      title: 'Sorry! There was an error completing that action. Please try again later.',
      type: 'error',
    });
  },

  /**
   * Drawer-Related Methods
   */

  initializeLearnMode: function (routeParams = {}) {
    // generate the template data for the learn mode view using the bootstrap
    const {pageData} = SS.serverBootstrap;
    const startingSessionModel = new VideoSessionModel(pageData.videoPlayerData.startingSession);
    const templateData = _.extend({}, pageData.learnModeData, {
      sessionTitle: startingSessionModel.get('title'),
    });

    // create the learn mode view inside the video-drawer-content container
    this.videoDrawerView = new LearnModeView({
      container: this.$videoDrawerContainer,
      videoPlayer: this.videoPlayer,
      session: this.videoPlayer.session,
      templateData: templateData,
      displayNote: this.displayNote,
      via: routeParams.via,
    });

    // listen for new notes and push event to the video player
    this.listenTo(this.videoDrawerView, 'created:note', function (note) {
      this.videoPlayer.onNoteFormNewNote(note);
    });

    // listen to update/delete events and push to video player
    // and vise-versa
    this.listenTo(this.videoDrawerView.notes, 'remove', this.removeVideoPlayerNote);
    this.listenTo(this.videoDrawerView.notes, 'change', this.changeVideoPlayerNote);
    this.listenTo(this.videoDrawerView, 'toggle:drawer', this.toggleRouteToMode('learnMode'));
    this.listenToVideoPlayerNoteEvents();
  },

  enableLearnMode: function (routeParams) {
    if (this.learnModeOn) {
      return;
    }

    this.videoPlayer.videoPlayerReady.then(_.bind(function () {
      this.initializeLearnMode(routeParams);

      this.$el.addClass('learn-mode');
      this.videoPlayer.videoPlayer.hideControlBarTooltips();
      this.videoPlayer.closeNotePopovers();
      this.videoPlayer.videoPlayer.updateTooltip(this.videoPlayer.videoPlayer.$learnModeToggle, 'Hide Notes');

      if (this.displayNote) {
        this.videoDrawerView.highlightNote(this.displayNote);
        this.displayNote = undefined;
      }

      this.learnModeOn = true;

      this.openVideoDrawer();
    }, this));
  },

  disableLearnMode: function (cb) {
    if (!this.learnModeOn) {
      if (cb) {
        cb();
      }
      return;
    }

    this.$el.removeClass('learn-mode');
    this.videoPlayer.videoPlayer.updateTooltip(this.videoPlayer.videoPlayer.$learnModeToggle, 'View All Notes');
    this.videoPlayer.closeNotePopovers();
    this.learnModeOn = false;

    this.closeVideoDrawer(cb);
  },

  closeVideoDrawer: function (cb) {
    if (this.videoDrawerView) {
      const _this = this;
      this.videoDrawerView.close(function () {
        // after closing the video drawer, destroy the backbone view
        _this.videoDrawerView.remove();
        if (cb) {
          cb();
        }
      });
    } else {
      if (cb) {
        cb();
      }
    }
  },

  openVideoDrawer: function () {
    const videoRegionHeight = this.$('#video-region').outerHeight();
    const videoAndPlaylistHeight = this.$('.video-and-playlist').outerHeight();
    const spaceBelowVideo = (videoRegionHeight - videoAndPlaylistHeight);
    const mainRegionHeight = this.$('#main-region').outerHeight();
    const minDrawerHeight = spaceBelowVideo + mainRegionHeight;

    this.videoDrawerView.open({
      minHeight: minDrawerHeight,
    });
  },

  onSessionChange: function (session) {
    if (!this.videoDrawerView) {
      return;
    }

    this.videoDrawerView.updateSession(session);
    this.listenToVideoPlayerNoteEvents();

  },

  /**
   * Routing Methods
   */

  _route: function (event) {
    event.preventDefault();

    this.route(event.currentTarget.href);
  },

  route: function (href) {
    const strippedHref = href.replace(
      window.location.protocol + '//' + window.location.hostname,
      ''
    );

    this.router.navigate(strippedHref, true);
  },

  switchSection: function (nav) {
    if (this._activatingSectionTab) {
      return;
    }
    this.route(nav.get('link'));
  },

  _activateSectionTab: function (dataText) {
    this._activatingSectionTab = true;
    this.navigationTabs.activate(dataText);
    this._activatingSectionTab = false;
    this.checkDarkModeTab(dataText);
  },

  checkDarkModeTab: function(dataText) {
    if (dataText.toLowerCase() === 'lessons') {
      $('#site-content').addClass('dark-mode-tab');
    }
    else {
      $('#site-content').removeClass('dark-mode-tab');
    }
  },

  setupNavCollection: function () {
    this.navigationTabs = new TabsCollection(SS.serverBootstrap.pageData.navigationTabsData.tabs, {silent: false});
    this.listenTo(this.navigationTabs, 'activate', this.switchSection);
  },

  setupNav: function () {
    this.nav.attach(new TabsCollectionView({
      collection: this.navigationTabs,
      className: 'underline-tabs',
    }));
  },

  routeToMode: function (mode) {
    return _.bind(function (via) {
      const params = {
        via: via,
      };
      params[mode] = 1;

      this.route(URLHelpers.addParams(window.location.pathname, params));
    }, this);
  },

  unRouteToMode: function (mode) {
    return _.bind(function () {
      const params = URLHelpers.getParams(window.location.href);

      // forcibly unroute a specific mode
      if (params[mode]) {
        this.route(window.location.pathname);
      }
    }, this);
  },

  toggleRouteToMode: function (mode) {
    return _.bind(function (via) {
      const params = URLHelpers.getParams(window.location.href);

      // We're on that mode, let's go back to regular mode
      // We always allow users to exit a mode
      if (params[mode]) {
        this.route(window.location.pathname);
        return;
      }

      this.routeToMode(mode)(via);
    }, this);
  },

  /**
   * Controller Actions
   */

  _showSection: function (section, ClassSectionView, Model, customOptions = {}) {
    // use the pathname for the views key
    const viewsKey = Utils.getPathname(this.hasPushStateSupport);

    let view = this._views[viewsKey];

    const viewOptions = {
      classModel: this.classModel,
    };

    const defaultData = {
      pageElementData: this.getPageElementData(),
      autoDisplayReviewForm: this.autoDisplayReviewForm,
    };

    this.autoDisplayReviewForm = false;

    if (!view) {
      // we are attaching the "format=json" in other to prevent some caching issues
      // encountered during the URL changes for the logged out pages
      const modelOptions = {
        urlRoot: Utils.getPathname(this.hasPushStateSupport) + '?format=json',
        ...customOptions,
      };

      if (this._isPreRendered() && !this.updatePreRenderedData) {
        this.currentSectionModel = new Model(
          _.extend(defaultData, SS.serverBootstrap.pageData.sectionData),
          modelOptions
        );

        viewOptions.model = this.currentSectionModel;

        if (!this.legacyRendered) {
          viewOptions.el = this.content.view.$el;
        }

        view = new ClassSectionView(viewOptions);

        if (this.legacyRendered) {
          view.render();
        }

      } else {
        const model = this.currentSectionModel = new Model(defaultData, modelOptions);
        viewOptions.model = model;

        view = new ClassSectionView(viewOptions);

        model.fetch();
      }
      view.section = section;
      view.on('change', this._clearViewsCache, this);
      view.listenTo(this.videoPlayer, 'change:session', view?.onSessionChange);
      this._views[viewsKey] = view;
    }

    this.content.attach(view, true);

    // Set the main region min-height each time we show a section
    // in case the window gets resized
    if (!this._isPreRendered()) {
      this.setMainRegionMinHeight();
    } else {
      view.trigger('prerendered');
    }

    // Logic for scrolling to fixed headers:
    // - If you are first loading the page, the headers should appear for the Class Project,
    // Projects and Discussions sections. This is done in classDetailsFixedHeadersBootstrap in app.js
    // so that it happens immediately on page load.
    // - If you are tabbing into a section and the fixed headers are shown then scroll
    // the user back to the top of the fixed headers. The exception for this is the home tab
    // in which case we always want to take you back to the top of the window.
    // - If you are tabbing into a section and the fixed headers are not showing then
    // leave the user exactly where they are.

    if (!this.isFirstSectionLoaded) {
      this.isFirstSectionLoaded = true;
    } else {
      // Handling scrolling when tabbing between sections
      if (this.fixedHeaders.shown) {
        if (section === 'home') {
          this.scrollToTop();
        } else {
          this.scrollToFixedHeaders();
        }
      }
    }
  },

  getPageElementData: function () {
    return {
      classHeader: this.classHeader,
      navigationHeader: this.navigationHeader,
      totalHeaderHeight: this.classHeader.outerHeight + this.navigationHeader.outerHeight,
    };
  },

  callAction: function (controllerName, actionName, params) {
    this.baseRendered.then(() => {
      _.result(this, actionName);
      if (params?.learnMode) {
        //timeout is a patch to force the drawer
        //to show up. Please refactor it ASAP.
        //The 100 is from:
        //js/core/src/views/modules/video-drawer.js#L144
        setTimeout(() => {
          this.enableLearnMode(params);
        }, 100);
      } else {
        // otherwise, close the drawer and remove the views
        this.disableLearnMode();
        this.closeVideoDrawer();
      }
    });
  },

  _trackingParams: function () {
    const captionsCookieValue = $.cookie(SubtitlesState.COOKIE_LEGACY_CAPTIONS_STATE_NAME) || "not_set";
    const mutedStateCookieValue = $.cookie(MUTED_COOKIE_NAME) || "not_set";

    const params = {
      lesson_rank: this.videoPlayer.session.attributes.rank,
      local_caption_setting: '' + captionsCookieValue,
      local_muted_setting: '' + mutedStateCookieValue
    };

    return _.extend({}, SS.EventTracker.classDetails(), params);
  },

  home: function () {
    this._showSection('home', HomeSectionView, ClassSectionModel);
    this._activateSectionTab('About');
    SS.EventTracker.track('Viewed-Class-AboutTab', {}, this._trackingParams());
  },

  reviews: function () {
    this._showSection('reviews', ReviewsSectionView, ClassSectionModel);
    this._activateSectionTab('Reviews');
    SS.EventTracker.track('Viewed-Class-ReviewsTab', {}, this._trackingParams());
  },

  lessons: function () {
    this._showSection('lessons', LessonsSectionView, ClassSectionModel);
    this._activateSectionTab('Lessons');
    SS.EventTracker.track('Viewed-Class-LessonsTab', {}, this._trackingParams());
  },

  projects: function () {
    this._showSection('projects', ProjectsSectionView, ProjectsSectionModel);
    this._activateSectionTab('Projects & Resources');
    SS.EventTracker.track('Viewed-Class-ProjectsTab', {}, this._trackingParams());
  },

  discussions: function () {
    this._showSection('discussions', DiscussionsSectionView, DiscussionsSectionModel);
    this._activateSectionTab('Community');
    SS.EventTracker.track('Viewed-Class-DiscussionsTab', {}, this._trackingParams());
  },

  discussionView: function () {
    this._showSection('discussionView', DiscussionViewSectionView, ClassSectionModel);
    this._activateSectionTab('Community');
  },

  transcripts: function () {
    const customOptions = {
      lessonId: this.videoPlayer?.session?.id
    };

    this._showSection('transcripts', TranscriptsSectionView, TranscriptsSectionModel, customOptions);
    this._activateSectionTab('Transcripts');

    SS.EventTracker.track('Viewed-Class-TranscriptsTab', {}, this._trackingParams());
  },

  /**
   * Helper Methods
   */

  _clearViewsCache: function () {
    this.updatePreRenderedData = true;
    delete this._views;
    this._views = {};
  },

  setMainRegionMinHeight: function () {
    // we don't want this for the tablet version
    // as it will add an empty white border
    if (this.window.$el.width() < this.TABLET_BREAK_POINT) {
      return;
    }
    this.mainRegion.$el.css('minHeight', this.window.$el.height() - this.mainRegion.minHeight);
  },

  _isPreRendered: function () {
    return this.preRendered === Utils.getPathname(this.hasPushStateSupport);
  },

  _shouldCreateSharePopover: function () {
    return !SS.serverBootstrap.pageData.headerData.parentClassIsDraft;
  },

  _showSharePopover: function () {
    this.sharePopover.source = 'Class Onboarding';
    this.sharePopover.onboarding = true;
    this.sharePopover.setShowOnHover(false);
    this.sharePopover.open();
  },

  triggerShowSharePopover: function () {
    this._showSharePopover();
  },

  initializeUserHasSharedClass: function () {
    this.userHasSharedClass = SS.serverBootstrap.userHasSharedClass;

    const _this = this;
    Backbone.on('shared', function () {
      _this.userHasSharedClass = true;
    });
  },

  _userIsEnrolled: function () {
    return SS.serverBootstrap.pageData.userClassRelationshipData.isEnrolled;
  },

  initializePremiumPopupOnClick: function (event) {
    return this.premiumPopup.initializePremiumPopupOnClick(event);
  },

  initializePremiumPopupOnRender: function () {
    return this.premiumPopup.initializePremiumPopupOnRender();
  },

  triggerVideoPlayerAutoPlay: function () {
    const {videoPlayer} = this;

    if (!videoPlayer) {
      return;
    }

    videoPlayer.videoPlayerMetaDataLoaded.then(() => {
        videoPlayer.trigger('video:player:autoplay:ready');
    });
  },

  showFollowDialog: function () {
    this.followDialog = this.makeFollowDialog();
    // there may be cases where the followDialog was
    // not created; eq the user has seen already the dialog
    if(this.followDialog) {
      this.setupFollowDialogCloseListener(this.followDialog);
    }
  },

  setupFollowDialogCloseListener: function(followDialog) {
    this.listenTo(this.followButton, 'click', () => {
      followDialog.trigger('dialog:close');
    });
  },

  makeFollowDialog: function() {
    const $followButton = this.$(this.FOLLOW_BUTTON_WRAPPER_SELECTOR);
    return DialogManager.createDialog(
      DialogManager.CLASS_DETAILS_FOLLOW_DIALOG_ID,
      ClassDetailsFollowDialogView, {
        anchor: $followButton,
        placement: 'right',
      }
    );
  },

  onClickOpenInApp: function() {
    SS.EventTracker.track('Clicked Mobile Open App Link');
  },

  onClickInstallTheApp: function() {
    SS.EventTracker.track('Clicked Mobile Install App Link');
  },

  onCloseMobileDownloadBanner: function() {
    if (SS.serverBootstrap.mobileAppBannerData) {
      this.setMobileDownloadBannerCookie();
      this.$(this.MOBILE_DOWNLOAD_BANNER_SELECTOR).remove();
    }
  },

  setMobileDownloadBannerCookie: function() {
    const name = SS.serverBootstrap.mobileAppBannerData.cookieName;
    const value = (new Date()).getTime();
    const expires = new Date();
    // keep the banner hidden for 24h
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));

    $.cookie(name, value, {
      expires,
    });
  },

});

export default ClassesController;
