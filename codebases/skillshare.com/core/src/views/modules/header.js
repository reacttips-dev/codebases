import React from 'react';
import ReactDOM from 'react-dom';
import { NotificationsBell } from '@skillshare/ui-components/Notifications/NotificationsBell';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { ApolloProvider, AuthenticationProvider, CookieProvider, EventsProvider } from '@skillshare/ui-components/components/providers';

import PopoverView from 'core/src/views/modules/popover';
import SearchAutocomplete from 'core/src/views/modules/search-autocomplete';
import StickyScrollView from 'core/src/views/modules/sticky-scroll';
import Utils from 'core/src/base/utils';
import ProfileSnippetView from 'core/src/views/modules/profile-snippet';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import { ApolloClientManager } from '@skillshare/ui-components/shared/apollo';

const STICKY_BOTTOM_MARGIN_OFFSET = 65;
const EL_OFFSET_SELECTOR = '.js-site-header-container';

const HeaderView = Backbone.View.extend({

  events: {
    'click .js-nav-link-user-avatar': 'onClickRightNavLink',
    'click .js-nav-icon-notifications': 'onClickRightNavLink',
    'click .js-nav-link-teach': 'onClickRightNavLink',
  },

  initialize: function() {
    this.isMobile = Utils.isMobile();
    window.addEventListener(
      'resize',
      _.debounce(
        () => {
          this.isMobile = Utils.isMobile();
          this.onStickyUpdate();
        },
        100
      )
    );

    this.containerEl = this.options.containerEl;

    this.initStickyScroll();
    this.initUserPopover();
    this.initBrowsePopover();
    this.initTertiaryPopover();
    this.initTeachPopover();
    this.initSearchAutoComplete();
    this.initializeNotificationsBell();
  },

  initializeNotificationsBell: function() {
    const isAuthenticated = !SS.currentUser.isGuest();
    const root = this.$('.js-notifications-bell').get(0);

    if (isAuthenticated && root) {
      const trackEventHandler = SS.EventTracker.trackingCallback();
      const csrfToken = $.cookie('YII_CSRF_TOKEN');
      const apiHost = SS.serverBootstrap?.apiData?.host;
      const client = ApolloClientManager.getClient({ uri: `${apiHost}/api/graphql` });

      ReactDOM.render(
        <ApolloProvider client={client}>
          <DefaultThemeProvider>
            <CookieProvider cookies={{ YII_CSRF_TOKEN: csrfToken }}>
              <EventsProvider trackEventHandler={trackEventHandler}>
                <AuthenticationProvider isAuthenticated={isAuthenticated}>
                  <NotificationsBell />
                </AuthenticationProvider>
              </EventsProvider>
            </CookieProvider>
          </DefaultThemeProvider>
        </ApolloProvider>,
        root
      );
    }
  },

  initStickyScroll: function() {
    this.stickyScroll = new StickyScrollView({
      el: this.$el,
      containerEl: this.containerEl || null,
      paddingTop: 0,
      extraOffset: $(EL_OFFSET_SELECTOR).outerHeight(),
      disableOnMobile: true,
    });
    this.onStickyUpdate();
    this.listenTo(this.stickyScroll, 'updateStickyState', this.onStickyUpdate);
    this.listenTo(this.stickyScroll, 'updateStickyBottomState', this.onStickyBottomUpdate);
    this.listenTo(Backbone, 'header:cancelStickyState', this.onCancelStickyHeader);
    this.listenTo(Backbone, 'header:restartStickyState', this.onRestartStickyHeader);
  },

  initUserPopover: function() {
    const $userActions = this.$('.js-nav-menu-user-avatar');
    this.userPopover = new PopoverView({
      autoPosition: false,
      showOnHover: false,
      anchor: $userActions.find('.js-nav-link-user-avatar'),
      el: $userActions.find('.popover'),
    });

    this.listenTo(this.userPopover, 'popover:open', this.onUserPopoverOpen);

    new ProfileSnippetView();
  },

  initBrowsePopover: function() {
    const $browseMenu = this.$('.js-nav-menu-browse');
    this.browsePopover = new PopoverView({
      autoPosition: false,
      showOnHover: false,
      anchor: $browseMenu.find('.js-nav-link-browse'),
      el: $browseMenu.find('.popover'),
    });

    this.listenTo(this.browsePopover, 'popover:open', this.onHoverPopoverOpen);
  },

  initTertiaryPopover: function() {
    const $tertiaryMenu = this.$('.js-nav-menu-tertiary');
    this.tertiaryPopover = new PopoverView({
      autoPosition: false,
      showOnHover: true,
      anchor: $tertiaryMenu.find('.js-nav-icon-tertiary'),
      el: $tertiaryMenu.find('.popover'),
    });

    this.listenTo(this.tertiaryPopover, 'popover:open', this.onHoverPopoverOpen);
  },

  initTeachPopover: function() {
    const $teachMenu = this.$('.js-nav-menu-teach');
    this.teachPopover = new PopoverView({
      autoPosition: false,
      showOnHover: false,
      anchor: $teachMenu.find('.js-nav-link-teach'),
      el: $teachMenu.find('.popover'),
    });

    this.listenTo(this.teachPopover, 'popover:open', this.onTeachPopoverOpen);
  },

  initSearchAutoComplete: function() {
    new SearchAutocomplete({
      el: this.$('.nav-search-bar'),
      value: deepRetrieve(SS, 'serverBootstrap', 'searchData', 'query'),
    });
  },

  onStickyUpdate: function() {
    if (this.$el.hasClass('sticky') && !this.isMobile && this.stickyScroll.enabled) {
      $('#page-wrapper').css('margin-top', this.$el.outerHeight(true));
    } else {
      $('#page-wrapper').css('margin-top', 0);
    }
  },

  onStickyBottomUpdate: function() {
    if (this.$el.hasClass('sticky-bottom')) {
      this.$el.css('margin-top', (this.containerEl.outerHeight() + this.$el.outerHeight()) - STICKY_BOTTOM_MARGIN_OFFSET);
    } else {
      this.$el.css('margin-top', 0);
    }
  },

  onHoverPopoverOpen: function() {
    this.userPopover.close();
    this.teachPopover.close();
  },

  onUserPopoverOpen: function() {
    this.teachPopover.close();
    this.browsePopover.close();
  },

  onTeachPopoverOpen: function() {
    this.userPopover.close();
    this.browsePopover.close();
  },

  onClickRightNavLink: function(event) {
    event.preventDefault();
  },

  onCancelStickyHeader: function() {
    this.stickyScroll.setEnabled(false);

    this.onStickyUpdate();
  },

  onRestartStickyHeader: function() {
    this.stickyScroll.setEnabled(true);
    this.onStickyUpdate();
  },
});

export default HeaderView;

