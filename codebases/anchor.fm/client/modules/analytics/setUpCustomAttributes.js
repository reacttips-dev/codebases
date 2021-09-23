/**
 * This is a side-effects only file that will set CUSTOM DIMENSIONS
 * for google analytics tracking, such as whether or not the page is
 * in a focused tab/window.
 */

const CUSTOM_DIMENSIONS = {
  PAGE_VISIBILITY: 'dimension1',
};

export default function configureUserMetrics() {
  trackIsWindowHidden();
}

// http://stackoverflow.com/a/1060034
function trackIsWindowHidden() {
  if (typeof ga === 'undefined') {
    return;
  }
  let hidden = 'hidden';

  // Standards:
  if (hidden in document)
    document.addEventListener('visibilitychange', onchange);
  else if ((hidden = 'mozHidden') in document)
    document.addEventListener('mozvisibilitychange', onchange);
  else if ((hidden = 'webkitHidden') in document)
    document.addEventListener('webkitvisibilitychange', onchange);
  else if ((hidden = 'msHidden') in document)
    document.addEventListener('msvisibilitychange', onchange);
  // IE 9 and lower:
  else if ('onfocusin' in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

  function onchange(evt) {
    const v = 'visible';

    const h = 'hidden';

    const evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h,
    };

    evt = evt || window.event;
    if (evt.type in evtMap) {
      return setHidden(ga, evtMap[evt.type]);
    }
    return setHidden(ga, this[hidden] ? 'hidden' : 'visible');
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined)
    onchange({ type: document[hidden] ? 'blur' : 'focus' });
}

function setHidden(ga, hidden) {
  ga('set', CUSTOM_DIMENSIONS.PAGE_VISIBILITY, hidden);
}
