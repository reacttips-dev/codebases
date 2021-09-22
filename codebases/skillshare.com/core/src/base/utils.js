const Utils = {

  screenSizes: {
    SCREEN_SMALL_MIN: 541,
    SCREEN_XS_MAX: 540,
    SCREEN_SMALL_MAX: 809,
  },

  mediaTypes: {
    MEDIA_TYPE_MOBILE: 'mobile',
    MEDIA_TYPE_TABLET: 'tablet',
  },

  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // Helper to match media queries for tablet or mobile
  matchMedia(media) {
    // matchMedia is not supported in IE9 and lower, not providing a fallback for now
    // since it's such a rare use case
    if (!window.matchMedia) {
      return;
    }

    let mediaQuery = '';

    if (media === this.mediaTypes.MEDIA_TYPE_MOBILE) {
      mediaQuery = 'screen and (max-width: ' + this.screenSizes.SCREEN_XS_MAX + 'px)';
    } else if (media === this.mediaTypes.MEDIA_TYPE_TABLET) {
      mediaQuery = 'screen and (min-width: ' + this.screenSizes.SCREEN_SMALL_MIN + 'px) and (max-width: ' + this.screenSizes.SCREEN_SMALL_MAX + 'px)';
    }

    return window.matchMedia(mediaQuery);
  },

  getIEVersion() {
    let rv = -1; // Return value assumes failure.
    if (navigator.appName === 'Microsoft Internet Explorer') {
      const ua = navigator.userAgent;
      const re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
      if (re.exec(ua)) {rv = parseFloat(RegExp.$1);}
    }
    return rv;
  },

  // Returns whether the browser has push state support
  hasPushStateSupport() {
    const version = this.getIEVersion();

    if (version === -1) {
      return true;
    } else if (version < 10.0) {
      return false;
    }

    return true;
  },

  getPathname(_hasPushStateSupport) {
    let hasPushStateSupport;

    if (arguments.length === 0) {
      hasPushStateSupport = this.hasPushStateSupport();
    } else {
      hasPushStateSupport = _hasPushStateSupport;
    }

    if (!hasPushStateSupport) {
      return '/' + document.location.hash.substr(1);
    }

    return document.location.pathname;
  },

  visitorIsOnDevice() {
    return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Mobile)/i);
  },

  visitorIsOniOSWebView() {
    return navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i);
  },

  /**
     * @deprecated use this.ajax instead, which returns an es6 promise instead of a jQuery Deferred.
     */
  ajaxRequest(url, options = {}) {
    options.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-CSRFToken', $.cookie('YII_CSRF_TOKEN'));
    };

    return $.ajax(url, options);
  },

  ajax(url, options = {}) {
    // Converts the $.Deferred object from $.ajax into an ES6 Promise. Also, can't do Promise.resolve(this.ajaxRequest)
    // because when a thenable is passed to Promise.resolve, the thenable is returned, instead of a wrapped Promise.
    return new Promise((resolve, reject) => {
      this.ajaxRequest(url, options).then(resolve, reject);
    });
  },

  getTransitionEndEvent() {
    let t;
    const el = document.createElement('tmpelement');
    const transitions = {
      'transition': 'transitionend',
      'OTransition': 'otransitionend',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },

  visitorIsGuest() {
    const referredFromEmail = window.location.href.match('utm_medium=recommendation-email') !== null;
    return referredFromEmail === false
        && !$.cookie('subscriber_email')
        && !$.cookie('skillshare_user_')
        && $('#user-status').val() !== '1';
  },

  shouldDisplayPopup(cookieName) {
    return this.visitorIsGuest() && !$.cookie(cookieName);
  },

  isMobile() {
    return $(window).width() < this.screenSizes.SCREEN_SMALL_MAX;
  },

  isTouchDevice() {
    return 'ontouchstart' in window;
  },

  isOnMobileSafari() {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    return iOSSafari;
  },
};

export default Utils;
