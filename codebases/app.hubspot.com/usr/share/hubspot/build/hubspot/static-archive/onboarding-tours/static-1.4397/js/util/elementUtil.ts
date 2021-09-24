import { waitForElementToAppear } from './mutationUtil';

var convertNodeListToArray = function convertNodeListToArray(nodeList) {
  return [].slice.call(nodeList);
};
/**
 * Gets an element from the dom given an elementQuery and an optional contains string
 * @param {string} elementQuery
 * @param {string} contains
 * @returns {Element}
 */


export var getElement = function getElement(options) {
  var contains = options.contains,
      elementQuery = options.elementQuery,
      elementGetter = options.elementGetter,
      _options$targetDocume = options.targetDocument,
      targetDocument = _options$targetDocume === void 0 ? document : _options$targetDocume;

  if (typeof elementGetter === 'function') {
    return elementGetter() || undefined;
  }

  if (!elementQuery) {
    return undefined;
  }

  if (!contains) {
    return targetDocument.querySelector(elementQuery);
  }

  var elements = convertNodeListToArray(targetDocument.querySelectorAll(elementQuery));
  return elements.find(function (element) {
    return element.innerText.indexOf(contains) >= 0;
  });
};
export var doesElementExist = function doesElementExist(elementQuery) {
  return document.querySelectorAll(elementQuery).length > 0;
};
/**
 * Adds a listener to an element if the element currently exists, otherwise sets up a mutation observer which will wait for the element and set up the listener if the element appears
 * @param {string} elementQuery - the query for grabbing the element
 * @param {string} eventType - the event type (eg: click)
 * @param {function} callback - the function to call when the event occurs
 */

export var listenToEventOnElement = function listenToEventOnElement(elementQuery, eventType, callback) {
  waitForElementToAppear({
    elementQuery: elementQuery
  }).then(function (appearedElement) {
    return appearedElement.addEventListener(eventType, callback, {
      once: true
    });
  }).done();
};
/**
 * Get document element of iframe by css selector
 * @param {string} iframeSelector - css selector for iframe
 * @return {HTMLDocument} document - the document element of iframe
 */

export var getIframeDocument = function getIframeDocument(iframeSelector) {
  var iframeElement = document.querySelector(iframeSelector);

  if (!iframeElement || !iframeElement.contentWindow) {
    return undefined;
  }

  return iframeElement.contentWindow.document;
};