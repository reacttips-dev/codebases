import { memoize } from 'lodash';
import { isNextJSApp } from 'bundles/next/utils/envUtils';

// REF http://stackoverflow.com/a/9716488/46040
function isNumeric(n: $TSFixMe) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// For some reason we round numbers on the client instead of the backend.
function _roundNumbers(obj: $TSFixMe) {
  const retVal = {};

  for (const key in obj) {
    // eslint-disable-line guard-for-in
    const val = obj[key];

    if (isNumeric(val)) {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retVal[key] = Math.round(val);
    } else if (typeof val === 'object') {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retVal[key] = _roundNumbers(val);
    } else {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retVal[key] = val;
    }
  }

  return retVal;
}

// PerformanceNavigationTiming APIs, which are the modern browser metrics APIs.
// We look at 4 metrics and store the entire raw object for performance analysis later.
function startLoadTime() {
  if (window.PerformanceNavigationTiming) {
    const ntEntry = performance.getEntriesByType('navigation')[0];
    return ntEntry && ntEntry.startTime;
  }
}

function firstPaintTime() {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'PerformancePaintTiming' does not exist o... Remove this comment to see the full error message
  if (window.PerformancePaintTiming) {
    const fpEntries = performance.getEntriesByType('paint');
    let fpStartTime;

    fpEntries.forEach((entry) => {
      if (entry.name === 'first-paint') {
        fpStartTime = entry.startTime;
      }
    });

    return fpStartTime;
  }
}

function firstContentfulPaintTime() {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'PerformancePaintTiming' does not exist o... Remove this comment to see the full error message
  if (window.PerformancePaintTiming) {
    const fpEntries = performance.getEntriesByType('paint');
    let fcpStartTime;

    fpEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        fcpStartTime = entry.startTime;
      }
    });

    return fcpStartTime;
  }
}

function finishDocumentLoadTime() {
  if (window.PerformanceNavigationTiming) {
    const ntEntry = performance.getEntriesByType('navigation')[0];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'domContentLoadedEventEnd' does not exist... Remove this comment to see the full error message
    return ntEntry && ntEntry.domContentLoadedEventEnd;
  }
}

function finishLoadTime() {
  if (window.PerformanceNavigationTiming) {
    const ntEntry = performance.getEntriesByType('navigation')[0];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loadEventEnd' does not exist on type 'Pe... Remove this comment to see the full error message
    return ntEntry && ntEntry.loadEventEnd;
  }
}

function resourceTimings() {
  if (window.PerformanceResourceTiming) {
    const rtEntry = performance.getEntriesByType('resource') || [];
    return rtEntry
      .filter((entry) => entry.name.endsWith('.js') || entry.name.endsWith('.css'))
      .map((entry) => {
        // `entry.toJSON()` is inconsistently implemented, edge browsers don't have it at the moment.
        const entryJson = entry.toJSON ? entry.toJSON() : {};
        const keysToKeep = ['duration', 'startTime', 'name', 'transferSize', 'decodedBodySize', 'encodedBodySize'];
        // Only keep certain keys by creating an array of objects and then merging with `Object.assign`
        return Object.assign({}, ...keysToKeep.map((key) => ({ [key]: entryJson[key] })));
      });
  }
}

function rawPerformanceNavigationTimingResults() {
  if (window.PerformanceNavigationTiming) {
    const ntEntry = performance.getEntriesByType('navigation')[0];
    // `ntEntry.toJSON()` is inconsistently implemented, edge browsers don't have it at the moment.
    return ntEntry && ntEntry.toJSON && ntEntry.toJSON();
  }
}

function _extractTiming(pageTiming: $TSFixMe) {
  return {
    // DNS query time
    dns: pageTiming.domainLookupEnd - pageTiming.domainLookupStart,
    // TCP connection time
    connection: pageTiming.connectEnd - pageTiming.connectStart,
    // Time spent during the request
    request: pageTiming.responseStart - pageTiming.requestStart,
    // Time spent retrieving the response
    response: pageTiming.responseEnd - pageTiming.responseStart,
  };
}

/**
 * These events are part of the experimental Network Information API, which exposes information about
 * the connection performance of the user's device.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 *
 */
function navigatorConnectionResults() {
  let connectionMetrics = {};
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Navi... Remove this comment to see the full error message
  if (navigator?.connection) {
    connectionMetrics = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Navi... Remove this comment to see the full error message
      bandwidthEstimateInMegabytesPerSecond: navigator?.connection?.downlink,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Navi... Remove this comment to see the full error message
      roundtripTimeEstimate: navigator?.connection?.rtt,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Navi... Remove this comment to see the full error message
      effectiveNetworkType: navigator?.connection?.effectiveType,
    };
  }
  return connectionMetrics;
}

