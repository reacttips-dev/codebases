import ImagePopupView from 'core/src/views/popups/image-popup';
import FormHelpers from 'core/src/helpers/form-helpers';
import ProgressBarView from 'core/src/views/modules/progress-bar';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import 'jquery-ui/data';
import 'bootstrap-tooltip';

const Common = {

  initProgressBars: function() {
    $('.progress-bar.stepped').each(function(index, element) {
      new ProgressBarView({ el: $(element), autoFill: true, animateFill: true });
    });
  },

  initNewTooltips: function(ctx) {
    const context = !(ctx instanceof $) ? $('body') : ctx;
    context.find('[rel="tooltip"]').each(function(i, el) {
      const delay = !_.isUndefined($(el).data('ss-tooltip-delay'))
        ? $(el).data('ss-tooltip-delay') : 300;
      $(el).tooltip({
        delay: delay,
      });
    });
  },

  destroyTooltips: function(ctx) {
    const context = !(ctx instanceof $) ? $('body') : ctx;
    context.find('[rel="tooltip"]').each(function() {
      $(this).tooltip('destroy');
    });
  },

  initAllImages: function(aContext, returnContext = false) {
    const context = _.isUndefined(aContext) ? $('body') : $(aContext);
    const svgAsImgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');

    context.find('img.zoomable')
      .not(':data(ss-zoom-init)')
      .click(function(e) {
        new ImagePopupView({
          originalImg: $(e.currentTarget),
          imgSrc: $(e.currentTarget).attr('src'),
        });
      })
    // mark img as initialized
      .data('ss-zoom-init', true);

    if (!svgAsImgSupport) {
      context.find('img[data-svg-fallback]').each(function(index, element) {
        const $el = $(element);

        $el.attr('src', $el.attr('data-svg-fallback'));
      });
    }

    if (returnContext) {
      return context;
    }
  },

  // @param inputs: array
  addShortUrlFocusEvents: function() {
    $('.select-on-click').on('focus', function(e) {
      $(e.currentTarget).trigger('select');
    })
      .on('mouseup', function(e) {
        e.preventDefault();
      });
  },

  initSocialEventTracking: function() {
    try {
      window.twttr = (function(d, s, id) {
        let t;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        const js = d.createElement(s);
        js.id = id;
        js.src = '//platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
        // eslint-disable-next-line no-return-assign
        return window.twttr || (t = { _e: [], ready: function(f) {
          t._e.push(f);
        } });
      }(document, 'script', 'twitter-wjs'));
    } catch (e) {
      //
    }
  },

  initRestrictedAccessHandlers: function(ctx) {
    // If user is not a guest, event listener will not trigger the popup
    if (SS.currentUser.isGuest()) {
      const context = !(ctx instanceof $) ? $('body') : ctx;

      const onClick = (event) => {
        const currentTarget = $(event.currentTarget);
        const isSiteBanner = $(event.target).hasClass('banner-content');
        const state = currentTarget.data('ss-restrict');
        const redirectReturn = currentTarget.data('ss-redirect-return');
        const redirectTo = redirectReturn === true ? document.location.href : currentTarget.data('ss-redirect');
        const userAgent = navigator.userAgent;

        if ((isSiteBanner
          && userAgent.toLowerCase().indexOf('instagram') != -1)
        ) {
          return true;
        }

        new TwoPanelSignupView({
          'state': state,
          'redirectTo': redirectTo,
          'showCouponCopy': isSiteBanner,
        });

        event.preventDefault();
      };

      context.find('[data-ss-restrict]:not(.initialized)').each(function(index, element) {
        const $el = $(element);
        $el.click(onClick);
        $el.addClass('initialized');
      });
    }
  },

  addCSRF: function() {
    $.ajaxPrefilter(function(options) {
      if (options.type.toUpperCase() !== 'POST'
                && options.type.toUpperCase() !== 'PUT'
                && options.type.toUpperCase() !== 'DELETE') {return;}

      const CSRFToken = $.cookie('YII_CSRF_TOKEN');
      let isString = false;

      if (typeof options.data === 'string') {
        try {
          // Try parsing it as a JSON encoded string.
          options.data = JSON.parse(options.data);
          isString = true;
        } catch (e) {
          // options.data is a URL-encoded string and cannot be treated
          // as a JavaScript object, so append the CSRF token and return here
          // to avoid treating options.data as an object below this point.
          if (!options.data.includes('YII_CSRF_TOKEN')) {
            options.data += '&YII_CSRF_TOKEN=' + CSRFToken;
          }

          return;
        }
      }

      if (typeof options.data === 'undefined' || options.data === null) {
        options.data = {};
      }

      options.data.YII_CSRF_TOKEN = CSRFToken;

      if (isString) {
        options.data = JSON.stringify(options.data);
      }
    });
  },

  // Routine that initializes all core elements
  // Run on page load, but also whenever necessary when new content is loaded in
  runPageRoutine: function() {
    FormHelpers.renderForm($('body'));
    Common.initAllImages();
    Common.initNewTooltips();
    Common.addShortUrlFocusEvents();
    Common.initSocialEventTracking();
    Common.initRestrictedAccessHandlers();
    Common.addCSRF();
  },
};

export default Common;
