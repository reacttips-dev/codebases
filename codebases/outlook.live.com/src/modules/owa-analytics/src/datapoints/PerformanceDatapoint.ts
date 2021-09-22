import { AriaDatapoint } from './AriaDatapoint';
import type { DatapointOptions } from 'owa-analytics-types';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';
import { getUniquePropertyString } from '../utils/getUniquePropertyString';
import { hasUserWindowHadFocusSince } from '../utils/visibilityState';
import { lazyLogPerformanceDatapoint } from '../lazyFunctions';
import type { TraceErrorObject } from 'owa-trace';
import { DatapointStatus, GenericKeys } from '../types/DatapointEnums';
import { safeRequestAnimationFrame } from 'owa-performance';
import { getGlobalImportStartTime } from 'owa-bundling-light';
import type { ErrorType } from 'owa-errors';

const performanceMarktQueryStringParam = 'pm';
const performanceMarkPrefix = 'owa-';
const defaultDatapointTimeout = 60 * 1000; // 60 seconds

let windowDefined = typeof window !== 'undefined';
let performanceMarkEnabled = windowDefined && window.performance && !!window.performance.mark;

let datapointLayoutScore: number = -1;
export function setDatapointLayoutScore(score: number) {
    datapointLayoutScore = score;
}

export class PerformanceDatapoint extends AriaDatapoint {
    hasEnded = false;
    private startTime: number | undefined;
    private startScore: number;
    private timeBeforePause: number = 0;
    waterfallTimings: { [key: string]: number } | undefined;
    duration: number | undefined;
    allRequestIds: string[] = [];
    responseCorrelationVectors: string[] = [];
    madeNetworkRequest = false;
    constructor(eventName: string, options?: DatapointOptions) {
        super(eventName, undefined, options);
        const importTime = getGlobalImportStartTime();
        this.startTime = importTime || Date.now();
        this.startScore = datapointLayoutScore;
        this.performanceMark('s');

        if (importTime) {
            this.addData('BundleTime', Date.now() - importTime);
        }

        // if the the datapoint doesn't end in 60 seconds, then end it with a timeout error
        setTimeout(
            // eslint-disable-next-line @typescript-eslint/no-implied-eval -- This is a function
            this.endWithTimeout.bind(this) as Function,
            options && typeof options.timeout == 'number'
                ? options.timeout
                : defaultDatapointTimeout
        );
    }
    isPeformanceMarkEnabled(): boolean {
        if (!performanceMarkEnabled) {
            return false;
        }

        return (
            hasQueryStringParameter(performanceMarktQueryStringParam) &&
            (!hasQueryStringParameter(performanceMarktQueryStringParam) ||
                this.eventName
                    .toLowerCase()
                    .indexOf(
                        getQueryStringParameter(performanceMarktQueryStringParam).toLowerCase()
                    ) > -1)
        );
    }

    addCheckmark(checkmarkName: string): number {
        this.performanceMark(checkmarkName);
        const time = this.timeFromStart();
        this.addToWaterfall(checkmarkName, time);
        return time;
    }
    addCheckpoint(checkpoint: string) {
        this.addToWaterfall(checkpoint, 1);
    }
    private addToWaterfall(key: string, time: number) {
        if (!this.waterfallTimings) {
            this.waterfallTimings = {};
        }
        try {
            const uniqueKey = getUniquePropertyString(this.waterfallTimings, key);
            if (uniqueKey) {
                this.waterfallTimings[uniqueKey] = time;
            }
        } catch {
            // We add checkmarks automatically within the action framework and there can be a lot
            // with the same exact name. So if we can't find a unique property name, don't add the
            // checkmark
        }
    }
    endWithError(
        status: DatapointStatus | ((duration?: number) => DatapointStatus),
        error?: TraceErrorObject,
        duration?: number,
        errorType?: ErrorType
    ): void {
        this.end(duration, status, error, errorType);
    }
    endAfterAnimationFrame() {
        safeRequestAnimationFrame(() => {
            this.end();
        });
    }
    end(
        duration?: number,
        overrideStatus?: DatapointStatus | ((duration?: number) => DatapointStatus),
        error?: TraceErrorObject,
        errorType?: ErrorType
    ): void {
        if (!this.hasEnded) {
            this.performanceMark('e');
            // if duration is not passed in, then calculate the time based of the current time it was ended and the time the datapoint was created.
            this.addData(
                GenericKeys.e2eTimeElapsed,
                typeof duration === 'number'
                    ? Math.floor(duration)
                    : this.timeFromStart() + this.timeBeforePause
            );
            if (this.startScore > -1) {
                this.addData('LayoutScore', datapointLayoutScore - this.startScore);
            }

            this.hasEnded = true;
            lazyLogPerformanceDatapoint.importAndExecute(this, overrideStatus, errorType, error);
        }
    }
    markUserPerceivedTime(waitForAnimationFrame?: boolean) {
        if (waitForAnimationFrame) {
            safeRequestAnimationFrame(this.addUserPerceivedTime.bind(this));
        } else {
            this.addUserPerceivedTime();
        }
    }
    invalidate() {
        this.hasEnded = true;
    }
    pause() {
        this.timeBeforePause += this.timeFromStart();
        this.startTime = undefined;
    }
    resume() {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
    }
    endAction(overrideStatus?: DatapointStatus, error?: TraceErrorObject): void {
        this.addData(GenericKeys.requestIds, this.allRequestIds.join(';'));
        this.addData(GenericKeys.correlationVectors, this.responseCorrelationVectors.join(';'));
        this.addData(GenericKeys.cache, this.madeNetworkRequest ? 'Cache' : 'NoCache');
        this.end(undefined, overrideStatus, error);
    }
    private addUserPerceivedTime(): void {
        this.addData('UserPerceivedTime', this.timeFromStart());
    }
    private performanceMark(value: string) {
        if (this.isPeformanceMarkEnabled()) {
            window.performance.mark(performanceMarkPrefix + this.eventName + '_' + value);
        }
    }
    private endWithTimeout() {
        if (!this.hasEnded && this.startTime && hasUserWindowHadFocusSince(this.startTime)) {
            this.options = this.options || {};
            this.options.logVerbose = true;
            this.endWithError(DatapointStatus.Timeout);
        }
    }
    private timeFromStart(): number {
        return this.startTime != null ? Date.now() - this.startTime : 0;
    }
}
