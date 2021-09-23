import { DEFAULT_MODAL_TRANSITION_TIMING } from 'HubStyleTokens/times';
import defer from 'hs-promise-utils/defer';
import { debug } from './debugUtil';
import { getElement } from './elementUtil';
import SentryManager from '../manager/SentryManager';
var MAX_WAIT_TIMEOUT = 10000;
/**
 * Returns the delay needed due to the animation of a modal opening - attempting to attach to an animating modal
 * can have unpredictable results. The DEFAULT_MODAL_TRANSITION_TIMING is a string ending in 'ms'.
 */

function getAnimationDelay() {
  var timeString = DEFAULT_MODAL_TRANSITION_TIMING;
  return parseInt(timeString.slice(0, timeString.length - 2), 10) + 100;
}
/**
 * Watches dom changes, returns a promise with resolves when a specificed elementQuery is matched, passing in the element as the first argument
 * @param {String} elementQuery
 */


export var waitForElementToAppear = function waitForElementToAppear(options) {
  var elementQuery = options.elementQuery,
      elementGetter = options.elementGetter,
      requiresModalAnimation = options.requiresModalAnimation,
      _options$targetDocume = options.targetDocument,
      targetDocument = _options$targetDocume === void 0 ? document : _options$targetDocume;
  var deferred = defer();
  debug('Waiting for element: ', elementQuery || elementGetter);
  var maybeElement = getElement({
    elementQuery: elementQuery,
    elementGetter: elementGetter,
    targetDocument: targetDocument
  });

  if (maybeElement) {
    deferred.resolve(maybeElement);
  } else {
    var observer = new MutationObserver(function () {
      var maybeAppearedElement = getElement({
        elementQuery: elementQuery,
        elementGetter: elementGetter,
        targetDocument: targetDocument
      });

      if (maybeAppearedElement) {
        debug('Element is visible: ', elementQuery || elementGetter);

        if (requiresModalAnimation) {
          var timeToWait = getAnimationDelay();
          setTimeout(deferred.resolve.bind(undefined, maybeAppearedElement), timeToWait);
        } else {
          deferred.resolve(maybeAppearedElement);
        }
      }
    });
    observer.observe(targetDocument, {
      attributes: true,
      childList: true,
      characterData: false,
      subtree: true
    });
    deferred.promise.finally(function () {
      observer.disconnect();
    });
  }

  return deferred.promise;
};
export var waitForAttachToElementToAppearOrFireSentry = function waitForAttachToElementToAppearOrFireSentry(tourId, stepId, options) {
  var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_WAIT_TIMEOUT;
  var deferred = defer(); // If the element doesn't load in a certain period, error out

  var timeoutId = setTimeout(function () {
    SentryManager.reportElementLoadTimeout(tourId, stepId);
    deferred.reject(undefined);
  }, timeout);
  waitForElementToAppear(options).then(function (maybeElement) {
    deferred.resolve(maybeElement);
  }).done();
  deferred.promise.finally(function () {
    window.clearTimeout(timeoutId);
  });
  return deferred.promise;
};