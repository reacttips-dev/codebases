import Utils from 'core/src/base/utils';
import PageOverlay from 'core/src/views/modules/page-overlay';

const CLASSES = {
  ACTIVE: 'active',
  HIDDEN: 'hidden',
  CLOSED: 'closed',
}

const HeaderMobileView = Backbone.View.extend({

  events: {
    'click .mobile-download-banner .open-in-app-link': 'onClickOpenInApp',
    'click .mobile-download-banner .install-the-app-link': 'onClickInstallTheApp',
    'click .primary-drawer-button': 'onPrimaryDrawer',
    'click .user-drawer-button': 'onUserDrawer',
    'click .js-mobile-search-overlay': 'onSearchMobileFocus',
    'click .js-mobile-search-overlay .cancel-btn': 'onSearchMobileCancel',
    'click .js-mobile-search-overlay-btn': 'onSearchMobileOpen',
    'click .nav-submenu-header': 'onNavSubmenuToggle',
    'click .group-link': 'onClickGroupLink',
  },

  initialize: function() {

    this.$buttons = this.$('.drawer-button');
    this.$primaryDrawerButton = this.$('.primary-drawer-button');
    this.$drawers = this.$('.drawer');
    this.$primaryDrawer = this.$('.drawer.primary');
    this.$userDrawer = this.$('.drawer.user');
    this.$searchOverlay = this.$('.js-mobile-search-overlay');
    this.$searchInput = $('.js-mobile-search-overlay #search-box');
    this.$banners = $('.js-alert, .js-site-banner');
    this.$close = this.$('.close');
    this.$hamburger = this.$('.hamburger');

    this.listenTo(PageOverlay, 'overlayWasClickedEVENT', function() {
      PageOverlay.close(true);
      this.$el.css('z-index', 'auto');
      this.$banners.removeClass('hide');
      this.hideDrawers();
      this.$searchOverlay.hide();
    }, this);

    this.mobileMQ = Utils.matchMedia(Utils.mediaTypes.MEDIA_TYPE_MOBILE);
  },

  resetMenuIcons: function() {
    if (!this.$primaryDrawerButton.hasClass(CLASSES.ACTIVE)) {
      this.$close.addClass(CLASSES.HIDDEN);
      this.$hamburger.removeClass(CLASSES.HIDDEN);

      return;
    }

    this.$close.removeClass(CLASSES.HIDDEN);
    this.$hamburger.addClass(CLASSES.HIDDEN);
  },

  onPrimaryDrawer: function(ev) {
    const button = $(ev.currentTarget);
    this.toggleDrawer(this.$primaryDrawer, button);
    this.resetMenuIcons();
  },

  onUserDrawer: function(ev) {
    const button = $(ev.currentTarget);
    this.toggleDrawer(this.$userDrawer, button);
    this.resetMenuIcons();
  },

  toggleDrawer: function(drawerEl, buttonEl) {
    if (buttonEl.hasClass(CLASSES.ACTIVE)) {
      this.closeDrawer(drawerEl, buttonEl);
      return;
    }

    this.openDrawer(drawerEl, buttonEl);
  },

  closeDrawer: function(drawerEl, buttonEl) {
    drawerEl.hide();
    buttonEl.removeClass(CLASSES.ACTIVE);
    PageOverlay.close();
    this.$el.css('z-index', 'auto');
  },

  openDrawer: function(drawerEl, buttonEl) {
    this.hideDrawers();
    buttonEl.addClass(CLASSES.ACTIVE);

    const { bottom } = this.el.getBoundingClientRect();
    drawerEl.css({
      'height': $(window).height() - bottom,
    });
    drawerEl.show();
  },

  hideDrawers: function() {
    this.$buttons.removeClass(CLASSES.ACTIVE);
    this.$drawers.hide();
  },

  /**
     * Search Button in Mobile View
     */
  onSearchMobileOpen: function() {
    if (!$('body').hasClass('mw_header_class')) {
      this.$banners.addClass('hide');
    }
    this.$searchOverlay.show();
    this.$searchInput.focus();
    this.hideDrawers();
    this.resetMenuIcons();
    PageOverlay.open({ fixed: true, white: true });
  },

  onSearchMobileFocus: function() {
    this.$searchInput.focus();
  },

  onSearchMobileCancel: function() {
    this.$banners.removeClass('hide');
    this.$searchOverlay.hide();
    PageOverlay.close();
  },

  /**
     * Search Button in Tablet View
     */
  onSearchTabletOpen: function() {
    if (this.$searchInput.hasClass(CLASSES.CLOSED)) {
      this.$searchInput.removeClass(CLASSES.CLOSED);
    }

    this.$searchInput.focus();
  },

  /**
     * Mobile Download Banner
     */
  onClickOpenInApp: function() {
    SS.EventTracker.track('Clicked Mobile Open App Link');
  },

  onClickInstallTheApp: function() {
    SS.EventTracker.track('Clicked Mobile Install App Link');
  },

  onNavSubmenuToggle: function(e) {
    const header = $(e.currentTarget);
    const menu = header.siblings('.nav-submenu');
    if (menu.is(':visible')) {
      menu.slideUp();
      header.find('.ss-icon-arrow-down').css({ 'transform': 'rotate(0deg)' });
    } else {
      menu.slideDown();
      header.find('.ss-icon-arrow-down').css({ 'transform': 'rotate(180deg)' });
    }
  },

  onClickGroupLink: function() {
    PageOverlay.close();
    this.$el.css('z-index', 'auto');
    this.hideDrawers();
  },
});

export default HeaderMobileView;