function _extractPageTiming(pageTiming: $TSFixMe) {
  // https://coursera.slack.com/archives/siteperf/p1433356653000033
  const dataMissing = !pageTiming || pageTiming.navigationStart === 0;

  if (dataMissing) {
    return {};
  }

  const pageTimingRawData = {};

  for (const key in pageTiming) {
    if (typeof pageTiming[key] === 'number') {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      pageTimingRawData[key] = pageTiming[key];
    }
  }

  // PerformanceTiming APIs, which are deprecated and slated for removal at a later time
  // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming
  const performanceTimingResults = {
    // Total time from start to load
    totalload: pageTiming.loadEventEnd - pageTiming.navigationStart,
    // Time spent constructing the DOM tree
    domReady: pageTiming.domComplete - pageTiming.domInteractive,
    // Time spent during redirection
    redirect: pageTiming.redirectEnd - pageTiming.redirectStart,
    // AppCache
    appcache: pageTiming.domainLookupStart - pageTiming.fetchStart,
    // Time spent retrieving assets
    network: pageTiming.responseEnd - pageTiming.fetchStart,
    // Request to completion of the DOM loading
    initDomTree: pageTiming.domInteractive - pageTiming.responseEnd,
    // Time from when the network finishes to page loaded event
    pageload: pageTiming.loadEventEnd - pageTiming.responseEnd,
    // Time from user navigation until they can interact with page
    interactive: pageTiming.domInteractive - pageTiming.navigationStart,
  };

  const data = Object.assign(_extractTiming(pageTiming), performanceTimingResults);

  // PerformanceNavigationTiming APIs
  const performanceNavigationResults = {
    startLoadTime: startLoadTime(),
    firstPaint: firstPaintTime(),
    firstContentfulPaint: firstContentfulPaintTime(),
    finishDocumentLoadTime: finishDocumentLoadTime(),
    finishLoad: finishLoadTime(),
    resourceTimings: resourceTimings(),
    rawPerformanceNavigationTimingResults: rawPerformanceNavigationTimingResults(),
    ...navigatorConnectionResults(),
  };

  Object.keys(performanceNavigationResults).forEach((key) => {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (performanceNavigationResults[key]) {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      data[key] = performanceNavigationResults[key];
    }
  });

  return data;
}

function _extractResourceTiming(resourceTiming: $TSFixMe) {
  const resourceTimes = {
    duration: resourceTiming.duration,
    network: resourceTiming.responseEnd - resourceTiming.startTime,
  };

  return Object.assign(_extractTiming(resourceTiming), resourceTimes);
}

const _timerStart = (key: $TSFixMe) => key + '_start';
const _timerEnd = (key: $TSFixMe) => key + '_end';

