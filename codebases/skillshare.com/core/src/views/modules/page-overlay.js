import PopupStack from 'core/src/utils/popup-stack';

const Overlay = {

  shouldInitialize: true,

  init: function(options = {}) {
    // mixin Backbone.Events for .on/.bind & .trigger
    _.extend(this, Backbone.Events);

    this.$el = $('#click-off-overlay');

    // Overlay's contract is to expose the click event. implementing class is
    // responsible for calling `close` on the Overlay.
    this.$el.on('mousedown', _.bind(function(e) {
      // Only init close event if we're clicking the overlay
      // This click event is also fired on any content click
      if ($(e.target).is(this.$el) && (!options.closeOnlyWithTheXButton)) {
        this.trigger('overlayWasClickedEVENT');
      }
    }, this));
  },

  open: function(options = { fixed: true, white: false }) {
    if (options.preventClose) {
      this.preventClose = true;
    }
    // Close any other popup if one exists
    if (this.shouldInitialize) {
      this.init(options);
      this.shouldInitialize = false;
    }

    $('body').css(this.getBodyStyles(options.fixed));
    $('#click-off-overlay').removeClass('slide-over-background');

    $('#click-off-overlay').toggleClass('white', !!options.white);

    this.isTransparent = options && options.transparent;
    this.$el.css({
      // 'background-color': options && options.transparent ? 'transparent' : 'black',
      'display': 'block',
      'overflow-y': 'scroll',
      '-webkit-overflow-scrolling': 'touch',
    });
    if (!this.isTransparent) {
      const _this = this;
      window.setTimeout(function() {
        _this.$el.css({
          'opacity': '1',
        });
      }, 1);
    }
  },

  close: function (overlayClick) {
    if (this.shouldInitialize) {
      this.init();
      this.shouldInitialize = false;
    }

    if (this.preventClose && overlayClick === true) {
      return;
    }

    $('body').css({
      'overflow': 'visible',
      'position': 'static',
    });
    this.$el.css({
      'opacity': '0',
    });
    $('body').css({ 'overflow': 'initial' });
    if (!this.isTransparent) {
      const _this = this;
      window.setTimeout(function() {
        _this.$el.hide();
        PopupStack.empty();
        _this.trigger('overlayDidCloseEVENT');
      }, 200);
    } else {
      this.$el.hide();
      PopupStack.empty();
      this.trigger('overlayDidCloseEVENT');
    }
  },

  getBodyStyles: function(fixed) {
    let styles = {
      'left': 0,
      'top': 0,
      'width': '100%',
    };

    if(fixed) {
      styles = _.extend({
        'overflow': 'hidden',
        'position': 'fixed',
      }, styles);
    }

    return styles;
  },
};

export default Overlay;
