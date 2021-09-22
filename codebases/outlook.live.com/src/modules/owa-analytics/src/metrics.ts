import {
    createDatapoint,
    createUsageDatapoint,
    createPerformanceObserver,
    runAt,
} from './utils/factory';
import { lazyTti } from 'owa-tti';
import {
    lazyGetClickReport,
    lazyRegisterClickLagReport,
    ClickReport,
} from 'owa-useractivity-manager';
import { trace } from 'owa-trace';
import { getTotalResourceCount } from './utils/getResourceTimingForUrl';
import { setDatapointLayoutScore } from './datapoints/PerformanceDatapoint';

export const LONG_RUNNING_TASK_THRESHOLD = 500;
export const USER_INPUT_LAG_THRESHOLD = 250;

let numLagEvents: number = 0;
let numLongTasks: number = 0;
let interactive = false;
let layoutScore: number = 0;

export function trackUserCentricMetrics() {
    trackTimeToInteractive();
    trackTimeToPaint();
    trackLongRunningTasks();
    trackUserInputLag();
    scheduleTimeBasedQualityReports();
    trackLayoutShifts();
}

export function trackTimeToInteractive(done: (() => void) | null = null) {
    interactive = false;

    lazyTti.importAndExecute().then(time => {
        interactive = true;

        if (time) {
            const datapoint = createDatapoint('tti');
            datapoint.end(Math.round(time));
        }

        trace.info(`time to interactive:${time}`);
        done?.();
    });
}

export function trackTimeToPaint() {
    const entryType = 'paint';

    const ttpObserver = createPerformanceObserver(entryType, list => {
        for (const entry of list.getEntries()) {
            // `name` will be either 'first-paint' or 'first-contentful-paint'.  strip off all hyphens.
            const metricName = entry.name.replace(/[-]/g, '');
            const time = Math.round(entry.startTime + entry.duration);
            const datapoint = createDatapoint(metricName);

            datapoint.end(time);
            trace.info(`${metricName}:${time}`);
        }
    });

    ttpObserver && ttpObserver.observe({ entryTypes: [entryType] });
}

export function trackLongRunningTasks() {
    const entryType = 'longtask';
    const threshold: number = LONG_RUNNING_TASK_THRESHOLD;
    const taskObserver = createPerformanceObserver(entryType, list => {
        for (const entry of <PerformanceLongTaskTiming[]>list.getEntries()) {
            const metricName = 'LongRunningTask';
            const duration = Math.round(entry.duration);

            if (duration > threshold) {
                numLongTasks++;
                const datapoint = createDatapoint(metricName);

                entry.attribution &&
                    entry.attribution.some(a => {
                        a &&
                            datapoint.addCustomData({
                                id: a.containerId,
                                src: a.containerSrc,
                                type: a.containerType,
                                name: a.containerName,
                                time: entry.startTime,
                                interactive: interactive,
                            });
                        return !!a;
                    });
                datapoint.end(duration);
            }
        }
    });

    if (taskObserver) {
        taskObserver.observe({ entryTypes: [entryType] });
    } else {
        // this will help distinguish sessions which didn't have long tasks from
        // those that are incapable of reporting long tasks
        numLongTasks = -1;
    }
}

export function trackUserInputLag() {
    // the threshold at which we log input lag (user clicking/keying and the event firing)
    const threshold: number = USER_INPUT_LAG_THRESHOLD;
    numLagEvents = 0;

    lazyRegisterClickLagReport.import().then(registerLag => {
        registerLag({
            threshold: threshold,
            callback: report => {
                numLagEvents++;

                const datapoint = createDatapoint('InputLag');
                datapoint.addCustomData({
                    eventType: report.eventType,
                    eventTime: report.eventTime,
                    totalEvents: report.totalEvents,
                    lagEvents: numLagEvents,
                    interactive: interactive,
                });
                datapoint.end(report.lag);
            },
        });
    });
}

function trackLayoutShifts() {
    const entryType = 'layout-shift';
    const taskObserver = createPerformanceObserver(entryType, list => {
        for (const entry of <PerformanceLayoutShiftEntry[]>list.getEntries()) {
            if (!entry.hadRecentInput) {
                layoutScore += entry.value;
                setDatapointLayoutScore(layoutScore);
            }
        }
    });

    if (taskObserver) {
        taskObserver.observe({ type: entryType, buffered: true });
    } else {
        // this will help distinguish sessions which didn't have layout-shift from
        // those that are incapable of reporting layout-shift
        layoutScore = -1;
    }
}

export function scheduleTimeBasedQualityReports() {
    reportPostBootQuality([30000, 60000, 90000]);
}

function reportPostBootQuality(whens: number[]) {
    whens.forEach(when => {
        runAt(() => {
            lazyGetClickReport.import().then(getClickReport => {
                let totalEvents,
                    firstClick,
                    firstLag = -1;
                let report: ClickReport = getClickReport();
                if (report) {
                    totalEvents = report.totalClicks;
                    firstClick = report.firstClick;
                    firstLag = report.firstLag;
                }

                createUsageDatapoint('PostBootQuality', {
                    time: when,
                    lagEvents: numLagEvents,
                    totalEvents,
                    longTasks: numLongTasks,
                    firstClick,
                    firstLag,
                    resource: getTotalResourceCount(),
                    layoutScore,
                });
            });
        }, when);
    });
}
