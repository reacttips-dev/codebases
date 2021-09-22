import SSModel from 'core/src/models/base/ss-model';

const Watchlist = SSModel.extend({

  urlRoot: '/watchlist',
  defaults: {
    'isWatching': false,
  },

}, {
  VIA_LOGGED_IN_HOME: 'logged-in-home',
  VIA_LOGGED_IN_HOME_ROW: 'logged-in-home-row',
  VIA_LOGGED_IN_HOME_PREVIEW: 'logged-in-home-preview',
  VIA_LOGGED_IN_HOME_YOUR_CLASSES: 'logged-in-home-your-classes',
  VIA_PREVIEW_RELATED_CLASSES: 'preview-related-classes',
  VIA_BROWSE: 'browse',
  VIA_SEARCH: 'search',
});

export default Watchlist;

