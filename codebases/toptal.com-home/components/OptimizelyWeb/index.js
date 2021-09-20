import {
    isBrowser
} from '@toptal/frontier'
import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

export const OptimizelyWeb = ({
    webProjectId,
    webEnabled
}) => {
    if (!webEnabled) {
        return null
    }

    // check out Optimizely's advice on avoiding non-flickering here https://github.com/optimizely/library/tree/master/nonblocking-snippet
    const maskingScript = `
var maskTimeout          = 3000,
    syncChangesApplied   = false;

/**
* Manages CSSStyleSheet actions
* Handles adding and removing rules from our "masking" sheet
*/
var cssRuleManager = {
  sheet: (function() {
    // https://davidwalsh.name/add-rules-stylesheets
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
  })(),
  addCSSRule: function(selector, rules) {
    if ("insertRule" in this.sheet) {
      this.sheet.insertRule(selector + "{" + rules + "}", 0);
    } else if ("addRule" in this.sheet) {
      this.sheet.addRule(selector, rules, 0);
    }
  }
}

/**
* Fired in the first call of Optimizely 'action.applied'
* Disables "masking" stylesheet
*/
var removeMask = function() {
  if(syncChangesApplied) return;
  cssRuleManager.sheet.disabled = true;
  syncChangesApplied = true;
}

// Mask <body> immediately
cssRuleManager.addCSSRule('body', 'visibility:hidden');

/**
* Listen for first sync change applied
* and unmask nodes
*/
window.optimizely = window.optimizely || [];
window.optimizely.push({
  type: "addListener",
  filter: {
    type: "lifecycle",
    name: "campaignDecided"
  },
  "handler": removeMask
});

setTimeout(removeMask, maskTimeout);
  `

    return (!isBrowser() && ( <
        Helmet >
        <
        script type = "text/javascript" > {
            maskingScript
        } < /script> <
        script src = {
            `https://cdn.optimizely.com/js/${webProjectId}.js`
        }
        async /
        >
        <
        /Helmet>
    ))
}

OptimizelyWeb.propTypes = {
    webProjectId: PropTypes.string,
    webEnabled: PropTypes.bool
}

export default OptimizelyWeb