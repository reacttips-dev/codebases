const parseDomain = require('parse-domain'),

  TRACK_COOKIE = 'postman-beta.track',
  DEFAULT_TRACK = 'default',
  TRACK_LIST = [DEFAULT_TRACK];

let BrowserActiveTrackService = {
  /**
   * Get the current active track from the TRACK_COOKIE cookie
   */
  getCurrentTrack () {
    let postmanTrackCookie = document.cookie.split('; ').find((row) => row.startsWith(TRACK_COOKIE)),
        cookieValue = postmanTrackCookie && postmanTrackCookie.split('=')[1];

    return cookieValue || DEFAULT_TRACK;
  },

  /**
   * Update the cookie that signifies which track needs to be served and then reload
   * the page
   * @param {String} track
   */
  setCurrentTrackAndRefresh (track) {
    if (!track) {
      return;
    }

    // We set the postman-beta.track cookie value as the track given and then refresh the
    // page. The cookie has the following configuration -
    // *) value = trackName (The name of the track that we want to load)
    // *) path = /
    // *) samesite = lax
    // *) domain = parsed from host (eg: cooper.postman.co -> .postman.co)
    let cookieToSet = `${TRACK_COOKIE}=${track}; path=/; samesite=lax`,
      parsedDomain = parseDomain(location.host);

    // we might be running in dev mode
    if (!parsedDomain) {
      return;
    }

    const baseCookieDomain = `.${parsedDomain.domain}.${parsedDomain.tld}`;

    cookieToSet = cookieToSet + `; domain=${baseCookieDomain}`;

    document.cookie = cookieToSet;

    location.reload();
  },

  /**
   * Returns the list of long-running active tracks
   */
  getActiveTracks () {
    return TRACK_LIST;
  }
};

export default BrowserActiveTrackService;
