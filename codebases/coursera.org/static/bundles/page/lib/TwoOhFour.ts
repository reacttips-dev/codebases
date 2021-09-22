import cookies from 'js/lib/cookie';

// hack for backwards compatibility
const src = /.*\/204\.(min\.)?js(\?.*)?$/;

class TwoOhFour {
  constructor(ping: $TSFixMe, document: $TSFixMe, location: $TSFixMe, screen: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ping' does not exist on type 'TwoOhFour'... Remove this comment to see the full error message
    this.ping = ping;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    this.document = document;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    this.location = location;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'screen' does not exist on type 'TwoOhFou... Remove this comment to see the full error message
    this.screen = screen;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    const scripts = this.document.getElementsByTagName('script');
    const count = scripts.length;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    const referrer = this.document.referrer;
    // Use top level coursera domain as the default cookie domain to use the
    // same cookies across all coursera properties
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    const parts = this.location.host.split('.');
    while (parts.length > 2) {
      parts.shift();
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'archive' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    this.archive = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    this.options = {
      user: null,
      version: null,
      client: '204',
      from: referrer,
      domain: '.' + parts.join('.'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'TwoOhF... Remove this comment to see the full error message
      currentURL: this.location.href,
      tracker: '__204u',
      // storing initial referrer in the cookie so each event is associated
      // with where a user orginally came from, and we won't have to do heavy
      // processing to compute the initial referrer from the event log
      initialReferrerTracker: '__204r',
      beacon: 'https://www.coursera.org/eventing/info',
      debug: false,
    };

    for (let i = 0; i < count; i += 1) {
      if (src.test(scripts[i].src)) {
        const match = /^.+\?(.*)$/.exec(scripts[i].src);

        if (match) {
          const params = match[1].split('&');

          for (let j = 0; j < params.length; j += 1) {
            const param = params[j].split('=');

            if (/client|user|version|tracker|beacon/.test(param[0])) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
              this.options[param[0]] = decodeURIComponent(param[1]);
            }
          }
        }

        break;
      }
    }

    this.initialize();
  }

  // ugly but called in constructor() and in push()
  initialize() {
    // get (or create and get) a previous random stored session for the user
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    this.options.session = this.session();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    const key = this.options.initialReferrerTracker;
    const options = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
      domain: this.options.domain,
      days: 365,
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    this.options.initialReferrer = cookies.setOnce(key, this.options.from, options);
  }

  session(id: $TSFixMe) {
    const options = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
      domain: this.options.domain,
      days: 365,
    };
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    return cookies.get(this.options.tracker, options);
  }

  push(command: $TSFixMe) {
    if (typeof command === 'object') {
      if ((Array.isArray && Array.isArray(command)) || command.constructor === Array) {
        switch (command[0]) {
          case 'send':
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
            this.send(command[1], command[2]);
            break;

          case 'tracker':
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
            this.options.tracker = command[1];
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
            this.options.session = this.session();
            break;

          case 'post':
            this.send(command[1], command[2], true);
            break;

          case 'domain':
            const newDomain = command[1];
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
            if (newDomain !== this.options.domain) {
              // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
              cookies.removeAll([this.options.tracker, this.options.initialReferrerTracker], {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
                domain: this.options.domain,
              });
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
              this.options.domain = newDomain;
              this.initialize();
            }

            break;

          default:
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
            this.options[command[0]] = command[1];
            break;
        }
      } else {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
        this.send(command);
      }
    }

    return this;
  }

  /**
   * @param {Boolean} isPostIgnored now ignored, and post is based on data size
   */
  send(dataStrOrObj = {}, callback: $TSFixMe, isPostIgnored: $TSFixMe) {
    const data =
      typeof dataStrOrObj === 'string'
        ? {
            key: dataStrOrObj,
          }
        : dataStrOrObj;

    // update from, so future events can keep track of navigation history
    // helpful on dynamic html5 pages, since document.referrer is stale
    // This value should only change when there's a page/route change
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'TwoOhF... Remove this comment to see the full error message
    if (this.location.href !== this.options.currentURL) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
      this.options.from = this.options.currentURL;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
      this.options.currentURL = this.location.href;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    if (this.options.user) data.user = this.options.user;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    if (this.options.version) data.version = this.options.version;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    if (this.options.from) data.from = this.options.from;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    if (this.options.initialReferrer) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'initialReferrer' does not exist on type ... Remove this comment to see the full error message
      data.initialReferrer = this.options.initialReferrer;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'session' does not exist on type '{}'.
    data.session = this.options.session;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'client' does not exist on type '{}'.
    data.client = this.options.client;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type '{}'.
    data.url = this.location.href;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'time' does not exist on type '{}'.
    data.time = new Date().getTime();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'screen' does not exist on type 'TwoOhFou... Remove this comment to see the full error message
    if (this.screen) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'screen' does not exist on type '{}'.
      data.screen = { height: this.screen.height, width: this.screen.width };
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
    if (this.options.debug) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'archive' does not exist on type 'TwoOhFo... Remove this comment to see the full error message
      this.archive.push(data);
      if (callback) callback();
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ping' does not exist on type 'TwoOhFour'... Remove this comment to see the full error message
      this.ping(this.options.beacon, data, callback);
    }

    return this;
  }

  batch(batch: $TSFixMe) {
    while (batch && batch.length) {
      this.push(batch.shift());
    }

    return this;
  }
}

export default TwoOhFour;
