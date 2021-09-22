import * as factoryMethods from './utils/factory';
import { isSharedABTEnabled } from './utils/isSharedABTEnabled';

export interface ActivityManagerConfig {
    events: string[]; // list of events that are considered as user activity
    inactivityThreshold: number; // no.of milliseconds after which the user is considered inactive when there is no activity
    element: Element | Document; // The boolean to indicating that the event is dispatched to listner before being dispatched to EventTarget
    passive: boolean; // The boolean to indicate that event listner never calls preventDefault
    capture: boolean; // The element to which event listeners are added
}

const UNINITIALIZED: number = -1;
const DEFAULT_EVENTS = ['mousedown', 'keydown', 'scroll', 'mousewheel'];
const DEFAULT_ELEMENT: Element | Document = document;
const DEFAULT_CONFIG: ActivityManagerConfig = {
    events: DEFAULT_EVENTS,
    inactivityThreshold: 1 * 60 * 1000, // 1 min
    element: DEFAULT_ELEMENT,
    passive: true,
    capture: true,
};

interface LagReportRegistration {
    threshold: number;
    callback: (lag: LagReport) => void;
}

interface LagReport {
    readonly lag: number;
    readonly eventType: string;
    readonly eventTime: number;
    readonly totalEvents: number;
}

export interface ClickReport {
    firstLag: number;
    firstClick: number;
    totalClicks: number;
}

let lastActivityTime: number;
let config: ActivityManagerConfig | null = null;
let lagReports: Array<LagReportRegistration> = [];
let clickReport: ClickReport;

export function initialize(acitivtyManagerconfig: ActivityManagerConfig) {
    config = acitivtyManagerconfig;
    lastActivityTime = Date.now();
    lagReports = [];
    clickReport = { firstLag: -1, firstClick: -1, totalClicks: 0 };
    addEventListeners(config.element, config.events, handleEvent, config.capture, config.passive);
}

export function addEventListeners(
    element: Element | Document,
    events: string[],
    eventHandler: (e: Event) => void,
    capture: boolean,
    passive: boolean
) {
    if (element != null && events != null) {
        events.forEach(eventname =>
            element.addEventListener(eventname, eventHandler, {
                capture: capture,
                passive: passive,
            })
        );
    }
}

export function registerClickLagReport(report: LagReportRegistration) {
    lagReports.push(report);
}

export function getClickReport(): ClickReport {
    return clickReport;
}

export function handleEvent(event: Event) {
    const key = (<KeyboardEvent>event)?.key;
    if (key && (key == 'Alt' || key == 'Shift')) {
        return;
    }

    lastActivityTime = Date.now();

    const now = factoryMethods.now();
    if (typeof now === 'number' && event.type == 'mousedown') {
        clickReport.totalClicks++;

        const lag = now - event.timeStamp;
        let reportIt = lagReports.some(r => lag > r.threshold);

        if (clickReport.firstClick == UNINITIALIZED) {
            clickReport.firstClick = event.timeStamp;
            clickReport.firstLag = lag;
        }

        if (reportIt) {
            // report these outside the envelope of the handler to not add to the lag problem
            factoryMethods.queueTask(() => {
                lagReports.forEach(r => {
                    lag > r.threshold &&
                        r.callback({
                            lag: lag,
                            eventType: event.type,
                            eventTime: event.timeStamp,
                            totalEvents: clickReport.totalClicks,
                        });
                });
            });
        }
    }
}

export function isUserIdle(): boolean {
    if (config === null) {
        initializeActivityManager();
    }

    // `config` is intialized by above call if it was previously null
    if (Date.now() - lastActivityTime > config!.inactivityThreshold && !isSharedABTEnabled()) {
        return true;
    }
    return false;
}

export function getLastActivityTime() {
    return lastActivityTime;
}

export function initializeActivityManager() {
    if (config === null) {
        initialize(DEFAULT_CONFIG);
    }
}
