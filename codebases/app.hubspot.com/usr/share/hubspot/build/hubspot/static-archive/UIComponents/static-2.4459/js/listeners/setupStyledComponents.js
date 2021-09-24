'use es6';

import { ignoresStyleTagInsertionOrder } from '../utils/BrowserTest';
import { domReady } from './domReady';
var SC_ATTR = 'data-hubspot-styled-components'; // Custom for our styled-components repackage

var documentHeadObserver;
var DOCUMENT_HEAD_OBSERVER_OPTIONS = {
  childList: true
};

var reinsertNonStyledComponentsTags = function reinsertNonStyledComponentsTags() {
  documentHeadObserver.disconnect(); // prevent infinite loops

  [document.head, document.body].forEach(function (container) {
    var styleTags = container.querySelectorAll("link[rel=\"stylesheet\"], style:not([" + SC_ATTR + "])");
    [].slice.call(styleTags).forEach(function (styleTag) {
      var originalSheet = styleTag.sheet;

      try {
        // eslint-disable-next-line no-unused-expressions
        originalSheet && originalSheet.rules;
      } catch (e) {
        // Access denied when accessing rules (#6663), ignore this sheet
        return;
      }

      container.appendChild(styleTag);
      var newSheet = styleTag.sheet;
      if (!originalSheet || !originalSheet.rules || !newSheet || !newSheet.rules) return; // #5863
      // Ensure that any styles that were inserted dynamically are carried over.

      if (newSheet.rules.length < originalSheet.rules.length) {
        for (var i = 0; i < originalSheet.rules.length; i++) {
          if (originalSheet.rules[i] !== newSheet.rules[i]) {
            newSheet.insertRule(originalSheet.rules[i].cssText, i);
          }
        }
      }
    });
  });
  documentHeadObserver.observe(document.head, DOCUMENT_HEAD_OBSERVER_OPTIONS);
};

var hasSetupStyledComponents = false;

var oneTimeSetupStyledComponents = function oneTimeSetupStyledComponents() {
  if (hasSetupStyledComponents) return;
  var head = document.head; // Cleanup for the styled-components v3/v4 repackage logic, no longer needed for v5

  var anchorTag = head.querySelector('[data-hubspot-styled-components-anchor]');

  if (anchorTag != null) {
    head.removeChild(anchorTag);
  }

  if (ignoresStyleTagInsertionOrder()) {
    // IE11 and Edge < 17 base style precedence on when tags were inserted, rather than their order
    // in the DOM! So, to keep the ordering consistent, we need to re-insert all style tags that are
    // *not* from styled-components any time a styled-components tag is added.
    documentHeadObserver = new MutationObserver(reinsertNonStyledComponentsTags);
    documentHeadObserver.observe(document.head, DOCUMENT_HEAD_OBSERVER_OPTIONS);
    reinsertNonStyledComponentsTags();
  }

  hasSetupStyledComponents = true;
  return;
};

export var setupStyledComponents = function setupStyledComponents() {
  domReady(function () {
    setTimeout(oneTimeSetupStyledComponents, 0); // Ensure that this method runs in its own tick
  });
};
export var resetSetupForTests = function resetSetupForTests() {
  hasSetupStyledComponents = false;
};