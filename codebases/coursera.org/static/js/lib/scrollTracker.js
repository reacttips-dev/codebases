/**
 * This module automatically store scroll positions per route on Backbone
 * route changes.
 *
 * It supports the use case that when a user scrolls down the page, then navigates,
 * then clicks Back, they should appear at the same scroll position on the earlier page
 * as before.
 */
import Backbone from 'backbone';

import $ from 'jquery';
import _ from 'underscore';

/**
 * @param {Object} [scrollHash]
 * @param {Object} [options] {
 *   routeEvent: <String>, // 'route' by default
 * }
 */
function ScrollTracker(scrollHash, options) {
  this.scrollHash = _.extend({}, scrollHash);
  this.ROUTE_EVENT = (options && options.routeEvent) || 'route';
  this.$el = $(window);
}

function _getCurrentRoute() {
  const fragment = Backbone.history.fragment || '';
  // strip hashes and query strings
  return fragment.replace(/[#?].+/g, '');
}

function _updateRoute() {
  this.lastRoute = _getCurrentRoute();
}

ScrollTracker.prototype.start = function (router) {
  this.router = router;
  _updateRoute.call(this);
  this.router.on(
    this.ROUTE_EVENT,
    function (route, params) {
      this.set(this.lastRoute);
      _updateRoute.call(this);
    }.bind(this)
  );
};

ScrollTracker.prototype.stop = function () {
  this.router.off(this.ROUTE_EVENT);
};

ScrollTracker.prototype.get = function (route) {
  if (route === undefined) {
    route = _getCurrentRoute();
  }
  return this.scrollHash[route] || 0;
};

ScrollTracker.prototype.set = function (route) {
  if (route === undefined) {
    route = _getCurrentRoute();
  }
  this.scrollHash[route] = this.$el.scrollTop();
};

ScrollTracker.prototype.restore = function (route) {
  this.$el.scrollTop(this.get(route));
};

/**
 * Scrolls the top of the window to `pixels` and sets the new scroll position
 * as the saved scroll position for this route.
 */
ScrollTracker.prototype.scroll = function (pixels) {
  this.$el.scrollTop(pixels);
  this.set();
};

export default ScrollTracker;
