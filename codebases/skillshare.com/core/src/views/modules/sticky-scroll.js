

const StickyScrollView = Backbone.View.extend({

  MOBILE_BREAKPOINT: 540,

  enabled: true,

  pageSelectorsWhereToDisable: ['#class-details', '#js-workshops-show'],

  initialize: function(options = {}) {
    // This module requires an el to be defined as part of its instantiation
    // Hence we don't want to continue if this isn't the case
    // E.g. It might be that a page is stateful and the el to scroll may/may not exist
    // (Just a safety net to prevent some nasty js errors)
    if (this.$el.length > 0) {
      _.bindAll(this, 'onScroll');

      this._window = $(window);

      // Sticky states
      this._stickyState = false;
      this._stickyBottomState = false;

      // Set up values used in scroll calculations
      this.offsetTop = options.offsetTop || 0;
      this.paddingTop = options.paddingTop || 0;
      this.anchorPos = (this.$el.offset().top + this.paddingTop) - this.offsetTop;

      // Useful for long pages where we don't want the scrolling el to continue alllll the way down the page
      this.containerEl = options.containerEl || null;

      this.extraOffset = options.extraOffset || 0;

      this.disableOnMobile = options.disableOnMobile;
      this.enabled = this.checkIfEnabled();
      this.initScroll();
      if (options.useSideStickyScrolling) {
        this.initSideStickyMenuScroll();
      }

    }
  },

  checkIfEnabled: function() {
    let isEnabled = true;
    this.pageSelectorsWhereToDisable.forEach(
      (e) => {
        if($(e).length !== 0) {
          isEnabled = false;
        }
      }
    );
    return isEnabled;
  },

  initSideStickyMenuScroll: function() {
    this.pos = $(window).scrollTop();

    $(window).on('scroll', () => {
      const newPos = $(window).scrollTop();
      const delta = newPos - this.pos;
      this.$el.scrollTop(this.$el.scrollTop() + delta);
      this.pos = newPos;
    });
  },

  initScroll: function() {
    if (!this.enabled) {
      return;
    }
    const screenWidth = this._window.width();
    // only scroll to top if not on mobile.
    // Even if the sticky header is hidden  it may cause issues
    if ( this.disableOnMobile && (screenWidth < this.MOBILE_BREAKPOINT)) {
      return;
    }

    // Set up scroll event on window
    this._window.scroll(this.onScroll);

    // Trigger this on init incase we're scrolled down on page load
    this.onScroll();
  },

  setEnabled: function(enabled) {
    this.enabled = enabled;
    this.updateStickyState(enabled, true);
  },

  onScroll: function(event, forceUpdate) {
    if (!this.enabled) {
      return;
    }

    const windowTopOffset = this._window.scrollTop();

    this.updateStickyState(windowTopOffset > this.anchorPos, forceUpdate);

    // See if we need to handle a bottom el
    if (this.containerEl && this.containerEl.offset()) {
      const stickyState = this.determineStickyState(windowTopOffset);
      this.updateStickyBottomState(stickyState, forceUpdate);
    }
  },

  calcStickyStateMaxY: function() {
    // Calculate where we want our sticky element to stop and afix to bottom
    // This needs to take place here, in case initialize fires before the content on the page has fully rendered
    const paddingBottom = this.containerEl.css('padding-bottom') || '0px';
    const containerTopOffset = this.containerEl.offset().top;
    const containerOuterHeight = this.containerEl.outerHeight();
    return containerTopOffset + containerOuterHeight - parseInt(paddingBottom, 10);
  },

  determineStickyState: function(windowTopOffset) {
    const maxYPos = this.calcStickyStateMaxY();
    const maxYValue = maxYPos - this.$el.outerHeight() - this.offsetTop;
    return windowTopOffset - this.extraOffset > maxYValue;
  },

  updateStickyState: function(stickyState, forceUpdate) {
    if ((this._stickyState === stickyState) && !forceUpdate) {
      return false;
    }

    this._stickyState = stickyState;

    const windowTopOffset = this._window.scrollTop();

    if (stickyState && windowTopOffset > this.anchorPos) {
      this.$el.addClass('sticky');
    } else {
      this.$el.removeClass('sticky');
    }

    this.trigger('updateStickyState', stickyState);
  },

  updateStickyBottomState: function(stickyBottomState, forceUpdate) {
    if ((this._stickyBottomState === stickyBottomState) && !forceUpdate) {
      return false;
    }

    this._stickyBottomState = stickyBottomState;

    if (stickyBottomState) {
      this.$el.addClass('sticky-bottom');
    } else {
      this.$el.removeClass('sticky-bottom');
    }

    this.trigger('updateStickyBottomState', stickyBottomState);
  },

});

export default StickyScrollView;