class Timing {
  constructor(_performance: $TSFixMe, recordFn: $TSFixMe, options = {}) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    this.performance = _performance;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'record' does not exist on type 'Timing'.
    this.record = recordFn;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentTimeout' does not exist on type '... Remove this comment to see the full error message
    this.currentTimeout = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'keyFiles' does not exist on type 'Timing... Remove this comment to see the full error message
    this.keyFiles = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reportedEvents' does not exist on type '... Remove this comment to see the full error message
    this.reportedEvents = false;
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'timers' does not exist on type 'Timing'.... Remove this comment to see the full error message
    this.timers = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'delay' does not exist on type 'Timing'.
    this.delay = options.delay || 1000;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventingKey' does not exist on type 'Tim... Remove this comment to see the full error message
    this.eventingKey = options.eventingKey;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'usedSetMarkOnceKeys' does not exist on t... Remove this comment to see the full error message
    this.usedSetMarkOnceKeys = new Set();
  }

  setMarkOnce(markName: $TSFixMe, finalEvent: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'usedSetMarkOnceKeys' does not exist on t... Remove this comment to see the full error message
    if (!this.usedSetMarkOnceKeys.has(markName)) {
      this.setMark(markName, finalEvent);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'usedSetMarkOnceKeys' does not exist on t... Remove this comment to see the full error message
      this.usedSetMarkOnceKeys.add(markName);
    }
  }

  setMark(markName: $TSFixMe, finalEvent: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance && this.performance.timing && this.performance.mark) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      this.performance.mark(markName);
    }
    if (finalEvent) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentTimeout' does not exist on type '... Remove this comment to see the full error message
      if (this.currentTimeout) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentTimeout' does not exist on type '... Remove this comment to see the full error message
        window.clearTimeout(this.currentTimeout);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentTimeout' does not exist on type '... Remove this comment to see the full error message
      this.currentTimeout = window.setTimeout(this.reportDataToEventing.bind(this), this.delay);
    }
  }

  getKeyFileTiming() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance.getEntriesByType) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      const resources = this.performance.getEntriesByType('resource');
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'keyFiles' does not exist on type 'Timing... Remove this comment to see the full error message
      const fileList = this.keyFiles;
      const fileData = {};
      fileList.forEach((fileName: $TSFixMe) => {
        // Remove the file extension to support files versioned by file hash
        const fileNameWithoutExtension = fileName.replace(/\.\w+$/, '');
        const resourceTiming = resources.find(
          (resource: $TSFixMe) => resource.name.indexOf(fileNameWithoutExtension) !== -1
        );
        if (resourceTiming !== undefined) {
          // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          fileData[fileName] = _extractResourceTiming(resourceTiming);
        }
      });
      return fileData;
    } else {
      return {};
    }
  }

  getMarks = memoize(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance.getEntriesByType) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      const marksList = this.performance.getEntriesByType('mark');
      return marksList.reduce((marks: $TSFixMe, mark: $TSFixMe) => {
        marks[mark.name] = mark.startTime;
        return marks;
      }, {});
    } else {
      return {};
    }
  });

  getPageData() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    return _extractPageTiming(this.performance && this.performance.timing) || {};
  }

  // In our normal app rehydration flow, we measure the end of TTI in appStarterFactory, with the `serverRendering.completeRender` mark
  // in appStarterFactory. Since NextJS doesn't use Coursera's normal rehydration flow, we rely on NextJS's timing helpers to add the
  // `serverRendering.completeRender` marker, our source of truth for TTI times.
  getNextTTIMark() {
    const timers = this.getTimers();
    if (isNextJSApp && timers['Next.js-hydration'] && timers['Next.js-before-hydration']) {
      return {
        'serverRendering.completeRender': timers['Next.js-before-hydration'] + timers['Next.js-hydration'],
      };
    }
    return {};
  }

  getRehydrationTime() {
    const marks = this.getMarks();

    if (marks && marks['serverRendering.startRehydrate'] && marks['serverRendering.completeRender']) {
      return {
        rehydration: marks['serverRendering.completeRender'] - marks['serverRendering.startRehydrate'],
      };
    } else if (isNextJSApp && marks['Next.js-hydration']) {
      return {
        rehydration: marks['Next.js-hydration'],
      };
    }

    return {};
  }

  reportDataToEventing() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance && this.performance.timing && !this.reportedEvents) {
      const timingData = Object.assign(
        {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Window ... Remove this comment to see the full error message
          serverRendered: !!window.context || isNextJSApp, // only SSR rehydration sets window.context
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'REACT_CHECKSUM' does not exist on type '... Remove this comment to see the full error message
          reactChecksum: Math.abs(window.REACT_CHECKSUM), // CSR and SSR match when checksum exists
        },
        this.getPageData(),
        this.getKeyFileTiming(),
        this.getMarks(),
        this.getTimers(),
        this.getNextTTIMark(),
        this.getRehydrationTime()
      );
      const roundedTimingData = _roundNumbers(timingData);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'record' does not exist on type 'Timing'.
      this.record([this.eventingKey, roundedTimingData]);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reportedEvents' does not exist on type '... Remove this comment to see the full error message
      this.reportedEvents = true;
    }
  }

  time(key: $TSFixMe) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    this.setMark(_timerStart(key));
  }

  timeEnd(key: $TSFixMe) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    this.setMark(_timerEnd(key));

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance && this.performance.measure && this.performance.clearMarks) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      this.performance.measure(key, _timerStart(key), _timerEnd(key));
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      this.performance.clearMarks(_timerStart(key));
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      this.performance.clearMarks(_timerEnd(key));
    }
  }

  getTimers = memoize(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
    if (this.performance && this.performance.getEntriesByType) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'performance' does not exist on type 'Tim... Remove this comment to see the full error message
      const measures = this.performance.getEntriesByType('measure');
      return measures.reduce((marks: $TSFixMe, mark: $TSFixMe) => {
        marks[mark.name] = mark.duration;
        return marks;
      }, {});
    }
    return {};
  });

  setKeyFiles(files: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'keyFiles' does not exist on type 'Timing... Remove this comment to see the full error message
    this.keyFiles = files;
  }
}

// Expose this to help with testing
// @ts-expect-error ts-migrate(2339) FIXME: Property 'roundNumbers' does not exist on type 'Ti... Remove this comment to see the full error message
Timing.prototype.roundNumbers = _roundNumbers;

export default Timing;
