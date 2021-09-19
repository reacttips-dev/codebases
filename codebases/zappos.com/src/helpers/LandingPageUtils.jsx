import React from 'react';

import marketplace from 'cfg/marketplace.json';
import { CONTENT_LINK_ACTION_PARSE_RE, MATCH_TEMPLATE_VARIABLE } from 'common/regex';
import { onEvent } from 'helpers/EventHelpers';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { makeOpenLiveChat } from 'helpers/ClientUtils';

/**
* Returns an object with Site-ops defined bgcolor attribute
* which will be set on the component as the inline 'style' property
*/
export function setInlineBackgroundColor(bgcolor) {
  if (bgcolor) {
    return { background: bgcolor };
  }
  return null;
}

/**
* Returns an object with Site-ops defined textcolor as the color attribute
* which will be set on the component as the inline 'style' property
*/
export function setInlineTextColor(textcolor) {
  if (textcolor) {
    return { color: textcolor };
  }
  return null;
}

/**
* Returns an object with Site-ops defined textcolor as the color and border-color attributes
* which will be set on the component as the inline 'style' property
*/
export function setInlineTextAndBorderColor(textcolor) {
  if (textcolor) {
    return { color: textcolor, borderColor: textcolor };
  }
  return null;
}

/**
* Returns an object with Site-ops defined textcolor as the color and border-bottom color attributes
* which will be set on the component as the inline 'style' property
*/
export function setInlineTextAndBorderBottomColor(textcolor) {
  if (textcolor) {
    return { color: textcolor, borderBottom: `1px solid ${textcolor}` };
  }
  return null;
}

/**
* Create or select event value for ProductGrid/MelodyCurated components
*/
export function makeProductAnalyticsEventValue(gae, productId, styleId, productName, name) {
  if (gae) {
    return gae;
  } else if (productId) {
    return `product-${productId}${styleId ? `-style-${styleId}` : ''}`;
  } else {
    return productName || name;
  }
}

/**
* Checks for Symphony <a> links including data-application-action attributes,
* with meta-data and/or instructions to render them.
*
* For example, <a data-application-action="livechat-popup" ... ></a>
* instructs Marty to open the link in a popup window.
*/
export function setupLandingEventWatcher(landingComponent, doOpenLiveChat) {
  const { chatWindowName } = marketplace;
  doOpenLiveChat = doOpenLiveChat || makeOpenLiveChat(chatWindowName);
  onEvent(document.body, 'click', e => {
    const { target } = e;
    if (target.tagName === 'A') {
      const contentApplicationAction = target.getAttribute('data-application-action') || '';
      const [ , actionName ] = contentApplicationAction.match(CONTENT_LINK_ACTION_PARSE_RE) || [];
      if (actionName === 'livechat-popup') {
        doOpenLiveChat(e);
        trackEvent('TE_PV_LANDINGPAGE', 'Live Help');
        trackLegacyEvent('Main-Nav', 'CustomerService', 'Live-Help');
      }
    }
  }, null, landingComponent);
}

/**
 * Landing and Brand send in the slotIndex;
 * > 1 it's the first 2 slots on the page & will not lazyload
 * The rest of the slots on the page will be true & will lazyload
 */
export function shouldLazyLoad(slotIndex) {
  return slotIndex > 1;
}

export const makeComponentHeading = ({ heading, className }) => heading && <h2 className={className}>{heading}</h2>;

export const isCurrentPageUrlTest = (page = '', tests = []) => {
  if (Array.isArray(tests)) {
    const [currentTest] = tests.filter(test => test?.url === `${marketplace.desktopHost}${page}`);
    return currentTest;
  }
  return undefined;
};

// This is done to avoid the special string parameter logic in String.prototype.replace
const stringReplace = replacement => () => replacement;

export function replaceTemplateVariable(pattern, replacement) {
  // return early if pattern or replacement is missing
  if (!pattern || !replacement || typeof pattern !== 'string') {
    return;
  }

  // return pattern if pattern contains no template variables
  if (!MATCH_TEMPLATE_VARIABLE.test(pattern)) {
    return pattern;
  }

  // single variable replacement
  {
    if (typeof replacement === 'string' || typeof replacement === 'number' || replacement?.length === 1) {
      if (MATCH_TEMPLATE_VARIABLE.test(pattern)) {
        return pattern.replace(MATCH_TEMPLATE_VARIABLE, stringReplace(replacement));
      }
    }
  }

  // if pattern is an array, loop over each and replace
  if (typeof replacement === 'object' && replacement?.length > 1) {
    const patterns = pattern.match(RegExp(MATCH_TEMPLATE_VARIABLE, 'g'));
    patterns.forEach((reg, i) => {
      pattern = pattern.replace(reg, stringReplace(replacement[i]));
    });

    return pattern;
  }
}
