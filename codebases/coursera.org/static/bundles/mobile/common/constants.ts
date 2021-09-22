const exported = {
  /**
   * List of definitions for deep-linkable pages.
   * ORDER MATTERS! If there are multiple pattern matches, the first definition
   *   will take effect.
   *
   * @type {Array} List of {
   *   page: <String> human-readable, unique identifier for the page
   *   pattern: <RegExp> window pathname that the definition applies to
   *   webToMobilePathTranslator: <Function> that changes the window pathname
   *     to mobile deep-link target pathname.
   * }
   */
  deepLinkablePages: [
    {
      page: 'browse-subdomain',
      pattern: /\/browse\/(.+)\/(.+)/,
      webToMobilePathTranslator: (path: $TSFixMe) => path,
    },
    {
      page: 'browse-domain',
      pattern: /\/browse\/([a-z]+)(.+)/,
      webToMobilePathTranslator: (path: $TSFixMe) => path,
    },
    {
      page: 'browse-root',
      pattern: /\/browse/,
      webToMobilePathTranslator: (path: $TSFixMe) => path.split('/').slice(0, 2).join('/'), // watch out for trailing '/'
    },
    {
      page: 'sdp',
      pattern: /\/specializations\/([a-z]+)(.+)/,
      webToMobilePathTranslator: (path: $TSFixMe) => path,
    },
    {
      page: 'ondemand-cdp-resource',
      pattern: /\/learn\/(.+)\/(supplement|exam|quiz|lecture)\/(.+)\/(.+)/,
      webToMobilePathTranslator: (path: $TSFixMe) => path.split('/').slice(0, 5).join('/'),
    },
    {
      page: 'ondemand-cdp-home-welcome',
      pattern: /\/learn\/(.+)\/home\/welcome/,
      webToMobilePathTranslator: (path: $TSFixMe) => path.split('/').slice(0, 5).join('/'),
    },
    {
      page: 'ondemand-cdp',
      pattern: /\/learn\/([^\/]+)/,
      webToMobilePathTranslator: (path: $TSFixMe) => path,
    },
  ],

  APP_STORE_STARS: {
    android: 4.4,
    ios: 4.5,
  },

  APP_STORE_RATING_COUNTS: {
    android: 75000,
    ios: 7500,
  },

  bannerCourseraLogoPath: 'images/favicons/apple-touch-icon-144x144.png',
};

export default exported;

export const { deepLinkablePages, APP_STORE_STARS, APP_STORE_RATING_COUNTS, bannerCourseraLogoPath } = exported;
