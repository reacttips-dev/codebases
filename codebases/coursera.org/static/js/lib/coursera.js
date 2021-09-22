/* eslint-disable new-cap */
// DEPRECATED

import Backbone from 'backbone';

import $ from 'jquery';
import config from 'js/app/config';
import Logger from 'js/lib/log';
import metatags from 'js/lib/metatags';
import MultiTracker from 'js/lib/multitracker';
import Origami from 'js/lib/origami';
import path from 'js/lib/path';
import persistQueryParams from 'js/lib/persistQueryParams';
import ScrollTracker from 'js/lib/scrollTracker';
import supports from 'js/lib/supports';

const ROUTE_EVENT = Backbone.VERSION === '0.9.2' ? 'all' : 'route';

const Coursera = new Origami('#origami');

const scrollTracker = new ScrollTracker(undefined, { routeEvent: ROUTE_EVENT });
scrollTracker.start(Coursera.router);

Coursera.config = config;
Coursera.supports = supports;
Coursera.log = Logger({
  level: config.log,
});

Coursera.multitracker = MultiTracker({
  logger: Coursera.log,
});
Coursera.multitracker.register('204', []);
Coursera.multitracker.register('400', [], 'custom', function (_) {
  return _;
});
Coursera.multitracker.register('ga', (window._gaq = []), 'google');

// force third party libraries to load after document is loaded
$(document).ready(function () {
  // load ga.js
  if (/staging|production/.test(Coursera.config.environment)) {
    require(['js/lib/204'], function (_204Module) {
      const _204 = _204Module.default;
      if (!_204) return;

      // we want to remove the subdomain and only preserve the domain and the tld
      const parts = location.host.split('.');
      while (parts.length > 2) {
        parts.shift();
      }

      // set domain for session to be subdomain ambivalent
      Coursera.multitracker.get('204').queue.push(['domain', '.' + parts.join('.')]);

      // make sure queue is in sync with 204's tracker
      Coursera.multitracker.get('204').queue = _204.batch(Coursera.multitracker.get('204').queue);
    });

    // require(['js/lib/400'], function(_400) {
    //   if (_400) {
    //     Coursera.multitracker.get('400').queue = _400;
    //   }
    // });
  }

  // on all router changes, push activity on queue
  Coursera.router.on(ROUTE_EVENT, function () {
    const currentURL = path.join(Coursera.config.url.base, Backbone.history.getFragment());

    // Extract strings out of JS files -Yang
    // TODO(jnam) consolidate the duplicated Coursera description (Take free...)
    metatags.setCommon({
      title: 'Coursera',
      imageHref: 'http://s3.amazonaws.com/coursera/media/Partner_Logos.png',
      pageHref: currentURL,
      description:
        'Take free online classes from 120+ top universities and organizations. Coursera is a social ' +
        'entrepreneurship company partnering with Stanford University, Yale University, Princeton University and ' +
        'others around the world to offer courses online for anyone to take, for free. We believe in connecting ' +
        'people to a great education so that anyone around the world can learn without limits.',
    });

    Coursera.multitracker.pushV2(['pageview']);
    scrollTracker.scroll(0);
  });

  persistQueryParams(window.location.href, [
    'locale',
    // Used to generate tracking calls to nanigans (paid ads service)
    'nan_pid',
  ]);
});

export default Coursera;
