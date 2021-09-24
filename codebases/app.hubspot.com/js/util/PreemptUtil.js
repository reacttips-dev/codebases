/* global hubspot */
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { registerBrowserApiValue, getBrowserApiValue } from './BrowserApiUtil';
import { debug } from './DebugUtil';
/**
 * @description Sets up a public API for registering predicates that
 * can prevent floating alerts from being displayed. On setup, it adds
 * the API methods to the browser API object, and then calls any post-setup
 * callbacks that apps may have registered. This addresses the race condition
 * where applications may start up before this API has been registered on
 * the global `hubspot.notifications` object.
 */

export var PreemptUtil = /*#__PURE__*/function () {
  function PreemptUtil() {
    _classCallCheck(this, PreemptUtil);

    this.predicates = ImmutableMap();
    registerBrowserApiValue('registerPreemptPredicate', this.registerPreemptPredicate.bind(this));
    this.handleSetupComplete();
  }
  /**
   * @description calls any callbacks that have been set on the global
   * window object to indicate that the preempt API has been setup
   */


  _createClass(PreemptUtil, [{
    key: "handleSetupComplete",
    value: function handleSetupComplete() {
      var postSetupCallbacks = getBrowserApiValue('onPreemptApiSetupCallbacks');

      if (postSetupCallbacks && postSetupCallbacks.length) {
        postSetupCallbacks.forEach(function (onSetup) {
          if (typeof onSetup === 'function') {
            onSetup();
          }
        });
      }
    }
    /**
     * @description register a boolean-returning predicate.
     * @param {Object} options
     * @param {String} options.origin a notification origin to filter
     * notifications by. Note: this should be equal to the
     * notification.origin.name value found on notifications
     * the registering application cares about.
     * @param {Function} options.predicate
     * @returns {Function} a pre-bound function that deregisters the
     * predicate.
     */

  }, {
    key: "registerPreemptPredicate",
    value: function registerPreemptPredicate() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          origin = _ref.origin,
          predicate = _ref.predicate;

      if (!origin) throw new Error('PreemptUtil origin required to register predicate');
      if (typeof predicate !== 'function') throw new Error('Predicate must be a functcion');
      this.predicates = this.predicates.update(origin, function (maybeSet) {
        return maybeSet ? maybeSet.add(predicate) : ImmutableSet([predicate]);
      });
      return this.deregisterPreemptPredicate.bind(this, {
        origin: origin,
        predicate: predicate
      });
    }
    /**
     * @description deregister a registered predicate
     * @param {Object} options
     * @param {String} options.origin the notification origin the
     * predicate was registered with
     * @param {Function} options.predicate
     */

  }, {
    key: "deregisterPreemptPredicate",
    value: function deregisterPreemptPredicate(_ref2) {
      var origin = _ref2.origin,
          predicate = _ref2.predicate;
      var originPredicates = this.predicates.get(origin) || ImmutableSet();
      this.predicates.set(origin, originPredicates.remove(predicate));
    }
    /**
     * @description returns true if a notification should be blocked
     * based on any predicates registered under the same origin
     * @param {Notification} notification
     * @returns {Boolean}
     */

  }, {
    key: "shouldBlockNotification",
    value: function shouldBlockNotification(notification) {
      if (!notification || !notification.origin) {
        return false;
      }

      var origin = notification.origin.name;
      var originPredicates = this.predicates.get(origin) || ImmutableSet();
      var shouldBlock = originPredicates.reduce(function (accumulator, predicate) {
        return accumulator || predicate(notification) === false;
      }, false);

      if (shouldBlock) {
        debug('Notification blocked by preempt predicate');
      }

      return shouldBlock;
    }
  }]);

  return PreemptUtil;
}();
var PreemptUtilSingleton = new PreemptUtil();
export var shouldBlockNotification = PreemptUtilSingleton.shouldBlockNotification.bind(PreemptUtilSingleton);