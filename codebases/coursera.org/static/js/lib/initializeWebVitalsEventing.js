import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals';

import Multitracker from 'js/app/multitrackerSingleton';
import envUtils from 'bundles/next/utils/envUtils';

const WEB_VITALS_FULL_NAME = {
  FID: 'first_input_delay',
  CLS: 'cumulative_layout_shift',
  LCP: 'largest_contentful_paint',
  TTFB: 'time_to_first_byte',
  FCP: 'first_contentful_paint',
};

// This blog post was used as a reference
// https://web.dev/debug-web-vitals-in-the-field/#usage-with-the-web-vitals-javascript-library

// takes a DOM node and returns a CSS selector representing that node and its place in the DOM
function getSelector(node, maxLen = 100) {
  let sel = '';
  try {
    while (node && node.nodeType !== 9) {
      const part = node.id
        ? '#' + node.id
        : node.nodeName.toLowerCase() +
          (node.className && node.className.length ? '.' + Array.from(node.classList.values()).join('.') : '');
      if (sel.length + part.length > maxLen - 1) return sel || part;
      sel = sel ? part + '>' + sel : part;
      if (node.id) break;
      node = node.parentNode;
    }
  } catch (err) {}
  return sel;
}

function getLargestLayoutShiftEntry(entries) {
  return entries.reduce((a, b) => (a && a.value > b.value ? a : b));
}

function getLargestLayoutShiftSource(sources) {
  return sources.reduce((a, b) => {
    return a.node && a.previousRect.width * a.previousRect.height > b.previousRect.width * b.previousRect.height
      ? a
      : b;
  });
}

function wasFIDBeforeTTI(fidEntry) {
  if (envUtils.isNextJSApp) {
    // These are timing events so we use the `duration`
    const nextJSBeforeHydrationEvent = performance.getEntriesByName('Next.js-before-hydration')?.[0];
    const nextJSHydrationEvent = performance.getEntriesByName('Next.js-hydration')?.[0];

    // If the events don't exist, then FID was before TTI.
    return (
      !nextJSBeforeHydrationEvent ||
      !nextJSHydrationEvent ||
      fidEntry.startTime < nextJSBeforeHydrationEvent.duration + nextJSHydrationEvent.duration
    );
  } else {
    // This is only a mark so we use `startTime`
    const ssrV2RenderCompleteEvent = performance.getEntriesByName('serverRendering.completeRender')?.[0];
    return !ssrV2RenderCompleteEvent || fidEntry.startTime < ssrV2RenderCompleteEvent.startTime;
  }
}

// Adds additional information about what caused high CLS, LCP, or FID.
function getDebugInfo(name, entries = []) {
  // In some cases there won't be any entries (e.g. if CLS is 0,
  // or for LCP after a bfcache restore), so we have to check first.
  if (entries.length) {
    if (name === 'LCP') {
      const lastEntry = entries[entries.length - 1];
      return {
        // What layout shift caused LCP to fire/
        debug_target: getSelector(lastEntry.element),
      };
    } else if (name === 'FID') {
      const firstEntry = entries[0];
      return {
        // What did the user interact with that caused FID to fire.
        debug_target: getSelector(firstEntry.target),
        // The user event that triggered FID.
        debug_event: firstEntry.name,
        // If FID occurred before TTI
        debug_timing: wasFIDBeforeTTI(firstEntry) ? 'pre_tti' : 'post_tti',
        // The start time of the event that caused FID.
        event_time: firstEntry.startTime,
      };
    } else if (name === 'CLS') {
      const largestEntry = getLargestLayoutShiftEntry(entries);
      if (largestEntry && largestEntry.sources) {
        const largestSource = getLargestLayoutShiftSource(largestEntry.sources);
        if (largestSource) {
          return {
            // The selector of the largest layout shift
            debug_target: getSelector(largestSource.node),
            // The time of the largest layout shift.
            event_time: largestEntry.startTime,
          };
        }
      }
    }
  }
}

const reportingFunction = ({ name, value, id, entries }) => {
  Multitracker.pushV2([
    `page.time.web_vitals.${WEB_VITALS_FULL_NAME[name] || name}`,
    {
      // Since CLS is not a timing, we use a more descriptive key for CLS.
      ...(name === 'CLS' ? { cumulative_layout_shift_score: value } : { time_in_millis: value }),
      id,
      ...getDebugInfo(name, entries),
    },
  ]);
};

const initialize = () => {
  getCLS(reportingFunction);
  getFID(reportingFunction);
  getLCP(reportingFunction);
  getTTFB(reportingFunction);
  getFCP(reportingFunction);
};

export default initialize;
